import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './ClientLayout'
import { AuthProvider } from '@/providers/AuthProvider'
import ErrorBoundary from '../components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Training & Placement Cell - NIT Patna',
  description: 'Official Training & Placement Cell portal of NIT Patna',
  verification: {
    google: '5gbX6CeIgXNqZ2CuUrXtlfpdcPg-v8n4l_mx3CXfnwU',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          <ErrorBoundary>
            <AuthProvider>{children}</AuthProvider>
          </ErrorBoundary>
        </ClientLayout>
      </body>
    </html>
  )
}
