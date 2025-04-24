'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'
import { ModernHeader, ModernFooter, ModernButton } from '../../components/ModernUIComponents'

export default function GenericOrderPage({ params }: { params: { type: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const type = params.type

  useEffect(() => {
    // Rediriger vers la page de connexion si non connecté
    if (!user) {
      router.push('/login')
    }

    // Si c'est une page spécifique, rediriger vers cette page
    if (type === 'papeterie' || type === 'informatique') {
      router.push(`/commande/${type}`)
    }
  }, [user, router, type])

  if (!user) {
    return null // Ne rien afficher pendant la redirection
  }

  // Obtenir le titre de la page en fonction du type
  const getPageTitle = () => {
    switch (type) {
      case 'mobilier':
        return 'Mobilier de Bureau'
      case 'autres':
        return 'Fournitures Diverses'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  // Obtenir l'icône en fonction du type
  const getTypeIcon = () => {
    switch (type) {
      case 'mobilier':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
      case 'autres':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ModernHeader />
      
      <main className="flex-grow page-transition">
        <div className="max-w-4xl px-4 py-8 mx-auto">
          <div className="flex items-center mb-8">
            <Link href="/" className="flex items-center mr-4 text-indigo-600 transition-colors hover:text-indigo-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Commande de {getPageTitle()}</h1>
          </div>
          
          <div className="p-8 bg-white rounded-xl shadow-md hover-lift">
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center w-24 h-24 mb-6 bg-indigo-100 rounded-full">
                {getTypeIcon()}
              </div>
              <h2 className="mb-2 text-xl font-bold text-center text-gray-800">Module en développement</h2>
              <p className="text-center text-gray-600">
                Cette fonctionnalité sera bientôt disponible
              </p>
            </div>
            
            <div className="p-6 mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mt-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="mb-2 font-semibold text-indigo-700">Information</h3>
                  <p className="text-indigo-600">
                    La page de commande de {getPageTitle().toLowerCase()} est actuellement en cours de développement. 
                    Vous pourrez bientôt commander ces articles directement depuis cette interface.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="text-sm text-gray-600">
                Avez-vous besoin d'aide immédiate?
              </div>
              <Link href="mailto:it@christian-constantin.ch" className="text-sm text-indigo-600 hover:text-indigo-800">
                Contacter l'équipe IT
              </Link>
            </div>
            
            <div className="flex justify-center mt-8">
              <Link href="/" className="inline-flex items-center justify-center px-6 py-3 font-medium text-white transition-all bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-md hover:shadow-lg hover:translate-y-[-2px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <ModernFooter />
    </div>
  )
}