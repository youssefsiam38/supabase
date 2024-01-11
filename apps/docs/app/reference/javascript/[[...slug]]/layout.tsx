import { PropsWithChildren } from 'react'
import { MainSkeleton } from '~/app/MainSkeleton'
import { toNavMenu } from '../../navUtils'
import { MainContentWrapper } from '~/app/MainContentWrapper'

const navItems = toNavMenu({
  excludedName: 'reference_javascript_v2',
  pagePath: '/reference/javascript',
})

export default function JavaScriptRefLayout({ children }: PropsWithChildren<{}>) {
  return (
    <MainSkeleton menuId="reference_javascript_v2" navStyle="tight" navItems={navItems}>
      <MainContentWrapper>{children}</MainContentWrapper>
    </MainSkeleton>
  )
}
