import { PropsWithChildren } from 'react'
import { MainSkeleton } from '~/app/MainSkeleton'
import { toNavMenu } from '../../navUtils'

const navItems = toNavMenu({
  excludedName: 'reference_javascript_v2',
  pagePath: '/reference/javascript',
})

export default function HomeLayout({ children }: PropsWithChildren<{}>) {
  return (
    <MainSkeleton menuId="reference_javascript_v2" navItems={navItems}>
      {children}
    </MainSkeleton>
  )
}
