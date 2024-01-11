import { PropsWithChildren } from 'react'
import { MobileHeader, MobileMenuBackdrop } from '../componentsV2/navigation/MobileMenu.client'
import { NavStyle } from '~/componentsV2/navigation/NavigationMenu'
import { NavContainer } from '../componentsV2/navigation/NavContainer'
import { NavHeader } from '../componentsV2/navigation/NavHeader'
import { MenuList } from '~/componentsV2/navigation/navTypes'
import { MainContainer, TopNavBarLogo } from './MainSkeleton.client'
import Link from 'next/link'
import { Button, IconGitHub } from 'ui'
import { Footer } from './Footer'
import { ThemeToggle } from './ThemeToggle.client'

export function TopNavBar() {
  return (
    <nav className="h-[60px] border-b backdrop-blur backdrop-filter bg bg-opacity-75">
      <div className="px-5 max-w-7xl mx-auto flex gap-3 justify-between items-center h-full">
        <div className="lg:hidden">
          <Link href="/" className=" flex items-center gap-2">
            <TopNavBarLogo />
            <span className="font-mono text-sm font-medium text-brand-link">DOCS</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          Search needs to be rewritten beause it uses old router...
        </div>
        <div className="hidden lg:flex grow items-center justify-end gap-3">
          <Button type="text" asChild>
            <a href="https://supabase.com" target="_blank" rel="noreferrer noopener">
              Supabase.com
            </a>
          </Button>
          <Link
            href="https://github.com/supabase/supabase"
            target="_blank"
            rel="noreferrer noopener"
            className="px-2.5 py-1"
          >
            <IconGitHub
              size={16}
              className="text-foreground-light hover:text-foreground transition"
            />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}

export function MainSkeleton({
  children,
  menuId,
  navStyle,
  navItems,
}: PropsWithChildren<{
  menuId: string
  navStyle?: NavStyle
  navItems: MenuList
}>) {
  return (
    <div className="flex flex-row h-screen">
      <NavContainer
        header={<NavHeader />}
        menuId={menuId}
        navStyle={navStyle}
        navItems={navItems}
      />
      <MainContainer>
        <div className="lg:sticky top-0 z-10 overflow-hidden">
          <TopNavBar />
        </div>
        <div
          className={[
            'sticky z-10 top-0',
            'transition-all',
            'backdrop-blur backdrop-filter bg-background',
          ].join(' ')}
        >
          <div className={['lg:hidden', 'px-5', 'border-b z-10'].join(' ')}>
            <MobileHeader />
          </div>
        </div>
        <div className="grow">
          {children}
          <Footer />
        </div>
        <MobileMenuBackdrop />
      </MainContainer>
    </div>
  )
}
