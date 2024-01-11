'use client'

import Image from 'next/image'
import { PropsWithChildren } from 'react'
import { cn } from 'ui'
import { useSnapshot } from 'valtio'
import { mobileMenuStore } from '~/stores/mobileMenu'
import { useTheme } from './Providers.client'

export function TopNavBarLogo() {
  const { theme } = useTheme()

  return (
    <Image
      className="cursor-pointer"
      src={theme === 'dark' ? '/docs/supabase-dark.svg' : '/docs/supabase-light.svg'}
      loading="eager"
      width={96}
      height={24}
      alt="Supabase Logo"
    />
  )
}

export function MainContainer({ children }: PropsWithChildren) {
  const { isOpen: isMobileMenuOpen } = useSnapshot(mobileMenuStore)

  return (
    <div
      // used to scroll to top
      id="#docs-content-container"
      className={cn(
        'w-full h-screen',
        'transition-all ease-out',
        isMobileMenuOpen ? 'ml-[75%] sm:ml-[50%] md:ml-[33%] overflow-hidden' : 'overflow-auto',
        'lg:ml-0'
      )}
    >
      <div className="flex flex-col relative">{children}</div>
    </div>
  )
}
