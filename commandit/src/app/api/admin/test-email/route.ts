import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

// En production, utilisez une variable d'environnement
const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-tres-securise'

// Middleware pour vérifier si l'utilisateur est un administrateur
const isAdmin = (request: Request) => {
  // Récupérer le token d'authentification depuis les en-têtes
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }
  
  const token = authHeader.substring(7)
  
  try {
    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string, name: string, role?: string }
    
    // Vérifier si l'utilisateur est un administrateur
    return decoded.role === 'admin' || 
      ['admin@christian-constantin.ch', 'it@christian-constantin.ch'].includes(decoded.email)
  } catch (error) {
    console.error('Erreur de vérification du token:', error)
    return false
  }
}

// POST /api/admin/test-email - Teste la configuration email
export async function POST(request: Request) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    // Dans un environnement de production, récupérez les paramètres d'email depuis la base de données
    // Ici, nous utilisons des valeurs codées en dur pour la démonstration
    const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.votreserveur.com'
    const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587')
    const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true'
    const EMAIL_USER = process.env.EMAIL_USER || 'noreply@christian-constantin.ch'
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'votre-mot-de-passe'
    
    // Récupérez l'email de l'administrateur connecté
    let adminEmail = 'admin@christian-constantin.ch' // Par défaut
    
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
      adminEmail = decoded.email
    }
    
    try {
      // Configurer le transporteur d'emails pour le test
      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: EMAIL_PORT,
        secure: EMAIL_SECURE,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        },
      })
      
      // Envoyer un email de test
      const mailOptions = {
        from: EMAIL_USER,
        to: adminEmail,
        subject: 'Test de configuration email - CommandIT',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
              <h1 style="margin: 0; color: #333;">Test de Configuration Email</h1>
            </div>
            
            <div style="padding: 20px;">
              <p>Bonjour,</p>
              <p>Si vous recevez cet email, cela signifie que la configuration email du portail CommandIT est correcte.</p>
              <p>Ce message a été généré automatiquement suite à une demande de test depuis le panneau d'administration.</p>
              <p>Date et heure du test: ${new Date().toLocaleString('fr-CH')}</p>
              
              <p style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.9em; color: #777;">
                Ce message a été généré automatiquement par le portail de commandes internes de Christian Constantin SA.
              </p>
            </div>
          </div>
        `
      }
      
      // En production, envoyez réellement l'email
      // await transporter.sendMail(mailOptions)
      
      // Simuler l'envoi réussi
      return NextResponse.json({
        success: true,
        message: 'Email de test envoyé avec succès à ' + adminEmail
      })
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi de l\'email de test:', emailError)
      return NextResponse.json({
        success: false,
        message: 'Échec de l\'envoi de l\'email de test',
        error: (emailError as Error).message
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Erreur lors du test de configuration email:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}