import type { NavMenuSection } from '~/components/Navigation/Navigation.types'
import { type MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import { LayoutMainContent } from '~/layouts/DefaultLayout'
import { MainSkeleton } from '~/layouts/MainSkeleton'
import {
  isAnnotatedFunction,
  isAnnotatedMarkdown,
  type IAnnotatedCommon,
  type AnnotatedFunction,
  type AnnotatedMarkdown,
} from './Reference.server'

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
    <LayoutMainContent className="@container">
      {flattenedSections.map((section) => (
        <RefSectionSwitch key={section.id} section={section} />
      ))}
    </LayoutMainContent>
  </MainSkeleton>
)

const RefSectionSwitch = ({ section }: { section: IAnnotatedCommon }) => {
  switch (true) {
    case isAnnotatedMarkdown(section):
      return <RefMarkdownSection section={section} />
    case isAnnotatedFunction(section):
      return <RefFunctionSection section={section} />
    default:
      return (
        <div>
          <pre>{JSON.stringify(section, null, 2)}</pre>
        </div>
      )
  }
}

const RefMarkdownSection = ({ section }: { section: AnnotatedMarkdown }) => (
  <div>
    <pre>{JSON.stringify(section, null, 2)}</pre>
  </div>
)

const RefFunctionSection = ({ section }: { section: AnnotatedFunction }) => (
  <div>
    <pre>{JSON.stringify(section, null, 2)}</pre>
  </div>
)

export { RefDisplay }
