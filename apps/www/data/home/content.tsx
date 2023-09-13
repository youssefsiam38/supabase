import VideoWithHighlights from '~/components/VideoWithHighlights'
import solutions from '~/data/Solutions'

export default {
  heroSection: {
    heading: (
      <>
        <span className="block text-[#F4FFFA00] bg-clip-text bg-gradient-to-b from-scale-1200 to-scale-1200 dark:to-scale-1100">
          Build in a weekend
        </span>
        <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#3ECF8E] via-[#3ECF8E] to-[#3ecfb2] block md:ml-0">
          Scale to millions
        </span>
      </>
    ),
    subheading: (
      <>
        Supabase is an open source Firebase alternative. <br className="hidden md:block" />
        Start your project with a Postgres database, Authentication, instant APIs, Edge Functions,
        Realtime subscriptions, Storage, and Vector embeddings.
      </>
    ),
    image: '/images/index/gradient-bg.png',
    cta: {
      label: 'Start your project',
      link: 'https://app.supabase.com',
    },
    secondaryCta: {
      label: 'Documentation',
      link: '/docs',
    },
  },
  productsSection: {
    products: { ...solutions },
  },
  dashboardFeatures: {
    badge: 'Hosted Studio',
    title: (
      <>
        Manage your app <br className="hidden md:block" />
        without leaving the dashboard
      </>
    ),
    tabs: [
      {
        label: 'Table Editor',
        panel: () => (
          <VideoWithHighlights
            video={'/images/index/dashboard/table-editor-demo.mp4'}
            highlights={[
              'Full CRUD',
              'Materialized Views',
              'Foreign Tables',
              'Partitioned Tables',
              'Easy as a spreadsheet',
            ]}
          />
        ),
      },
      {
        label: 'SQL Editor',
        panel: () => (
          <VideoWithHighlights
            video={'/images/index/dashboard/table-editor-demo.mp4'}
            highlights={[
              'AI SQL Editor',
              'Row Level Security',
              'Save time using Templates',
              'Save and reuse Queries',
            ]}
          />
        ),
      },
      {
        label: 'Auth Rules',
        panel: () => (
          <VideoWithHighlights
            video={'/images/index/dashboard/table-editor-demo.mp4'}
            highlights={[
              'Email Logins',
              'Magic Links',
              '20+ Third-party Logins',
              'Custom Access Policies via RLS',
              'Password Recovery',
            ]}
          />
        ),
      },
    ],
  },
}
