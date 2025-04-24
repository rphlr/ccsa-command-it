import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

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

// GET /api/admin/settings - Récupère les paramètres du système
export async function GET(request: Request) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    // Dans un environnement de production, récupérez les paramètres depuis une base de données
    // Ici, nous retournons des données simulées
    const mockSettings = {
      company: {
        name: 'Christian Constantin SA',
        emailDomain: '@christian-constantin.ch',
        logo: null // Dans un environnement réel, cela serait une URL
      },
      email: {
        host: 'smtp.votreserveur.com',
        port: 587,
        secure: false,
        user: 'noreply@christian-constantin.ch',
        pass: 'votre-mot-de-passe', // En production, ne jamais renvoyer le mot de passe réel
        notificationEmails: ['it@christian-constantin.ch']
      },
      security: {
        sessionDuration: 24, // en heures
        maxLoginAttempts: 5
      },
      departments: [
        'Direction', 'Comptabilité', 'RH', 'IT', 'Marketing', 'Commercial', 'Technique', 'Administratif'
      ]
    }
    
    return NextResponse.json(mockSettings)
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// PUT /api/admin/settings - Met à jour les paramètres du système
export async function PUT(request: Request) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    // Récupérer les données de mise à jour
    const settings = await request.json()
    
    // Valider les données
    if (!settings.company || !settings.email) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })
    }
    
    // Dans un environnement de production, mettez à jour les paramètres dans la base de données
    
    // Simuler la mise à jour
    return NextResponse.json({ 
      success: true, 
      message: 'Paramètres mis à jour avec succès',
      // En pratique, ne renvoyez pas les identifiants sensibles
      settings: {
        ...settings,
        email: {
          ...settings.email,
          pass: settings.email.pass ? '••••••••••' : '' // Ne pas révéler le mot de passe
        }
      }
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}