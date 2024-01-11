export const frameworks = [
  {
    tooltip: 'ReactJS',
    icon: '/docs/img/icons/react-icon',
    href: '/guides/getting-started/quickstarts/reactjs',
  },
  {
    tooltip: 'Next.js',
    icon: '/docs/img/icons/nextjs-icon',
    href: '/guides/getting-started/quickstarts/nextjs',
  },
  {
    tooltip: 'RedwoodJS',
    icon: '/docs/img/icons/redwoodjs-icon',
    href: '/guides/getting-started/quickstarts/redwoodjs',
  },
  {
    tooltip: 'Flutter',
    icon: '/docs/img/icons/flutter-icon',
    href: '/guides/getting-started/quickstarts/flutter',
  },
  {
    tooltip: 'Android Kotlin',
    icon: '/docs/img/icons/kotlin-icon',
    href: '/guides/getting-started/quickstarts/kotlin',
  },
  {
    tooltip: 'SvelteKit',
    icon: '/docs/img/icons/svelte-icon',
    href: '/guides/getting-started/quickstarts/sveltekit',
  },
  {
    tooltip: 'SolidJS',
    icon: '/docs/img/icons/solidjs-icon',
    href: '/guides/getting-started/quickstarts/solidjs',
  },
  {
    tooltip: 'Vue',
    icon: '/docs/img/icons/vuejs-icon',
    href: '/guides/getting-started/quickstarts/vue',
  },
  {
    tooltip: 'NuxtJS',
    icon: '/docs/img/icons/nuxt-icon',
    href: '/guides/getting-started/quickstarts/nuxtjs',
  },
  {
    tooltip: 'refine',
    icon: '/docs/img/icons/refine-icon',
    href: '/guides/getting-started/quickstarts/refine',
  },
]

export const products = [
  {
    title: 'Database',
    icon: 'database',
    hasLightIcon: true,
    href: '/guides/database',
    description:
      'Supabase provides a full Postgres database for every project with Realtime functionality, database backups, extensions, and more.',
  },
  {
    title: 'Auth',
    icon: 'auth',
    hasLightIcon: true,
    href: '/guides/auth',
    description:
      'Add and manage email and password, passwordless, OAuth, and mobile logins to your project through a suite of identity providers and APIs.',
  },
  {
    title: 'Storage',
    icon: 'storage',
    hasLightIcon: true,
    href: '/guides/storage',
    description:
      'Store, organize, transform, and serve large files—fully integrated with your Postgres database with Row Level Security access policies.',
  },
  {
    title: 'AI & Vectors',
    icon: 'ai',
    hasLightIcon: true,
    href: '/guides/ai',
    description: 'Use Supabase to store and search embedding vectors.',
  },
  {
    title: 'Realtime',
    icon: 'realtime',
    hasLightIcon: true,
    href: '/guides/realtime',
    description:
      'Listen to database changes, store and sync user states across clients, broadcast data to clients subscribed to a channel, and more.',
  },
  {
    title: 'Edge Functions',
    icon: 'edge-functions',
    hasLightIcon: true,
    href: '/guides/functions',
    description:
      'Globally distributed, server-side functions to execute your code closest to your users for the lowest latency.',
  },
]

export const migrationGuides = [
  {
    title: 'Firebase Auth',
    icon: '/docs/img/icons/firebase-icon',
    href: '/guides/resources/migrating-to-supabase/firebase-auth',
  },
  {
    title: 'Firestore Data',
    icon: '/docs/img/icons/firebase-icon',
    href: '/guides/resources/migrating-to-supabase/firestore-data',
  },
  {
    title: 'Firebase Storage',
    icon: '/docs/img/icons/firebase-icon',
    href: '/guides/resources/migrating-to-supabase/firebase-storage',
  },
  {
    title: 'Heroku',
    icon: '/docs/img/icons/heroku-icon',
    href: '/guides/resources/migrating-to-supabase/heroku',
  },
  {
    title: 'Render',
    icon: '/docs/img/icons/render-icon',
    href: '/guides/resources/migrating-to-supabase/render',
  },
  {
    title: 'Amazon RDS',
    icon: '/docs/img/icons/aws-rds-icon',
    href: '/guides/resources/migrating-to-supabase/amazon-rds',
  },
  {
    title: 'Postgres',
    icon: '/docs/img/icons/postgres-icon',
    href: '/guides/resources/migrating-to-supabase/postgres',
  },
  {
    title: 'MySQL',
    icon: '/docs/img/icons/mysql-icon',
    href: '/guides/resources/migrating-to-supabase/mysql',
  },
  {
    title: 'MSSQL',
    icon: '/docs/img/icons/mssql-icon',
    href: '/guides/resources/migrating-to-supabase/mssql',
  },
]

export const selfHostingOptions = [
  {
    title: 'Auth',
    icon: 'auth',
    href: 'reference/self-hosting-auth/introduction',
  },
  {
    title: 'Realtime',
    icon: 'realtime',
    href: 'reference/self-hosting-realtime/introduction',
  },
  {
    title: 'Storage',
    icon: 'storage',
    href: 'reference/self-hosting-storage/introduction',
  },
  {
    title: 'Analytics',
    icon: 'analytics',
    href: 'reference/self-hosting-analytics/introduction',
  },
]

export const clientLibraries = [
  {
    title: 'Javascript',
    icon: 'reference-javascript',
    href: 'reference/javascript/introduction',
  },
  {
    title: 'Flutter',
    icon: 'reference-dart',
    href: 'reference/dart/introduction',
  },
  {
    title: 'Python',
    icon: 'reference-python',
    href: 'reference/python/introduction',
  },
  {
    title: 'C#',
    icon: 'reference-csharp',
    href: 'reference/csharp/introduction',
  },
  {
    title: 'Swift',
    icon: 'reference-swift',
    href: 'reference/swift/introduction',
  },
  {
    title: 'Kotlin',
    icon: 'reference-kotlin',
    href: 'reference/kotlin/introduction',
  },
]

export const additionalResources = [
  {
    title: 'Management API',
    description: 'Manage your Supabase projects and organizations.',
    icon: 'reference-api',
    href: 'reference/api/introduction',
  },
  {
    title: 'Supabase CLI',
    description: 'Use the CLI to develop, manage and deploy your projects.',
    icon: 'reference-cli',
    href: 'reference/cli/introduction',
  },
  {
    title: 'Platform Guides',
    description: 'Learn more about the tools and services powering Supabase.',
    icon: 'platform',
    href: 'guides/platform',
  },
  {
    title: 'Integrations',
    description: 'Explore a variety of integrations from Supabase partners.',
    icon: 'integrations',
    href: 'guides/integrations',
  },
]
