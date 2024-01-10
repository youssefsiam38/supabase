'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  IconMoon,
  IconSun,
} from 'ui'
import { useState } from 'react'
import { ThemeValue, themeValues } from '~/stores/theme.shared'
import { useTheme } from './Providers.client'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={() => setOpen(!open)} modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          id="user-settings-dropdown"
          className="flex items-center justify-center h-7 w-7 text-foreground"
        >
          <IconSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuRadioGroup
            value={theme} // Use the currentTheme variable here
            onValueChange={(value: ThemeValue) => {
              setTheme(value)
            }}
          >
            {themeValues.map((theme) => (
              <DropdownMenuRadioItem key={theme} value={theme}>
                {theme}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
