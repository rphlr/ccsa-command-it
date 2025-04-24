import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// En production, utilisez une variable d'environnement
const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-tres-securise'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Vérifier que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }
    
    // Vérifier que l'email est un email de l'entreprise
    if (!email.endsWith('@christian-constantin.ch')) {
      return NextResponse.json({ error: 'Email non autorisé' }, { status: 401 })
    }
    
    // En production, vérifier les identifiants dans une base de données
    // Ici, nous acceptons n'importe quel mot de passe pour les tests
    
    // Générer un token JWT
    const token = jwt.sign(
      { 
        email,
        name: email.split('@')[0]
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        email,
        name: email.split('@')[0]
      }
    })
  } catch (error) {
    console.error('Erreur d\'authentification:', error)
    return NextResponse.json(
      { error: 'Échec de l\'authentification', details: (error as Error).message },
      { status: 500 }
    )
  }
}