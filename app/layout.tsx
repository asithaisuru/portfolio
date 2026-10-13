import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'asithaisuru | Developer, Builder & Curious Human',
  description: 'An interactive brick-built journey through Asitha Isuru’s education, experience, skills, and live GitHub project galaxy.',
  keywords: 'Asitha Isuru, Software Developer, Portfolio, React, Laravel, Computer Vision, GitHub, Three.js',
  authors: [{ name: 'Asitha Isuru', url: 'https://asithaisuru.com' }],
  openGraph: {
    title: 'Asitha Isuru | Welcome to My Universe',
    description: 'Explore my story and hop between live GitHub projects in an interactive 3D universe.',
    siteName: 'asithaisuru',
    locale: 'en_SL',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
