import { PropsWithChildren } from 'react'
import { MainSkeleton } from '../MainSkeleton'
import { HOMEPAGE_MENU_ITEMS } from './navTree'

export default function HomeLayout({ children }: PropsWithChildren<{}>) {
  return (
    <MainSkeleton menuId="home" navStyle="spacious" navItems={HOMEPAGE_MENU_ITEMS}>
      {children}
    </MainSkeleton>
  )
}
