import { PropsWithChildren } from 'react'

export function InnerLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col w-full divide-y px-5 max-w-7xl mx-auto py-16">{children}</div>
  )
}
