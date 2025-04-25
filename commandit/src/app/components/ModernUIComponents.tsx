'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

// Header moderne avec dégradé et ombre subtile
export function ModernHeader() {
    const { user, logout } = useAuth()
    // const router = useRouter()
  
    // Fonction pour vérifier si l'utilisateur est admin
    const isAdmin = () => {
      if (!user) return false
      return ['admin@christian-constantin.ch', 'it@christian-constantin.ch', 'rouiller@christian-constantin.ch'].includes(user.email)
    }
  
    return (
      <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md">
        <div className="container flex items-center justify-between max-w-6xl px-4 py-4 mx-auto">
          <Link href="/" className="text-xl font-bold text-white transition-transform hover:scale-105">
            <div className="flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-6 h-6"
              >
                <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
              </svg>
              <span>CC Portal</span>
            </div>
          </Link>
          {user && (
            <div className="flex items-center space-x-4">
              {isAdmin() && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  Administration
                </Link>
              )}
              <span className="text-sm font-medium text-white">
                {user.email}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white transition-colors bg-white/20 rounded-full hover:bg-white/30"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </header>
    )
  }

// Carte de catégorie améliorée avec animations et icônes modernes
export function ModernCategoryCard({ title, description, icon, href }) {
  return (
    <Link href={href} className="block transition-all duration-300 hover:scale-105">
      <div className="relative p-6 overflow-hidden bg-white rounded-xl shadow-lg group hover:shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 text-3xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-md">
            {icon}
          </div>
          <h2 className="mb-2 text-xl font-bold text-center text-gray-800">{title}</h2>
          <p className="text-sm text-center text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
}

// Pied de page moderne
export function ModernFooter() {
  return (
    <footer className="py-6 mt-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-8 h-8 text-indigo-400 mb-2 mx-auto md:mx-0"
            >
              <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
              <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
              <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
            </svg>
            <p className="text-center md:text-left">Portail interne de commandes</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Christian Constantin SA</p>
            <p className="text-xs text-gray-500 mt-1">Tous droits réservés</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Bouton moderne avec dégradé et effet hover
export function ModernButton({ children, onClick, type = "button", disabled = false, variant = "primary" }) {
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white",
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md shadow-sm font-medium transition-all duration-200 transform ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}`}
    >
      {children}
    </button>
  )
}

// Input modernisé avec focus amélioré
export function ModernInput({ label, id, type = "text", value, onChange, required = false, placeholder = "", disabled = false }) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500"
      />
    </div>
  )
}

// Composant de selection moderne
export function ModernSelect({ 
    label,
    id, 
    value, 
    onChange, 
    required = false, 
    disabled = false, 
    children 
  }) {
    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:text-gray-500"
        >
          {children}
        </select>
      </div>
    )
  }