import { proxy, useSnapshot } from 'valtio'

export const menuState = proxy({
  menuActiveRefId: 'home',
  setMenuActiveRefId: (value: string) => {
    menuState.menuActiveRefId = value
  },
  menuLevelId: 'home',
  setMenuLevelId: (value: string) => {
    menuState.menuMobileOpen = false
    menuState.menuLevelId = value
  },
  menuMobileOpen: false,
  setMenuMobileOpen: (value: boolean) => {
    menuState.menuMobileOpen = value
  },
})

export const useMenuActiveRefId = () => {
  return useSnapshot(menuState).menuActiveRefId
}
export const useMenuLevelId = () => {
  return useSnapshot(menuState).menuLevelId
}

export const useMenuMobileOpen = () => {
  return useSnapshot(menuState).menuMobileOpen
}
