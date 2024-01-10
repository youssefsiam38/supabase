'use client'

import { ReactNode } from 'react'
import { cn } from 'ui'
import { useSnapshot } from 'valtio'
import { mobileMenuStore } from '~/stores/mobileMenu'
import { NavigationMenu } from './NavigationMenu'
import { MenuList } from './navTypes'

export function NavContainer({ header, navItems }: { header: ReactNode; navItems: MenuList }) {
  const { isOpen: isMobileMenuOpen } = useSnapshot(mobileMenuStore)

  return (
    <div
      className={cn(
        'absolute lg:relative',
        isMobileMenuOpen ? 'w-[75%] sm:w-[50%] md:w-[33%] left-0' : 'w-0 -left-[280px]',
        'lg:w-[420px] lg:left-0',
        'top-0',
        'ml-0',
        'h-screen',
        'flex flex-col',
        'transition-all'
      )}
    >
      <div
        className={cn(
          'top-0',
          'relative',
          'w-auto h-screen overflow-auto',
          'border-r',
          'backdrop-blur backdrop-filter bg-background',
          'flex flex-col'
        )}
      >
        <div className="top-0 sticky z-10">
          {header}
          <div className="h-4 bg-background w-full"></div>
          <div className="bg-gradient-to-b from-background to-transparent h-4 w-full"></div>
        </div>
        <div
          className={[
            'transition-all ease-out duration-200',
            'absolute left-0 right-0 h-screen',
            'px-5 pl-5 py-16',
            'top-[0px]',
            'bg-background',
            // desktop styles
            'lg:relative lg:top-0 lg:left-0 lg:pb-10 lg:px-10 lg:pt-0 lg:flex',
            'lg:opacity-100 lg:visible',
          ].join(' ')}
        >
          <NavigationMenu navItems={navItems} />
        </div>
      </div>
    </div>
  )
}
