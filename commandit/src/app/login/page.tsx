'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { ModernInput, ModernButton } from '../components/ModernUIComponents.tsx'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user, login, isLoading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page d'accueil si déjà connecté
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-8 py-10 mx-4 bg-white rounded-2xl shadow-xl">
        <div className="mb-8 text-center">
          {/* Logo - Remplacer par votre propre logo si disponible */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-9 h-9"
              >
                <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Portail de Commandes
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Christian Constantin SA
          </p>
        </div>
        
        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <ModernInput
            label="Email professionnel"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
            placeholder="prenom.nom@christian-constantin.ch"
            disabled={isLoading}
          />
          
          <ModernInput
            label="Mot de passe"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
            disabled={isLoading}
          />
          
          <div className="pt-2">
            <ModernButton
              type="submit"
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </ModernButton>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Accès réservé aux employés de Christian Constantin SA
          </p>
        </div>
      </div>
    </div>
  )
}