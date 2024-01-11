import { MenuList } from '~/componentsV2/navigation/navTypes'

export const HOMEPAGE_MENU_ITEMS: MenuList = [
  {
    section: null,
    pages: [
      {
        label: 'Home',
        level: 'home',
        icon: 'home',
        href: '/',
      },
      {
        label: 'Getting Started',
        level: 'gettingstarted',
        icon: 'getting-started',
        href: '/guides/getting-started',
      },
    ],
  },
  {
    section: 'Product',
    pages: [
      {
        label: 'Database',
        level: 'database',
        icon: 'database',
        href: '/guides/database',
      },
      {
        label: 'Auth',
        level: 'auth',
        icon: 'auth',
        href: '/guides/auth',
      },
      {
        label: 'Storage',
        level: 'storage',
        icon: 'storage',
        href: '/guides/storage',
      },
      {
        label: 'Edge Functions',
        level: 'functions',
        icon: 'edge-functions',
        href: '/guides/functions',
      },
      {
        label: 'Realtime',
        level: 'realtime',
        icon: 'realtime',
        href: '/guides/realtime',
      },
      {
        label: 'AI & Vectors',
        level: 'ai',
        icon: 'ai',
        href: '/guides/ai',
      },
    ],
  },
  {
    section: 'Data API',
    pages: [
      {
        label: 'REST',
        level: 'api',
        icon: 'rest',
        href: '/guides/api',
      },
      {
        label: 'GraphQL',
        level: 'graphql',
        icon: 'graphql',
        href: '/guides/graphql',
      },
    ],
  },
  {
    section: 'Development cycle',
    pages: [
      {
        label: 'Local Dev / CLI',
        level: 'reference_javascript',
        icon: 'dev-cli',
        href: '/guides/cli',
      },
      {
        label: 'Platform',
        level: 'platform',
        icon: 'platform',
        href: '/guides/platform',
      },
      {
        label: 'Self-Hosting',
        level: 'self_hosting',
        icon: 'self-hosting',
        href: '/guides/self-hosting',
      },
    ],
  },
  {
    section: 'Client library reference',
    pages: [
      {
        label: 'JavaScript',
        level: 'reference_javascript',
        icon: 'reference-javascript',
        href: '/reference/javascript/introduction',
      },
      {
        label: 'Flutter',
        level: 'reference_dart',
        icon: 'reference-dart',
        href: '/reference/dart/introduction',
      },
      {
        label: 'Python',
        level: 'reference_python',
        icon: 'reference-python',
        href: '/reference/python/introduction',
        community: true,
      },
      {
        label: 'C#',
        level: 'reference_csharp',
        icon: 'reference-csharp',
        href: '/reference/csharp/introduction',
        community: true,
      },
      {
        label: 'Swift',
        level: 'reference_swift',
        icon: 'reference-swift',
        href: '/reference/swift/introduction',
        community: true,
      },
      {
        label: 'Kotlin',
        level: 'reference_kotlin',
        icon: 'reference-kotlin',
        href: '/reference/kotlin/introduction',
        community: true,
      },
    ],
  },
  {
    section: 'Resources',
    pages: [
      {
        label: 'CLI Commands',
        level: 'reference_javascript',
        icon: 'reference-cli',
        href: '/reference/cli/introduction',
      },
      {
        label: 'Management API',
        level: 'reference_javascript',
        icon: 'reference-api',
        href: '/reference/api/introduction',
      },
      {
        label: 'Guides and Examples',
        level: 'resources',
        icon: 'resources',
        href: '/guides/resources',
      },
      {
        label: 'Integrations',
        level: 'integrations',
        icon: 'integrations',
        hasLightIcon: true,
        href: 'https://supabase.com/partners/integrations',
      },
    ],
  },
  {
    section: null,
    pages: [
      {
        label: 'Status',
        icon: 'status',
        href: 'https://status.supabase.com/',
      },
    ],
  },
]
