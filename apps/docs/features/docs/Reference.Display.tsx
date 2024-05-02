import type { NavMenuSection } from '~/components/Navigation/Navigation.types'
import { type MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import { LayoutMainContent } from '~/layouts/DefaultLayout'
import { MainSkeleton } from '~/layouts/MainSkeleton'
import { type IAnnotatedCommon } from './Reference.server'

const RefDisplay = ({
  menuId,
  navData,
  flattenedSections,
}: {
  menuId: MenuId
  navData: Partial<NavMenuSection>[]
  flattenedSections: IAnnotatedCommon[]
}) => (
  <MainSkeleton menu={{ menuId, menuItems: navData }}>
    <LayoutMainContent>
      <h1>HELLO</h1>
    </LayoutMainContent>
  </MainSkeleton>
)

export { RefDisplay }
