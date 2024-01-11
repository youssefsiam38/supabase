import { getThemeOrDefault } from '~/stores/theme.server'
import '../styles/main.scss'
import '../styles/new-docs.scss'

import type { Metadata } from 'next'
import { ThemeProvider } from './Providers.client'

export const metadata: Metadata = {
  title: 'Supabase Docs',
  description:
    'Supabase is an open source Firebase alternative providing all the backend features you need to build a product.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = getThemeOrDefault()

  return (
    <html lang="en" data-theme={theme}>
      <ThemeProvider initialTheme={theme}>
        <body>
          <main>{children}</main>
        </body>
      </ThemeProvider>
    </html>
  )
}
