'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { ModernHeader, ModernFooter, ModernButton, ModernInput, ModernSelect } from '../components/ModernUIComponents'

// Types pour les données d'administration
type User = {
  id: string
  email: string
  name: string
  department: string
  role: 'user' | 'admin'
  active: boolean
  lastLogin?: string
}

type Order = {
  id: string
  type: string
  requester: string
  date: string
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  items: { name: string; quantity: number; unit?: string; description?: string }[]
}

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('users')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // États pour les données
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [departements, setDepartements] = useState<string[]>([
    'Direction', 'Comptabilité', 'RH', 'IT', 'Marketing', 'Commercial', 'Technique', 'Administratif'
  ])
  
  // États pour le formulaire d'ajout/modification d'utilisateur
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [userForm, setUserForm] = useState({
    email: '',
    name: '',
    department: 'IT',
    role: 'user',
    password: '',
    active: true
  })
  
  // États pour la recherche et le filtrage
  const [userSearch, setUserSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  useEffect(() => {
    // Rediriger si non connecté ou non admin
    if (!user) {
      router.push('/login')
      return
    }
    
    if (!isAdmin(user.email)) {
      router.push('/')
      return
    }
    
    // Charger les données
    loadUsers()
    loadOrders()
  }, [user, router])
  
  // Vérifier si l'utilisateur est administrateur
  const isAdmin = (email: string) => {
    // Liste des administrateurs (à remplacer par une vérification en base de données)
    const adminList = ['admin@christian-constantin.ch', 'it@christian-constantin.ch']
    return adminList.includes(email)
  }
  
  // Charger les utilisateurs depuis l'API
  const loadUsers = async () => {
    setIsLoading(true)
    
    try {
      // Simulation de chargement (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Données simulées
      const mockUsers: User[] = [
        { id: '1', email: 'admin@christian-constantin.ch', name: 'Admin Principal', department: 'IT', role: 'admin', active: true, lastLogin: '2024-04-23T08:45:12' },
        { id: '2', email: 'jean.dupont@christian-constantin.ch', name: 'Jean Dupont', department: 'Comptabilité', role: 'user', active: true, lastLogin: '2024-04-22T14:20:45' },
        { id: '3', email: 'marie.martin@christian-constantin.ch', name: 'Marie Martin', department: 'RH', role: 'user', active: true, lastLogin: '2024-04-20T09:15:30' },
        { id: '4', email: 'pierre.blanc@christian-constantin.ch', name: 'Pierre Blanc', department: 'Commercial', role: 'user', active: false, lastLogin: '2024-03-15T16:10:22' },
        { id: '5', email: 'sophie.leroy@christian-constantin.ch', name: 'Sophie Leroy', department: 'Marketing', role: 'user', active: true, lastLogin: '2024-04-21T11:05:18' },
      ]
      
      setUsers(mockUsers)
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Charger les commandes depuis l'API
  const loadOrders = async () => {
    setIsLoading(true)
    
    try {
      // Simulation de chargement (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Données simulées
      const mockOrders: Order[] = [
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
      
      setOrders(mockOrders)
    } catch (err) {
      setError('Erreur lors du chargement des commandes')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Gérer la soumission du formulaire utilisateur
  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Validation de base
      if (!userForm.email || !userForm.name) {
        throw new Error('Veuillez remplir tous les champs obligatoires')
      }
      
      if (!userForm.email.endsWith('@christian-constantin.ch')) {
        throw new Error('L\'email doit être un email d\'entreprise (@christian-constantin.ch)')
      }
      
      if (!isEditingUser && !userForm.password) {
        throw new Error('Le mot de passe est obligatoire pour un nouvel utilisateur')
      }
      
      // Simulation d'un appel API (à remplacer par un appel réel)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (isEditingUser && editingUserId) {
        // Mise à jour utilisateur existant
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === editingUserId ? 
            { 
              ...user, 
              email: userForm.email,
              name: userForm.name,
              department: userForm.department,
              role: userForm.role as 'user' | 'admin',
              active: userForm.active
            } : user
          )
        )
        setSuccess(`L'utilisateur ${userForm.name} a été mis à jour avec succès`)
      } else {
        // Ajout nouvel utilisateur
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: userForm.email,
          name: userForm.name,
          department: userForm.department,
          role: userForm.role as 'user' | 'admin',
          active: userForm.active
        }
        
        setUsers(prevUsers => [...prevUsers, newUser])
        setSuccess(`L'utilisateur ${userForm.name} a été créé avec succès`)
      }
      
      // Réinitialiser le formulaire
      resetUserForm()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Une erreur est survenue')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  // Réinitialiser le formulaire utilisateur
  const resetUserForm = () => {
    setUserForm({
      email: '',
      name: '',
      department: 'IT',
      role: 'user',
      password: '',
      active: true
    })
    setIsEditingUser(false)
    setEditingUserId(null)
  }
  
  // Éditer un utilisateur
  const editUser = (user: User) => {
    setUserForm({
      email: user.email,
      name: user.name,
      department: user.department,
      role: user.role,
      password: '', // Le mot de passe n'est pas chargé pour des raisons de sécurité
      active: user.active
    })
    setIsEditingUser(true)
    setEditingUserId(user.id)
    setActiveTab('userForm')
  }
  
  // Supprimer un utilisateur
  const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return
    }
    
    setIsLoading(true)
    
    try {
      // Simulation d'un appel API (à remplacer par un appel réel)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      setSuccess('Utilisateur supprimé avec succès')
    } catch (err) {
      setError('Erreur lors de la suppression de l\'utilisateur')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Changer le statut d'une commande
  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'approved' | 'completed' | 'rejected') => {
    setIsLoading(true)
    
    try {
      // Simulation d'un appel API (à remplacer par un appel réel)
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      )
      
      setSuccess(`Statut de la commande mis à jour avec succès`)
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearch.toLowerCase())
  )
  
  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const searchMatch = 
      order.requester.toLowerCase().includes(orderSearch.toLowerCase()) || 
      order.type.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.id.toLowerCase().includes(orderSearch.toLowerCase())
    
    const statusMatch = statusFilter === 'all' || order.status === statusFilter
    
    return searchMatch && statusMatch
  })
  
  // Formatter une date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleString('fr-CH', options)
  }
  
  // Afficher le badge de statut
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Approuvé' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Complété' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejeté' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <span className={`px-2 py-1 text-xs font-medium ${config.bg} ${config.text} rounded-full`}>
        {config.label}
      </span>
    )
  }

  if (!user) {
    return null // Ne rien afficher pendant la redirection
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="flex-grow page-transition">
        <div className="max-w-7xl px-4 py-8 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Administration du Portail</h1>
            <p className="mt-2 text-gray-600">Gérez les utilisateurs, les commandes et les paramètres du système</p>
          </div>
          
          {error && (
            <div className="p-4 mb-6 text-sm text-red-700 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="p-4 mb-6 text-sm text-green-700 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {success}
              </div>
            </div>
          )}
          
          {/* Onglets */}
          <div className="mb-6 border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                    activeTab === 'users' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Utilisateurs
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                    activeTab === 'orders' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Commandes
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => { setActiveTab('userForm'); setIsEditingUser(false); resetUserForm(); }}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                    activeTab === 'userForm' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Ajouter Utilisateur
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                    activeTab === 'settings' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </button>
              </li>
            </ul>
          </div>
          
            {/* Onglet 'Commandes' */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
                <p className="mt-1 text-gray-600">Ajoutez, modifiez ou supprimez des utilisateurs du portail</p>
                
                <div className="mt-4">
                  <ModernInput
                    label="Rechercher un utilisateur"
                    id="userSearch"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Nom, email ou département..."
                  />
                </div>
              </div>
              
              <div className="p-6">
                {isLoading && filteredUsers.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Chargement des utilisateurs...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>Aucun utilisateur trouvé</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full overflow-hidden rounded-lg modern-table">
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Email</th>
                          <th>Département</th>
                          <th>Rôle</th>
                          <th>Statut</th>
                          <th>Dernière Connexion</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="font-medium">{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.department}</td>
                            <td>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.role === 'admin' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                              </span>
                            </td>
                            <td>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                user.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.active ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td>
                              {user.lastLogin ? formatDate(user.lastLogin) : '-'}
                            </td>
                            <td>
                              <div className="flex items-center justify-center space-x-2">
                                <button
                                  onClick={() => editUser(user)}
                                  className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                                  title="Modifier"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                  title="Supprimer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Contenu de l'onglet 'Commandes' */}
            {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Gestion des Commandes</h2>
                <p className="mt-1 text-gray-600">Consultez et gérez les commandes en cours</p>
                
                <div className="mt-4">
                  <ModernInput
                    label="Rechercher une commande"
                    id="orderSearch"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="ID de commande, type ou demandeur..."
                  />
                </div>
              </div>
              
              <div className="p-6">
                {isLoading && filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>Chargement des commandes...</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>Aucune commande trouvée</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full overflow-hidden rounded-lg modern-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Type</th>
                          <th>Demandeur</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Articles</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="font-medium">{order.id}</td>
                            <td>{order.type}</td>
                            <td>{order.requester}</td>
                            <td>{formatDate(order.date)}</td>
                            <td>{renderStatusBadge(order.status)}</td>
                            <td>
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                  {item.name} ({item.quantity} {item.unit || 'unités'})
                                  {item.description && ` - ${item.description}`}
                                </div>
                              ))}
                            </td>
                            <td>
                              <div className="flex items-center justify-center space-x-2">
                                {order.status !== 'completed' && (
                                  <>
                                    {['pending', 'approved'].includes(order.status) && (
                                      <>
                                        <button
                                          onClick={() => updateOrderStatus(order.id, 'completed')}
                                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                                          title="Marquer comme complété"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        </button>
                                      </>
                                    )}
                                    {order.status === 'pending' && (
                                      <>
                                        <button
                                          onClick={() => updateOrderStatus(order.id, 'approved')}
                                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                                          title="Approuver"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() => updateOrderStatus(order.id, 'rejected')}
                                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                          title="Rejeter"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'completed')}
                                  className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                                  title="Voir détails"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'rejected')}
                                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                  title="Supprimer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
            
            {/* Contenu de l'onglet 'Ajouter Utilisateur' */}
          {activeTab === 'userForm' && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">{isEditingUser ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}</h2>
                <p className="mt-1 text-gray-600">{isEditingUser ? 'Modifiez les informations de l\'utilisateur' : 'Ajoutez un nouvel utilisateur au système'}</p>
                
                <form onSubmit={handleUserFormSubmit} className="mt-4">
                  <ModernInput
                    label="Email"
                    id="email"
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="Email de l'utilisateur"
                    required
                  />
                  <ModernInput
                    label="Nom"
                    id="name"
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="Nom complet de l'utilisateur"
                    required
                  />
                  <ModernSelect
                    label="Département"
                    id="department"
                    value={userForm.department}
                    onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                  >
                    <option value="IT">IT</option>
                    <option value="Comptabilité">Comptabilité</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Marketing">Marketing</option>
                  </ModernSelect>
                  <ModernSelect
                    label="Rôle"
                    id="role"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </ModernSelect>
                  {!isEditingUser && (
                    <ModernInput
                      label="Mot de passe"
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="Mot de passe de l'utilisateur"
                      required
                    />
                  )}
                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="active"
                      checked={userForm.active}
                      onChange={(e) => setUserForm({ ...userForm, active: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                      Activer l'utilisateur
                    </label>
                  </div>
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      {isEditingUser ? 'Mettre à jour' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={resetUserForm}
                      className="ml-4 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
            
            {/* Contenu de l'onglet 'Paramètres' */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Paramètres du Système</h2>
                <p className="mt-1 text-gray-600">Gérez les paramètres généraux du système</p>
                
                {/* Contenu des paramètres */}
                <div className="mt-4">
                  <p>Contenu des paramètres à venir...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <ModernFooter />
    </div>
  )
}