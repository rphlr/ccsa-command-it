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

// PUT /api/admin/orders/[id]/status - Met à jour le statut d'une commande
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    const orderId = params.id
    
    // Récupérer les données de mise à jour
    const { status } = await request.json()
    
    // Valider le statut
    const validStatuses = ['pending', 'approved', 'completed', 'rejected']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
    }
    
    // Dans un environnement de production, vérifiez si la commande existe
    // puis mettez à jour son statut dans la base de données
    
    // Simuler la récupération de la commande
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
      }
    ]
    
    const order = mockOrders.find(o => o.id === orderId)
    
    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }
    
    // Simuler la mise à jour
    const updatedOrder = {
      ...order,
      status
    }
    
    // Dans un environnement de production, envoyez une notification
    // à l'utilisateur concerné
    
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de la commande:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}