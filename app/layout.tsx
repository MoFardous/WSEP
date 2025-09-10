
import type { Metadata } from 'next'
import { Cairo, Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/navbar'
import { ErrorBoundary } from '@/components/error-boundary'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'لوحة التحكم الإدارية | Arabic Project Management Dashboard',
  description: 'لوحة تحكم شاملة لإدارة المشاريع باللغة العربية مع دعم RTL وميزات تفاعلية متقدمة',
  keywords: 'Arabic, Dashboard, Project Management, RTL, إدارة المشاريع, لوحة التحكم',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle chunk loading errors
              window.addEventListener('error', function(event) {
                if (event.message && event.message.includes('ChunkLoadError')) {
                  console.warn('ChunkLoadError detected, attempting reload...');
                  window.location.reload();
                }
              });
              
              // Handle unhandled promise rejections (for chunk loading failures)
              window.addEventListener('unhandledrejection', function(event) {
                if (event.reason && event.reason.name === 'ChunkLoadError') {
                  console.warn('ChunkLoadError promise rejection detected, attempting reload...');
                  event.preventDefault();
                  window.location.reload();
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${cairo.className} rtl arabic-text antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="relative">
                {children}
              </main>
            </div>
            <Toaster position="top-center" />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
