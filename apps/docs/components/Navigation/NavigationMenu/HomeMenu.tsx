import Image from 'next/legacy/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Fragment, memo } from 'react'

import { Badge, cn } from 'ui'

import HomeMenuIconPicker from './HomeMenuIconPicker'
import { HOMEPAGE_MENU_ITEMS } from './NavigationMenu.constants'

const HeaderLogo = memo(function HeaderLogo() {
  const { resolvedTheme } = useTheme()
  return (
    <Link href="/" className="px-10 flex items-center gap-2">
      <Image
        className="cursor-pointer"
        src={
          resolvedTheme?.includes('dark') ? '/docs/supabase-dark.svg' : '/docs/supabase-light.svg'
        }
        width={96}
        height={24}
        alt="Supabase Logo"
      />
      <span className="font-mono text-sm font-medium text-brand-link">DOCS</span>
    </Link>
  )
})

const NavigationMenuHome = () => {
  return (
    <>
      <h1 id="main-nav-title" className="sr-only">
        Main menu
      </h1>
      <div className="top-0 sticky z-10">
        <div>
          <div>
            <div
              className={[
                'hidden lg:flex lg:height-auto',
                'pt-8 bg-background flex-col gap-8',
              ].join(' ')}
            >
              <HeaderLogo />
            </div>
            <div className="h-4 bg-background w-full"></div>
            <div className="bg-gradient-to-b from-background to-transparent h-4 w-full"></div>
          </div>
        </div>
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
        <div className="transition-all duration-150 ease-out opacity-100 ml-0 delay-150">
          <ul className="relative w-full flex flex-col gap-4 pb-5">
            {HOMEPAGE_MENU_ITEMS.map((section, sectionIndex) => {
              return (
                <Fragment key={`section-container-${sectionIndex}-border`}>
                  {sectionIndex !== 0 && (
                    <div
                      className="h-px w-full border-b"
                      key={`section-${sectionIndex}-border`}
                    ></div>
                  )}
                  <div key={`section-${sectionIndex}`}>
                    <div className="flex flex-col gap-4">
                      {section.map((link, i) => {
                        if (!link.href) {
                          return (
                            <h2
                              key={link.label}
                              className={cn(
                                'font-mono uppercase text-xs text-foreground-lighter',
                                i !== 0 && 'mt-4'
                              )}
                            >
                              {link.label}
                            </h2>
                          )
                        } else {
                          return (
                            <Link href={link.href} passHref key={link.label}>
                              <li
                                className={[
                                  'group flex items-center gap-2',
                                  'text-sm transition-all duration-150 text-foreground-light hover:text-foreground hover:cursor-pointer ',
                                ].join(' ')}
                              >
                                {link?.icon && <HomeMenuIconPicker icon={link.icon} />}
                                {link.label}
                                {link.community && (
                                  <Badge size="small" color="scale">
                                    Community
                                  </Badge>
                                )}
                              </li>
                            </Link>
                          )
                        }
                      })}
                    </div>
                  </div>
                </Fragment>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

export { NavigationMenuHome }
