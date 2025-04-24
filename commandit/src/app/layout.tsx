import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portail de Commandes - Christian Constantin SA',
  description: 'Portail interne pour les commandes de fournitures',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {children}
          <footer className="py-4 mt-8 text-sm text-center text-gray-500">
            © {new Date().getFullYear()} Christian Constantin SA - Portail Interne
          </footer>
        </Providers>
      </body>
    </html>
  )
}