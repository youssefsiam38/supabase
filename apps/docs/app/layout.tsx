import '../styles/main.scss'
import '../styles/new-docs.scss'

import type { Metadata } from 'next'
import { ThemeProvider } from './Providers.client'
import { ThemeValue, defaultTheme, themeValues } from '~/constants/theme.shared'
import { cookies } from 'next/headers'
import { COOKIES } from '~/constants/cookies'

export const metadata: Metadata = {
  title: 'Supabase Docs',
  description:
    'Supabase is an open source Firebase alternative providing all the backend features you need to build a product.',
}

export function getThemeOrDefault(_default: ThemeValue = defaultTheme) {
  const cookieStore = cookies()
  const savedTheme = cookieStore.get(COOKIES.THEME_PREFERENCE)?.value

  if (!savedTheme || !themeValues.includes(savedTheme as ThemeValue)) {
    return _default
  }

  // safe because of the includes check above
  return savedTheme as ThemeValue
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
