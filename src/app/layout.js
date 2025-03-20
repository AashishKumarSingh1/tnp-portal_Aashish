import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'
import { AuthProvider } from '@/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Training & Placement Cell - NIT Patna',
  description: 'Official Training & Placement Cell portal of NIT Patna',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          <AuthProvider>{children}</AuthProvider>
        </ClientLayout>
      </body>
    </html>
  )
}
