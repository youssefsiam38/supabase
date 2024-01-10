export type MenuItem = {
  label: string
  href: `/${string}` | `https://${string}`
  icon?: string
  hasLightIcon?: boolean
  community?: boolean
}

type MenuSection = { section: string | null; pages: MenuItem[] }

export type MenuList = MenuSection[]
