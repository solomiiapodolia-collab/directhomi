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
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
