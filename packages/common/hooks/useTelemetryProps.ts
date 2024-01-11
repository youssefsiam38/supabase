import { isBrowser } from '../helpers'
import { useEffect, useState } from 'react'

export function useTelemetryProps() {
  const [locale, setLocale] = useState('en-US')

  useEffect(() => {
    function handleLanguageChange() {
      if (navigator.language) setLocale(navigator.language)
    }
    handleLanguageChange()

    window.addEventListener('languagechange', handleLanguageChange)
    return () => window.removeEventListener('languagechange', handleLanguageChange)
  }, [])

  return {
    language: locale,
    screenResolution: isBrowser ? `${window.innerWidth}x${window.innerHeight}` : undefined,
  }
}
