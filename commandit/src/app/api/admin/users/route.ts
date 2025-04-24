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
    // Dans un environnement de production, récupérez le rôle depuis la base de données
    return decoded.role === 'admin' || 
      ['admin@christian-constantin.ch', 'it@christian-constantin.ch'].includes(decoded.email)
  } catch (error) {
    console.error('Erreur de vérification du token:', error)
    return false
  }
}

// GET /api/admin/users - Récupère tous les utilisateurs
export async function GET(request: Request) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    // Dans un environnement de production, récupérez les utilisateurs depuis une base de données
    // Ici, nous retournons des données simulées
    const mockUsers = [
      { id: '1', email: 'admin@christian-constantin.ch', name: 'Admin Principal', department: 'IT', role: 'admin', active: true, lastLogin: '2024-04-23T08:45:12' },
      { id: '2', email: 'jean.dupont@christian-constantin.ch', name: 'Jean Dupont', department: 'Comptabilité', role: 'user', active: true, lastLogin: '2024-04-22T14:20:45' },
      { id: '3', email: 'marie.martin@christian-constantin.ch', name: 'Marie Martin', department: 'RH', role: 'user', active: true, lastLogin: '2024-04-20T09:15:30' },
      { id: '4', email: 'pierre.blanc@christian-constantin.ch', name: 'Pierre Blanc', department: 'Commercial', role: 'user', active: false, lastLogin: '2024-03-15T16:10:22' },
      { id: '5', email: 'sophie.leroy@christian-constantin.ch', name: 'Sophie Leroy', department: 'Marketing', role: 'user', active: true, lastLogin: '2024-04-21T11:05:18' },
    ]
    
    return NextResponse.json(mockUsers)
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// POST /api/admin/users - Ajoute un nouvel utilisateur
export async function POST(request: Request) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    // Récupérer les données de l'utilisateur
    const userData = await request.json()
    
    // Valider les données
    if (!userData.email || !userData.name || !userData.password || !userData.department) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 })
    }
    
    // Vérifier que l'email est un email de l'entreprise
    if (!userData.email.endsWith('@christian-constantin.ch')) {
      return NextResponse.json({ error: 'Email non autorisé' }, { status: 400 })
    }
    
    // Dans un environnement de production, ajoutez l'utilisateur à la base de données
    // Ici, nous simulons un ajout réussi
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      name: userData.name,
      department: userData.department,
      role: userData.role || 'user',
      active: userData.active !== undefined ? userData.active : true,
      lastLogin: null
    }
    
    return NextResponse.json(newUser)
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}