import Link from 'next/link'
import { MenuItem } from './navTypes'
import { Badge, cn } from 'ui'
import HomeMenuIconPicker from '~/components/Navigation/NavigationMenu/HomeMenuIconPicker'

export function NavigationItem({ page }: { page: MenuItem }) {
  return (
    <Link href={page.href} passHref>
      <li
        className={cn(
          'group flex items-center gap-2',
          'text-sm text-foreground-light hover:text-foreground',
          'transition-all duration-150',
          'hover:cursor-pointer'
        )}
      >
        {page?.icon && <HomeMenuIconPicker icon={page.icon} />}
        {page.label}
        {page.community && (
          <Badge size="small" color="scale">
            Community
          </Badge>
        )}
      </li>
    </Link>
  )
}
