import { lazy, Suspense } from 'react'

const HeavyPostgres = lazy(() => import('./EmbeddedPostgres'))

export function EmbeddedPostgres() {
  return (
    <Suspense>
      <HeavyPostgres />
    </Suspense>
  )
}
