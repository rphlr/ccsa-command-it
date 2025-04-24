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

// GET /api/admin/orders - Récupère toutes les commandes
export async function GET(request: Request) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    // Dans un environnement de production, récupérez les commandes depuis une base de données
    // Ici, nous retournons des données simulées
    const mockOrders = [
      { 
        id: '1', 
        type: 'Papeterie', 
        requester: 'jean.dupont@christian-constantin.ch', 
        date: '2024-04-23T14:35:22', 
        status: 'pending',
        items: [
          { name: 'Color Copy 80 g/m² A4', quantity: 5, unit: 'paquet(s)' },
          { name: 'Dos pinçant 3 mm', quantity: 10, unit: 'paquet(s)' }
        ]
      },
      { 
        id: '2', 
        type: 'Informatique', 
        requester: 'sophie.leroy@christian-constantin.ch', 
        date: '2024-04-22T09:12:45', 
        status: 'approved',
        items: [
          { name: 'Écran Dell 27 pouces', quantity: 1, description: 'Écran pour station de travail marketing' }
        ]
      },
      { 
        id: '3', 
        type: 'Papeterie', 
        requester: 'marie.martin@christian-constantin.ch', 
        date: '2024-04-20T16:47:33', 
        status: 'completed',
        items: [
          { name: 'Color Copy 160 g/m² A4', quantity: 2, unit: 'paquet(s)' },
          { name: 'Color Copy 90 g/m² A3', quantity: 1, unit: 'paquet(s)' }
        ]
      },
      { 
        id: '4', 
        type: 'Informatique', 
        requester: 'pierre.blanc@christian-constantin.ch', 
        date: '2024-04-19T11:30:15', 
        status: 'rejected',
        items: [
          { name: 'MacBook Pro 16"', quantity: 1, description: 'Remplacement poste commercial' }
        ]
      },
    ]
    
    return NextResponse.json(mockOrders)
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}