'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { orderService } from '../../services/orderService'
import { ModernHeader, ModernFooter, ModernButton } from '../../components/ModernUIComponents'

export default function PapeteriePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [notes, setNotes] = useState('')
  
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Color Copy 80 g/m² A4', quantity: 0, unit: 'paquet(s)' },
    { id: 2, name: 'Color Copy 160 g/m² A4', quantity: 0, unit: 'paquet(s)' },
    { id: 3, name: 'Color Copy 250 g/m² A4', quantity: 0, unit: 'paquet(s)' },
    { id: 4, name: 'Color Copy 90 g/m² A3', quantity: 0, unit: 'paquet(s)' },
    { id: 5, name: 'Color Copy Glossy 250 g/m² A3', quantity: 0, unit: 'paquet(s)' },
    { id: 6, name: 'Color Copy 250 g/m² A3', quantity: 0, unit: 'paquet(s)' },
    { id: 7, name: 'Feuilles transparentes A3 Clear Binding Covers', quantity: 0, unit: 'paquet(s)' },
    { id: 8, name: 'Dos pinçant 3 mm', quantity: 0, unit: 'paquet(s)' },
    { id: 9, name: 'Dos pinçant 5 mm', quantity: 0, unit: 'paquet(s)' },
  ])

  useEffect(() => {
    // Rediriger vers la page de connexion si non connecté
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleQuantityChange = (id, value) => {
    setOrderItems(orderItems.map(item => 
      item.id === id ? { ...item, quantity: parseInt(value) || 0 } : item
    ))
  }

  const handleSubmitOrder = async () => {
    setIsLoading(true)
    setError('')
    
    // Filtrer les articles avec une quantité > 0
    const itemsToOrder = orderItems.filter(item => item.quantity > 0)
    
    if (itemsToOrder.length === 0) {
      setError('Veuillez sélectionner au moins un article à commander.')
      setIsLoading(false)
      return
    }
    
    try {
      // Structure de l'ordre pour l'API
      const orderData = {
        type: 'Papeterie',
        items: itemsToOrder,
        notes: notes,
        date: new Date().toISOString(),
        requester: user?.email || ''
      }
      
      await orderService.sendOrder(orderData)
      setOrderSubmitted(true)
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err.error || 'Échec de l\'envoi de la commande. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null // Ne rien afficher pendant la redirection
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="flex-grow">
        {orderSubmitted ? (
          <div className="max-w-4xl px-4 py-12 mx-auto">
            <div className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="flex items-center justify-center w-16 h-16 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-center text-green-800">Commande soumise avec succès!</h2>
              <p className="mb-6 text-center text-green-700">
                Votre commande de papeterie a été envoyée à l'équipe IT. Vous recevrez une confirmation par email.
              </p>
              <div className="flex justify-center">
                <Link href="/" className="px-6 py-3 font-medium text-white transition-all bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-md hover:shadow-lg hover:translate-y-[-2px]">
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl px-4 py-8 mx-auto">
            <div className="flex items-center mb-8">
              <Link href="/" className="flex items-center mr-4 text-indigo-600 transition-colors hover:text-indigo-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Commande de Papeterie</h1>
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
            
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-gray-700 border-b bg-gray-50/80">Article</th>
                      <th className="p-3 text-center text-gray-700 border-b w-28 bg-gray-50/80">Quantité</th>
                      <th className="p-3 text-left text-gray-700 border-b w-28 bg-gray-50/80">Unité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item, index) => (
                      <tr key={item.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-indigo-50/30 transition-colors`}>
                        <td className="p-3 border-r border-gray-100">{item.name}</td>
                        <td className="p-3 border-r border-gray-100">
                          <input 
                            type="number" 
                            min="0" 
                            value={item.quantity} 
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-full p-2 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100"
                            disabled={isLoading}
                          />
                        </td>
                        <td className="p-3">{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mb-6">
                <label htmlFor="notes" className="block mb-2 font-medium text-gray-700">Notes supplémentaires:</label>
                <textarea 
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors"
                  rows={3}
                  placeholder="Informations complémentaires sur votre commande..."
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <ModernButton
                  onClick={handleSubmitOrder}
                  disabled={isLoading}
                  variant="primary"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : 'Soumettre la commande'}
                </ModernButton>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <ModernFooter />
    </div>
  )
}