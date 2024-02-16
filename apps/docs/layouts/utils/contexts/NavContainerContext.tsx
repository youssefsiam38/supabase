import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
  memo,
} from 'react'
import { createPortal } from 'react-dom'

const NavContainerContext = createContext<
  | {
      navContainer: HTMLElement | undefined
      setNavContainer: Dispatch<SetStateAction<HTMLElement>>
      mobileHeaderContainer: HTMLElement | undefined
      setMobileHeaderContainer: Dispatch<SetStateAction<HTMLElement>>
      hiddenMobileData: HTMLElement | undefined
      setHiddenMobileData: Dispatch<SetStateAction<HTMLElement>>
    }
  | undefined
>(undefined)

function NavContainerContextProvider({ children }: PropsWithChildren) {
  const [navContainer, setNavContainer] = useState<HTMLElement>()
  const [mobileHeaderContainer, setMobileHeaderContainer] = useState<HTMLElement>()
  const [hiddenMobileData, setHiddenMobileData] = useState<HTMLElement>()

  const contextValue = useMemo(
    () => ({
      navContainer,
      setNavContainer,
      mobileHeaderContainer,
      setMobileHeaderContainer,
      hiddenMobileData,
      setHiddenMobileData,
    }),
    [
      navContainer,
      setNavContainer,
      mobileHeaderContainer,
      setMobileHeaderContainer,
      hiddenMobileData,
      setHiddenMobileData,
    ]
  )

  return (
    <NavContainerContext.Provider value={contextValue}>{children}</NavContainerContext.Provider>
  )
}

function useNavContainerContext() {
  const context = useContext(NavContainerContext)
  if (!context)
    throw Error('`useNavContainerContext` must be used within a `NavContainerContextProvider')
  return context
}

const HiddenMobileData = memo(function HiddenData({ menuId }: { menuId: string }) {
  const { setHiddenMobileData } = useNavContainerContext()
  return (
    <span hidden ref={setHiddenMobileData} data-menuid={menuId}>
      Mobile data:
      {menuId}
    </span>
  )
})
HiddenMobileData.displayName = 'HiddenMobileData'

function NavContainerContents({
  children,
  menuId,
}: PropsWithChildren<{ menuId: string } /** TODO: improve typing */>) {
  const { navContainer, mobileHeaderContainer } = useNavContainerContext()
  if (navContainer)
    return [
      createPortal(children, navContainer),
      createPortal(<HiddenMobileData menuId={menuId} />, mobileHeaderContainer),
    ]
  return null
}

export { NavContainerContents, NavContainerContextProvider, useNavContainerContext }
