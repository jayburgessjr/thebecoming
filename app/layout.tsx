import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Script from 'next/script'

import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/toast-provider'

import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'The Way of Becoming — Jay Burgess',
  description: 'A book of meditations by Jay Burgess.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html data-theme="dark" lang="en" style={{ background: '#16130f' }} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedTheme = localStorage.getItem('the-way-of-becoming-theme');
                document.documentElement.dataset.theme = storedTheme === 'light' ? 'light' : 'dark';
              } catch (error) {}
            `,
          }}
        />
      </head>
      <body className={`${cinzel.variable} ${cormorant.variable} ${dmSans.variable}`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
