'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow">
      <div className="container flex items-center justify-between max-w-6xl px-4 py-3 mx-auto">
        <Link href="/" className="text-xl font-bold text-indigo-600">
          CC Portal
        </Link>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{user.email}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Déconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}