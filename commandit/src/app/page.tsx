'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'
import { ModernHeader, ModernCategoryCard, ModernFooter } from './components/ModernUIComponents'

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page de connexion si non connecté
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null // Ne rien afficher pendant la redirection
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="flex-grow">
        <div className="max-w-6xl px-4 py-12 mx-auto">
          <div className="mb-12 text-center">
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              Portail de <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Commandes</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-600">
              Bienvenue sur le portail de commandes de Christian Constantin SA. Sélectionnez une catégorie ci-dessous pour passer votre commande.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <ModernCategoryCard 
              title="Papeterie" 
              description="Commandez des fournitures de papeterie et papier" 
              icon="📄"
              href="/commande/papeterie"
            />
            <ModernCategoryCard 
              title="Informatique" 
              description="Matériel et logiciels informatiques" 
              icon="💻"
              href="/commande/informatique"
            />
            <ModernCategoryCard 
              title="Mobilier de Bureau" 
              description="Mobilier et équipement de bureau" 
              icon="🪑"
              href="/commande/mobilier"
            />
            <ModernCategoryCard 
              title="Autres Demandes" 
              description="Demandes spéciales et fournitures diverses" 
              icon="📦"
              href="/commande/autres"
            />
          </div>
        </div>
      </main>
      
      <ModernFooter />
    </div>
  )
}