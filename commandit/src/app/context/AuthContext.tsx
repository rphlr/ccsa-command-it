'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  email: string
  name?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: string
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Créer un contexte avec une valeur par défaut (undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')

    try {
      // Pour simplifier, uniquement vérifier le domaine de l'email
      if (!email.endsWith('@christian-constantin.ch')) {
        throw new Error('Seuls les employés de Christian Constantin SA peuvent accéder à cette application')
      }

      // Simulation d'une connexion réussie
      const userData = { 
        email,
        name: email.split('@')[0]
      }
      
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      router.push('/')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Une erreur est survenue lors de la connexion')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  // Fournir les valeurs du contexte
  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}