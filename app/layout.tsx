import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Asitha Isuru - Software Engineer',
  description: 'Full-stack developer specialized in MERN stack and computer vision. View my portfolio, projects, and experience.',
  keywords: 'Asitha Isuru, Software Engineer, Full-Stack Developer, MERN Stack, Computer Vision, Portfolio, Projects, Experience',
  authors: [{ name: 'Asitha Isuru', url: 'https://asithaisuru.com' }],
  openGraph: {
    title: 'Asitha Isuru - Software Engineer',
    description: 'Full-stack developer specialized in MERN stack and computer vision. View my portfolio, projects, and experience.',
    siteName: 'Asitha Isuru Portfolio',
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
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
