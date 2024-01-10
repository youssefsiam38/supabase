import { PropsWithChildren } from 'react'
import { NavContainer } from '../componentsV2/navigation/NavContainer'
import { NavHeader } from '../componentsV2/navigation/NavHeader'
import { MenuList } from '~/componentsV2/navigation/navTypes'
import { MainContainer, TopNavBarLogo } from './MainSkeleton.client'
import Link from 'next/link'
import { Button, IconGitHub } from 'ui'
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
          Search must be separate client because needs hook
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

export function MainSkeleton({ children, navItems }: PropsWithChildren<{ navItems: MenuList }>) {
  return (
    <div className="flex flex-row h-screen">
      <NavContainer header={<NavHeader />} navItems={navItems} />
      <MainContainer>
        <div className="lg:sticky top-0 z-10 overflow-hidden">
          <TopNavBar />
        </div>
        {children}
      </MainContainer>
    </div>
  )
}
