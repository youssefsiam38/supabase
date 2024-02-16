import Link from 'next/link'
import { Fragment } from 'react'

import { Badge, cn } from 'ui'

import HomeMenuIconPicker from './HomeMenuIconPicker'
import { HOMEPAGE_MENU_ITEMS } from './NavigationMenu.constants'

const NavigationMenuHome = () => {
  return (
    <>
      <h1 id="main-nav-title" className="sr-only">
        Main menu
      </h1>
      <ul className="relative w-full flex flex-col gap-4 pb-5">
        {HOMEPAGE_MENU_ITEMS.map((section, sectionIndex) => {
          return (
            <Fragment key={`section-container-${sectionIndex}-border`}>
              {sectionIndex !== 0 && (
                <div className="h-px w-full border-b" key={`section-${sectionIndex}-border`}></div>
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
    </>
  )
}

export { NavigationMenuHome }
