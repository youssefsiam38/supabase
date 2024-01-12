import { PropsWithChildren } from 'react'

export function MainContentWrapper({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={['max-w-7xl px-5 mx-auto py-16', className ?? ''].join(' ')}>{children}</div>
  )
}
