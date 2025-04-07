import { Inter } from 'next/font/google'
import Script from 'next/script'
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

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-HK90K6HFDC';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>
          <ErrorBoundary>
            <AuthProvider>{children}</AuthProvider>
          </ErrorBoundary>
        </ClientLayout>

        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
