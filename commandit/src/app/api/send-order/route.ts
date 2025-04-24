import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// En production, utilisez des variables d'environnement
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.votreserveur.com'
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587')
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true'
const EMAIL_USER = process.env.EMAIL_USER || 'noreply@christian-constantin.ch'
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'votre-mot-de-passe'

export async function POST(request: Request) {
  try {
    const { type, items, notes, requester } = await request.json()
    
    if (!type || !items || !requester) {
      return NextResponse.json({ error: 'Données de commande incomplètes' }, { status: 400 })
    }
    
    // Vérifier que l'email du demandeur est un email de l'entreprise
    if (!requester.endsWith('@christian-constantin.ch')) {
      return NextResponse.json({ error: 'Email du demandeur non autorisé' }, { status: 403 })
    }
    
    // Formater les items pour l'affichage dans l'email
    let itemsHtml = '<table border="1" cellpadding="8" style="border-collapse: collapse; width: 100%;">'
    itemsHtml += '<tr><th style="text-align: left;">Article</th><th style="text-align: center;">Quantité</th>'
    
    // Ajouter les colonnes supplémentaires selon le type de commande
    if (type === 'Informatique') {
      itemsHtml += '<th style="text-align: left;">Description</th>'
    } else {
      itemsHtml += '<th style="text-align: left;">Unité</th>'
    }
    
    itemsHtml += '</tr>'
    
    // Ajouter les lignes de produits
    items.forEach((item: any) => {
      itemsHtml += '<tr>'
      itemsHtml += `<td>${item.name}</td>`
      itemsHtml += `<td style="text-align: center;">${item.quantity}</td>`
      
      if (type === 'Informatique') {
        itemsHtml += `<td>${item.description || '-'}</td>`
      } else {
        itemsHtml += `<td>${item.unit}</td>`
      }
      
      itemsHtml += '</tr>'
    })
    
    itemsHtml += '</table>'
    
    // Construire le corps de l'email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #333;">Nouvelle Commande de ${type}</h1>
        </div>
        
        <div style="padding: 20px;">
          <p><strong>De:</strong> ${requester}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-CH', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          
          <h2 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Articles commandés</h2>
          ${itemsHtml}
          
          ${notes ? `
            <h2 style="margin-top: 30px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Notes</h2>
            <p>${notes.replace(/\n/g, '<br>')}</p>
          ` : ''}
          
          <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.9em; color: #777;">
            Ce message a été généré automatiquement par le portail de commandes internes de Christian Constantin SA.
          </p>
        </div>
      </div>
    `
    
    // Configurer le transporteur d'emails
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    })
    
    // Envoyer l'email
    const mailOptions = {
      from: EMAIL_USER,
      to: 'it@christian-constantin.ch',
      subject: `[Commande ${type}] - ${requester}`,
      html: htmlContent,
    }
    
    await transporter.sendMail(mailOptions)
    
    return NextResponse.json({ success: true, message: 'Commande envoyée avec succès' })
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return NextResponse.json(
      { error: 'Échec de l\'envoi de l\'email', details: (error as Error).message },
      { status: 500 }
    )
  }
}