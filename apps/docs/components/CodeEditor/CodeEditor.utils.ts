import { useMonaco } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { useCallback } from 'react'

import { useOnceWithPrereqs } from '~/hooks/useOnceWithPrereqs'

const getTheme = (theme: string) => {
  const isDarkMode = theme.includes('dark')
  return {
    base: isDarkMode ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [
      { background: isDarkMode ? '1f1f1f' : 'f0f0f0' },
      {
        token: '',
        background: isDarkMode ? '1f1f1f' : 'f0f0f0',
        foreground: isDarkMode ? 'd4d4d4' : '444444',
      },
      { token: 'string.sql', foreground: '24b47e' },
      { token: 'comment', foreground: '666666' },
      { token: 'predefined.sql', foreground: isDarkMode ? 'D4D4D4' : '444444' },
    ],
    colors: { 'editor.background': isDarkMode ? '#1f1f1f' : '#f0f0f0' },
  }
}

const useConfigureEditor = () => {
  const { resolvedTheme } = useTheme()
  const monaco = useMonaco()

  const configureEditor = useCallback(() => {
    if (monaco && resolvedTheme) {
      const mode: any = getTheme(resolvedTheme)
      monaco.editor.defineTheme('supabase', mode)
    }
  }, [monaco, resolvedTheme])

  useOnceWithPrereqs(configureEditor, [monaco, resolvedTheme])
}

export { useConfigureEditor }
