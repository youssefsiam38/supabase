import { proxy } from 'valtio'

export const mobileMenuStore = proxy({
  isOpen: false,
  toggleOpen: () => (mobileMenuStore.isOpen = !mobileMenuStore.isOpen),
})
