import { PropsWithChildren } from 'react'
import { MainSkeleton } from '~/app/MainSkeleton'
import { MainContentWrapper } from '~/app/MainContentWrapper'
import { authNavTree } from './navTree'

export default function AuthGuidesLayout({ children }: PropsWithChildren<{}>) {
  return (
    <MainSkeleton menuId="home" navItems={authNavTree}>
      <MainContentWrapper>
        <div className="prose max-w-none">{children}</div>
      </MainContentWrapper>
    </MainSkeleton>
  )
}
