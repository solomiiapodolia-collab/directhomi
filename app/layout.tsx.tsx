import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: 'DirectHomi - Оренда та продаж нерухомості напряму від власників',
    template: '%s | DirectHomi',
  },
  description: 'Знайдіть квартиру, будинок або кімнату напряму від власника. Без посередників, без комісій. Перевірені власники, прозорі умови.',
  keywords: ['оренда квартири', 'зняти квартиру', 'оренда від власника', 'нерухомість Київ', 'оренда без посередників'],
  authors: [{ name: 'DirectHomi' }],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'DirectHomi',
    title: 'DirectHomi - Оренда нерухомості від власників',
    description: 'Знайдіть житло напряму від власника без комісій та посередників',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d9488',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        
        {/* Floating Support Chat Button */}
        <a
          href="mailto:support@directhomi.com"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
          title="Написати в підтримку"
          aria-label="Чат підтримки"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </a>

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
