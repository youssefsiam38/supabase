export const themeValues = ['light', 'dark'] as const

export type ThemeValue = (typeof themeValues)[number]

export const defaultTheme = 'dark' satisfies ThemeValue
