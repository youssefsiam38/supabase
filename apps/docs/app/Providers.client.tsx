'use client'

import Cookies from 'js-cookie'
import { PropsWithChildren, createContext, useContext, useState } from 'react'
import { COOKIES } from '~/constants/cookies'
import { ThemeValue } from '~/constants/theme.shared'

const ThemeContext = createContext<{
  theme: ThemeValue
  setTheme: (theme: ThemeValue) => void
} | null>(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw Error('useTheme must be called within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({
  children,
  initialTheme,
}: PropsWithChildren<{ initialTheme: ThemeValue }>) {
  const [theme, _setTheme] = useState(initialTheme)

  function setTheme(theme: ThemeValue) {
    _setTheme(theme)
    document.documentElement.dataset.theme = theme
    document.documentElement.style.setProperty('color-scheme', theme)
    Cookies.set(COOKIES.THEME_PREFERENCE, theme, { secure: true })
  }

  const themeValue = {
    theme,
    setTheme,
  }

  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
}
