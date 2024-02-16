import {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const NavContainerContext = createContext<
  | {
      navContainer: HTMLElement | undefined
      setNavContainer: Dispatch<SetStateAction<HTMLElement>>
    }
  | undefined
>(undefined)

function NavContainerContextProvider({ children }: PropsWithChildren) {
  const [navContainer, setNavContainer] = useState<HTMLElement>()

  const contextValue = useMemo(
    () => ({ navContainer, setNavContainer }),
    [navContainer, setNavContainer]
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

function NavContainerContents({ children }: PropsWithChildren) {
  const { navContainer } = useNavContainerContext()
  if (navContainer) return createPortal(children, navContainer)
  return null
}

export { NavContainerContents, NavContainerContextProvider, useNavContainerContext }
