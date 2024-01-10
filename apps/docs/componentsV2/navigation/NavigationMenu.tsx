import { Fragment } from 'react'
import { MenuList } from './navTypes'
import { NavigationItem } from './NavigationItem'

export function NavigationMenu({ navItems }: { navItems: MenuList }) {
  return (
    <div className="transition-all duration-150 ease-out opacity-100 ml-0 delay-150">
      <ul className="relative w-full flex flex-col gap-4 pb-5">
        {navItems.map((section, sectionIndex) => {
          return (
            <Fragment key={sectionIndex}>
              {sectionIndex !== 0 && <div className="h-px w-full border-b"></div>}
              <div className="flex flex-col gap-4">
                {section.section && (
                  <div className="font-mono uppercase text-xs text-foreground-lighter">
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
