import { IconCompass, IconDollarSign, IconGlobe, IconTrendingUp } from 'ui'
import { Layout } from 'lucide-react'

export default {
  metaTitle: 'Templates',
  metaDescription: 'Become a Supabase Partner and enable new business opportunities.',
  heroSection: {
    // title: 'Open Source Templates',
    image: <Layout className="w-6 h-6 text-brand-600 mb-2" />,
    h1: 'Build faster with Templates',
    subheader: (
      <>Start building in minutes on the hosted Supabase platform with ready to use templates.</>
    ),
    // cta: {
    //   label: 'Become a Partner',
    //   link: 'https://forms.supabase.com/partner',
    // },
  },
  oAuthApp: {
    steps: [
      {
        title: 'Register App',
        text: 'An OAuth app first needs to be registered with Supabase',
      },
      {
        title: 'Add OAuth2 Support',
        text: 'Use the OAuth2 protocol to access a users organization or project',
      },
      {
        title: 'Receive Tokens',
        text: "You'll receive a new access and refresh token",
      },
      {
        title: 'Control Projects',
        text: 'Use Supabase REST API to control projects and other settings',
      },
    ],
  },
  featureBlocks: [
    {
      title: 'Technical support',
      description: 'Access technical support to back your integrations and customer projects.',
      icon: <IconCompass strokeWidth={1.5} />,
    },
    {
      title: 'Expand your ecosystem',
      description: 'Offer your own products and services to Supabase customers.',
      icon: <IconGlobe strokeWidth={1.5} />,
    },
    {
      title: 'Business growth',
      description: 'Explore new revenue streams and growth potential.',
      icon: <IconDollarSign strokeWidth={1.5} />,
    },
    {
      title: 'Scale with us',
      description: 'Scale automatically with the power of open-source Postgres technology.',
      icon: <IconTrendingUp strokeWidth={1.5} />,
    },
  ],
}
