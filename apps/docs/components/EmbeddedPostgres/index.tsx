import { lazy, Suspense, useEffect, useState } from 'react'

const HeavyPostgres = lazy(() => import('./EmbeddedPostgres'))

export function EmbeddedPostgres() {
  const [mount, setMount] = useState(false)

  useEffect(() => setMount(true), [])
  if (!mount) return null

  return (
    <Suspense>
      <HeavyPostgres />
    </Suspense>
  )
}
