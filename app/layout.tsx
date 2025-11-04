import { Poppins } from 'next/font/google'
import './globals.css'
import type { Metadata } from "next"

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "IAeJovem (IAJ) - Um espaço tranquilo para você se expressar",
  description: "Plataforma de apoio emocional para estudantes com a Ayla, sua companheira empática.",
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "IAeJovem (IAJ)",
    description: "Um espaço tranquilo para você se expressar",
    images: ['/og-image.png'],
    type: 'website',
  },
}

import SessionProvider from '@/components/providers/session-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
          </SessionProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}