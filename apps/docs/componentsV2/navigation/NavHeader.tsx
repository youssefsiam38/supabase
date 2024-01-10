import Image from 'next/image'
import Link from 'next/link'
import { cn } from 'ui'
import { getThemeOrDefault } from '~/stores/theme.server'

export function NavHeader() {
  const theme = getThemeOrDefault()

  return (
    <div className="hidden lg:block lg:h-auto bg-background pt-8">
      <Link href="/" className="px-10 flex items-center gap-2">
        <Image
          className="cursor-pointer"
          src={theme === 'dark' ? '/docs/supabase-dark.svg' : '/docs/supabase-light.svg'}
          width={96}
          height={24}
          alt="Supabase Logo"
        />
        <span className="font-mono text-sm font-medium text-brand-link">DOCS</span>
      </Link>
    </div>
  )
}
