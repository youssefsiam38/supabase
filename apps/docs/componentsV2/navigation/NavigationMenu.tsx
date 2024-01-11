import { Fragment } from 'react'
import { MenuList } from './navTypes'
import { NavigationItem } from './NavigationItem'

export type NavStyle = 'spacious' | 'tight' | 'default'

export function NavigationMenu({
  navItems,
  navStyle = 'default',
}: {
  navItems: MenuList
  navStyle?: NavStyle
}) {
  return (
    <div className="transition-all duration-150 ease-out opacity-100 ml-0 delay-150">
      <ul className="relative w-full flex flex-col gap-4 pb-5">
        {navItems.map((section, sectionIndex) => {
          return (
            <Fragment key={sectionIndex}>
              {sectionIndex !== 0 && <div className="h-px w-full border-b"></div>}
              <div
                className={[
                  'flex flex-col',
                  navStyle === 'spacious' ? 'gap-4' : navStyle === 'tight' ? 'gap-2' : 'gap-2.5',
                ].join(' ')}
              >
                {section.section && (
                  <div
                    className={[
                      'font-mono uppercase text-xs',
                      navStyle === 'spacious' ? 'text-foreground-lighter' : 'test-foreground',
                    ].join(' ')}
                  >
                    {section.section}
                  </div>
                )}
                {section.pages.map((page) => (
                  <NavigationItem key={page.href} page={page} />
                ))}
              </div>
            </Fragment>
          )
        })}
      </ul>
    </div>
  )
}
