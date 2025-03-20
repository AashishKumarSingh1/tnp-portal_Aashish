'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from 'sonner'
import Header from './components/Header'
import Footer from './components/Footer'

export default function ClientLayout({ children }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        <main className="min-h-screen">
          
          {children}
        </main>
        <Footer />
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </SessionProvider>
  )
} 