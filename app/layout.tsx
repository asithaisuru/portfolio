import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://asithaisuru.vercel.app'),
  title: 'Asitha Isuru | Software Engineer & Full-Stack Developer',
  description: 'Asitha Isuru’s full-stack development experience, technical skills, education, certification and software projects in an interactive 3D portfolio.',
  keywords: 'Asitha Isuru, Software Engineer, Full-Stack Developer, TypeScript, Next.js, NestJS, Laravel, Computer Vision, GitHub, Three.js',
  authors: [{ name: 'Asitha Isuru', url: 'https://asithaisuru.vercel.app' }],
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
