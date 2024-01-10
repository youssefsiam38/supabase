import { cookies } from 'next/headers'
import { COOKIES } from './cookies'
import { themeValues, ThemeValue, defaultTheme } from './theme.shared'

export function getThemeOrDefault(_default: ThemeValue = defaultTheme) {
  const cookieStore = cookies()
  const savedTheme = cookieStore.get(COOKIES.THEME_PREFERENCE)?.value

  if (!savedTheme || !themeValues.includes(savedTheme as ThemeValue)) {
    return _default
  }

  // safe because of the includes check above
  return savedTheme as ThemeValue
}
