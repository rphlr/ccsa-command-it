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

// PUT /api/admin/users/[id] - Met à jour un utilisateur
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    const userId = params.id
    
    // Récupérer les données de mise à jour
    const updateData = await request.json()
    
    // Dans un environnement de production, vérifiez si l'utilisateur existe
    // puis mettez à jour ses informations dans la base de données
    
    // Simuler la récupération de l'utilisateur
    const mockUsers = [
      { id: '1', email: 'admin@christian-constantin.ch', name: 'Admin Principal', department: 'IT', role: 'admin', active: true },
      { id: '2', email: 'jean.dupont@christian-constantin.ch', name: 'Jean Dupont', department: 'Comptabilité', role: 'user', active: true },
    ]
    
    const user = mockUsers.find(u => u.id === userId)
    
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }
    
    // Vérifier que l'email est un email de l'entreprise si fourni
    if (updateData.email && !updateData.email.endsWith('@christian-constantin.ch')) {
      return NextResponse.json({ error: 'Email non autorisé' }, { status: 400 })
    }
    
    // Simuler la mise à jour
    const updatedUser = {
      ...user,
      ...updateData,
      // Ne pas inclure le mot de passe dans la réponse
      password: undefined
    }
    
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Supprime un utilisateur
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Vérifier si l'utilisateur est un administrateur
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }
    
    const userId = params.id
    
    // Dans un environnement de production, vérifiez si l'utilisateur existe
    // puis supprimez-le de la base de données
    
    // Vérifier que l'utilisateur n'essaie pas de supprimer son propre compte
    const authHeader = request.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, JWT_SECRET) as { email: string, id?: string }
      
      if (decoded.id === userId) {
        return NextResponse.json({ error: 'Vous ne pouvez pas supprimer votre propre compte' }, { status: 400 })
      }
    }
    
    // Simuler la vérification que l'utilisateur existe
    const userExists = ['1', '2', '3', '4', '5'].includes(userId)
    
    if (!userExists) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }
    
    // Simuler la suppression
    return NextResponse.json({ success: true, message: 'Utilisateur supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', details: (error as Error).message },
      { status: 500 }
    )
  }
}