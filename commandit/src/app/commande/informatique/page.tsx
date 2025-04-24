'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { orderService } from '../../services/orderService'
import { ModernHeader, ModernFooter, ModernButton, ModernInput } from '../../components/ModernUIComponents'

type Product = {
  id: number
  name: string
  quantity: number
  description: string
}

export default function InformatiquePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 1, description: '' })
  const [orderNotes, setOrderNotes] = useState('')

  useEffect(() => {
    // Rediriger vers la page de connexion si non connecté
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Ajouter un produit à la liste
  const addProduct = () => {
    if (!newProduct.name.trim()) {
      setError('Veuillez spécifier un nom de produit')
      return
    }
    
    setProducts([...products, { ...newProduct, id: Date.now() }])
    setNewProduct({ name: '', quantity: 1, description: '' })
    setError('')
  }
  
  // Supprimer un produit de la liste
  const removeProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id))
  }
  
  // Soumettre la commande
  const submitOrder = async () => {
    if (products.length === 0) {
      setError('Veuillez ajouter au moins un produit à votre commande')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Structure de la commande
      const orderData = {
        type: 'Informatique',
        items: products,
        notes: orderNotes,
        date: new Date().toISOString(),
        requester: user?.email || ''
      }
      
      await orderService.sendOrder(orderData)
      setOrderSubmitted(true)
      window.scrollTo(0, 0)
    } catch (err: any) {
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
      
      <main className="flex-grow page-transition">
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
                Votre commande de matériel informatique a été envoyée à l'équipe IT. Vous recevrez une confirmation par email.
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
              <h1 className="text-2xl font-bold text-gray-900">Commande de Matériel Informatique</h1>
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
            
            <div className="p-6 mb-6 bg-white rounded-xl shadow-md hover-lift">
              <h2 className="mb-6 text-xl font-bold text-gray-800">Ajouter un produit</h2>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="form-label-modern">Nom du produit</label>
                  <input 
                    type="text" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="form-input-modern"
                    placeholder="Ex: MacBook Pro, Écran HP 27''"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="form-label-modern">Quantité</label>
                  <input 
                    type="number" 
                    min="1"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 1})}
                    className="form-input-modern"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="form-label-modern">Description / Spécifications</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="form-input-modern"
                  rows={2}
                  placeholder="Spécifications, modèle, caractéristiques souhaitées..."
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <div className="mt-6">
                <ModernButton
                  onClick={addProduct}
                  disabled={isLoading}
                  variant="primary"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Ajouter
                  </span>
                </ModernButton>
              </div>
            </div>
            
            {products.length > 0 && (
              <div className="p-6 mb-6 bg-white rounded-xl shadow-md hover-lift">
                <h2 className="mb-6 text-xl font-bold text-gray-800">Articles à commander</h2>
                
                <div className="overflow-x-auto mb-6">
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th className="rounded-tl-lg">Produit</th>
                        <th className="text-center w-20">Qté</th>
                        <th>Description</th>
                        <th className="text-center w-24 rounded-tr-lg">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="font-medium">{product.name}</td>
                          <td className="text-center">{product.quantity}</td>
                          <td className="text-sm">{product.description || "-"}</td>
                          <td className="text-center">
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                              disabled={isLoading}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="orderNotes" className="form-label-modern">Notes supplémentaires:</label>
                  <textarea 
                    id="orderNotes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="form-input-modern"
                    rows={3}
                    placeholder="Informations complémentaires, urgence, etc."
                    disabled={isLoading}
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <ModernButton 
                    onClick={submitOrder}
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
                    ) : (
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Soumettre la commande
                      </span>
                    )}
                  </ModernButton>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      
      <ModernFooter />
    </div>
  )
}