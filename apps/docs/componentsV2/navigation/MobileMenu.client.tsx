'use client'

import { memo, useEffect } from 'react'
import { useSnapshot } from 'valtio'
import { menuState } from '~/stores/navMenu'

const levelsData = {
  home: {
    icon: '/docs/img/icons/menu/home',
    name: 'Home',
  },
  gettingstarted: {
    icon: '/docs/img/icons/menu/getting-started',
    name: 'Getting Started',
  },
  database: {
    icon: '/docs/img/icons/menu/database',
    name: 'Database',
  },
  api: {
    icon: '/docs/img/icons/menu/rest',
    name: 'REST API',
  },
  graphql: {
    icon: '/docs/img/icons/menu/graphql',
    name: 'GraphQL',
  },
  auth: {
    icon: '/docs/img/icons/menu/auth',
    name: 'Auth',
  },
  functions: {
    icon: '/docs/img/icons/menu/functions',
    name: 'Edge Functions',
  },
  realtime: {
    icon: '/docs/img/icons/menu/realtime',
    name: 'Realtime',
  },
  analytics: {
    icon: '/docs/img/icons/menu/analytics',
    name: 'Analytics',
  },
  storage: {
    icon: '/docs/img/icons/menu/storage',
    name: 'Storage',
  },
  ai: {
    icon: '/docs/img/icons/menu/ai',
    name: 'AI & Vectors',
  },
  supabase_cli: {
    icon: '/docs/img/icons/menu/reference-cli',
    name: 'Supabase CLI',
  },
  platform: {
    icon: '/docs/img/icons/menu/platform',
    name: 'Platform',
  },
  resources: {
    icon: '/docs/img/icons/menu/resources',
    name: 'Resources',
  },
  self_hosting: {
    icon: '/docs/img/icons/menu/self-hosting',
    name: 'Self-Hosting',
  },
  integrations: {
    icon: '/docs/img/icons/menu/integrations',
    name: 'Integrations',
  },
  reference_javascript_v1: {
    icon: '/docs/img/icons/menu/reference-javascript',
    name: 'Javascript Reference v1.0',
  },
  reference_javascript_v2: {
    icon: '/docs/img/icons/menu/reference-javascript',
    name: 'Javascript Reference v2.0',
  },
  reference_dart_v1: {
    icon: '/docs/img/icons/menu/reference-dart',
    name: 'Dart Reference v1.0',
  },
  reference_dart_v2: {
    icon: '/docs/img/icons/menu/reference-dart',
    name: 'Dart Reference v2.0',
  },
  reference_csharp_v0: {
    icon: '/docs/img/icons/menu/reference-csharp',
    name: 'C# Reference v0.0',
  },
  reference_python_v2: {
    icon: '/docs/img/icons/menu/reference-python',
    name: 'Python Reference v2.0',
  },
  reference_swift_v1: {
    icon: '/docs/img/icons/menu/reference-swift',
    name: 'Swift Reference v1.0',
  },
  reference_swift_v2: {
    icon: '/docs/img/icons/menu/reference-swift',
    name: 'Swift Reference v2.0',
  },
  reference_kotlin_v1: {
    icon: '/docs/img/icons/menu/reference-kotlin',
    name: 'Kotlin Reference v1.0',
  },
  reference_kotlin_v2: {
    icon: '/docs/img/icons/menu/reference-kotlin',
    name: 'Kotlin Reference v2.0',
  },
  reference_cli: {
    icon: '/docs/img/icons/menu/reference-cli',
    name: 'CLI Reference',
  },
  reference_api: {
    icon: '/docs/img/icons/menu/reference-api',
    name: 'Management API Reference',
  },
  reference_self_hosting_auth: {
    icon: '/docs/img/icons/menu/reference-auth',
    name: 'Auth Server Reference',
  },
  reference_self_hosting_storage: {
    icon: '/docs/img/icons/menu/reference-storage',
    name: 'Storage Server Reference',
  },
  reference_self_hosting_realtime: {
    icon: '/docs/img/icons/menu/reference-realtime',
    name: 'Realtime Server Reference',
  },
  reference_self_hosting_analytics: {
    icon: '/docs/img/icons/menu/reference-analytics',
    name: 'Analytics Server Reference',
  },
  reference_self_hosting_functions: {
    icon: '/docs/img/icons/menu/reference-functions',
    name: 'Functions Server Reference',
  },
}

export const MobileMenuBackdrop = memo(function MobileMenuBackdrop() {
  const { menuMobileOpen, setMenuMobileOpen } = useSnapshot(menuState)

  useEffect(() => {
    function handleResize(e: UIEvent) {
      const w = e.target as Window
      if (menuMobileOpen && w.innerWidth >= 1024) {
        setMenuMobileOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [menuMobileOpen, setMenuMobileOpen])

  return (
    <div
      className={[
        'h-full',
        'left-0',
        'right-0',
        'z-10',
        'backdrop-blur-sm backdrop-filter bg-alternative/90',
        menuMobileOpen ? 'absolute h-full w-full top-0 left-0' : 'hidden h-0',
        // always hide on desktop
        'lg:hidden',
      ].join(' ')}
      onClick={() => setMenuMobileOpen(false)}
    ></div>
  )
})

export const MobileHeader = memo(function MobileHeader() {
  const { menuMobileOpen, setMenuMobileOpen, menuLevelId } = useSnapshot(menuState)

  return (
    <div
      className={[
        'transition-all ease-out',
        'z-10 top-0',
        menuMobileOpen ? 'absolute' : '',
        'flex items-center h-[40px]',
        menuMobileOpen ? 'gap-0' : 'gap-3',
      ].join(' ')}
    >
      <button
        className={['mr-2', menuMobileOpen && 'mt-0.5'].join(' ')}
        onClick={() => setMenuMobileOpen(!menuMobileOpen)}
      >
        <div
          className={[
            'space-y-1 group cursor-pointer relative',
            menuMobileOpen ? 'w-4 h-4' : 'w-4 h-[8px]',
          ].join(' ')}
        >
          <span
            className={[
              'transition-all ease-out block w-4 h-px bg-foreground-muted group-hover:bg-foreground',
              !menuMobileOpen ? 'w-4' : 'absolute rotate-45 top-[6px]',
            ].join(' ')}
          ></span>
          <span
            className={[
              'transition-all ease-out block h-px bg-foreground-muted group-hover:bg-foreground',
              !menuMobileOpen ? 'w-3 group-hover:w-4' : 'absolute w-4 -rotate-45 top-[2px]',
            ].join(' ')}
          ></span>
        </div>
      </button>
      <div className={[].join(' ')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          src={
            menuLevelId ? levelsData[menuLevelId].icon + '.svg' : levelsData['home'].icon + '.svg'
          }
          className={[
            'transition-all duration-200',
            menuMobileOpen ? 'invisible w-0 h-0' : 'w-4 h-4',
          ].join(' ')}
        />
      </div>
      <span
        className={[
          'transition-all duration-200',
          'text-foreground',
          menuMobileOpen ? 'text-xs' : 'text-sm',
        ].join(' ')}
      >
        {menuMobileOpen
          ? 'Close'
          : menuLevelId
          ? levelsData[menuLevelId].name
          : levelsData['home'].name}
      </span>
    </div>
  )
})
