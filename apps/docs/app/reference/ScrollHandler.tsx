'use client'

import { useEffect } from 'react'

export function ScrollHandler({ slug }: { slug: string }) {
  // Legacy URLs for reference docs have the function slug as part of the path, not as a hash
  // This makes it work like a hash by finding and scrolling to the appropraite element
  useEffect(() => {
    document.getElementById(slug)?.scrollIntoView()
  }, [slug])

  useEffect(() => {
    function handler() {
      const [slug] = window.location.pathname.split('/').slice(-1)
      document.getElementById(slug)?.scrollIntoView()
    }

    window.addEventListener('popstate', handler)

    return () => {
      window.removeEventListener('popstate', handler)
    }
  }, [])

  return null
}
