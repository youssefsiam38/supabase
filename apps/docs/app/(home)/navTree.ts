import { MenuList } from '~/componentsV2/navigation/navTypes'

export const HOMEPAGE_MENU_ITEMS: MenuList = [
  {
    section: null,
    pages: [
      {
        label: 'Home',
        icon: 'home',
        href: '/',
      },
      {
        label: 'Getting Started',
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
        icon: 'database',
        href: '/guides/database',
      },
      {
        label: 'Auth',
        icon: 'auth',
        href: '/guides/auth',
      },
      {
        label: 'Storage',
        icon: 'storage',
        href: '/guides/storage',
      },
      {
        label: 'Edge Functions',
        icon: 'edge-functions',
        href: '/guides/functions',
      },
      {
        label: 'Realtime',
        icon: 'realtime',
        href: '/guides/realtime',
      },
      {
        label: 'AI & Vectors',
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
        icon: 'rest',
        href: '/guides/api',
        level: 'api',
      },
      {
        label: 'GraphQL',
        icon: 'graphql',
        href: '/guides/graphql',
        level: 'graphql',
      },
    ],
  },
  {
    section: 'Development cycle',
    pages: [
      {
        label: 'Local Dev / CLI',
        icon: 'dev-cli',
        href: '/guides/cli',
        level: 'reference_javascript',
      },
      {
        label: 'Platform',
        icon: 'platform',
        href: '/guides/platform',
        level: 'platform',
      },
      {
        label: 'Self-Hosting',
        icon: 'self-hosting',
        href: '/guides/self-hosting',
        level: 'self_hosting',
      },
    ],
  },
  {
    section: 'Client library reference',
    pages: [
      {
        label: 'JavaScript',
        icon: 'reference-javascript',
        href: '/reference/javascript/introduction',
        level: 'reference_javascript',
      },
      {
        label: 'Flutter',
        icon: 'reference-dart',
        href: '/reference/dart/introduction',
        level: 'reference_dart',
      },
      {
        label: 'Python',
        icon: 'reference-python',
        href: '/reference/python/introduction',
        level: 'reference_python',
        community: true,
      },
      {
        label: 'C#',
        icon: 'reference-csharp',
        href: '/reference/csharp/introduction',
        level: 'reference_csharp',
        community: true,
      },
      {
        label: 'Swift',
        icon: 'reference-swift',
        href: '/reference/swift/introduction',
        level: 'reference_swift',
        community: true,
      },
      {
        label: 'Kotlin',
        icon: 'reference-kotlin',
        href: '/reference/kotlin/introduction',
        level: 'reference_kotlin',
        community: true,
      },
    ],
  },
  {
    section: 'Resources',
    pages: [
      {
        label: 'CLI Commands',
        icon: 'reference-cli',
        href: '/reference/cli/introduction',
        level: 'reference_javascript',
      },
      {
        label: 'Management API',
        icon: 'reference-api',
        href: '/reference/api/introduction',
        level: 'reference_javascript',
      },
      {
        label: 'Guides and Examples',
        icon: 'resources',
        href: '/guides/resources',
        level: 'resources',
      },
      {
        label: 'Integrations',
        icon: 'integrations',
        hasLightIcon: true,
        href: 'https://supabase.com/partners/integrations',
        level: 'integrations',
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
