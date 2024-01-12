import { MenuList } from '~/componentsV2/navigation/navTypes'

export const authNavTree: MenuList = [
  {
    section: null,
    pages: [
      {
        label: 'Overview',
        href: '/guides/auth',
      },
      {
        label: 'Redirect URLs',
        href: '/guides/auth/concepts/redirect-urls',
      },
    ],
  },
  {
    section: 'Quickstarts',
    pages: [
      { label: 'Next.js', href: '/guides/auth/quickstarts/nextjs' },
      { label: 'React', href: '/guides/auth/quickstarts/react' },
      { label: 'React Native', href: '/guides/auth/quickstarts/react-native' },
    ],
  },
  {
    section: 'Authentication',
    pages: [
      { label: 'Email Login', href: '/guides/auth/auth-email' },
      {
        label: 'Passwordless Login',
        href: '/guides/auth/passwordless-login',
        pages: [
          { label: 'Email Magic Link', href: '/guides/auth/passwordless-login/auth-magic-link' },
          { label: 'Email OTP', href: '/guides/auth/passwordless-login/auth-email-otp' },
          { label: 'Phone OTP', href: '/guides/auth/phone-login' },
        ],
      },
      {
        label: 'Phone Login',
        href: '/guides/auth/phone-login',
        // pages: [...PhoneLoginsItems],
      },
      {
        label: 'Social Login (OAuth)',
        href: '/guides/auth/social-login',
        pages: [
          {
            label: 'Native Mobile OAuth',
            href: '/guides/auth/native-mobile-deep-linking',
          },
          // ...SocialLoginpages,
        ],
      },
      {
        label: 'Native Mobile Login',
        href: '/guides/auth/native-mobile-login',
        pages: [
          // ...NativeMobileLoginpages,
          {
            label: 'OAuth Deep Linking',
            href: '/guides/auth/native-mobile-deep-linking',
          },
        ],
      },
      {
        label: 'User Sessions',
        href: '/guides/auth/sessions',
      },
      { label: 'Passwords', href: '/guides/auth/passwords' },
      {
        label: 'User Management',
        href: '/guides/auth/auth-user-management',
        pages: [
          {
            label: 'Identity Linking',
            href: '/guides/auth/auth-identity-linking',
          },
        ],
      },
      {
        label: 'Enterprise SSO',
        href: '/guides/auth/enterprise-sso',
        pages: [
          {
            label: 'SAML 2.0',
            href: '/guides/auth/sso/auth-sso-saml',
          },
        ],
      },
      { label: 'Email Templates', href: '/guides/auth/auth-email-templates' },
      { label: 'Auth Hooks', href: '/guides/auth/auth-hooks' },
    ],
  },
  {
    section: 'Authorization',
    pages: [
      { label: 'Enable Captcha Protection', href: '/guides/auth/auth-captcha' },
      { label: 'Configuring Custom SMTP', href: '/guides/auth/auth-smtp' },
      { label: 'Managing User Data', href: '/guides/auth/managing-user-data' },
      { label: 'Multi-Factor Authentication', href: '/guides/auth/auth-mfa' },
      { label: 'Row Level Security', href: '/guides/auth/row-level-security' },
      { label: 'Column Level Security', href: '/guides/auth/column-level-security' },
    ],
  },
  {
    section: 'Server-side Auth',
    pages: [
      { label: 'Overview', href: '/guides/auth/server-side/overview' },
      { label: 'Creating a client', href: '/guides/auth/server-side/creating-a-client' },
      {
        label: 'Email Auth with PKCE flow',
        href: '/guides/auth/server-side/email-based-auth-with-pkce-flow-for-ssr',
      },
      {
        label: 'OAuth with PKCE flow',
        href: '/guides/auth/server-side/oauth-with-pkce-flow-for-ssr',
      },
      { label: 'Server-side Rendering', href: '/guides/auth/server-side-rendering' },
      {
        label: 'Migrating from Auth Helpers',
        href: '/guides/auth/server-side/migrating-to-ssr-from-auth-helpers',
      },
    ],
  },
  {
    section: 'Auth UI',
    pages: [
      { label: 'Auth UI', href: '/guides/auth/auth-helpers/auth-ui' },
      { label: 'Flutter Auth UI', href: '/guides/auth/auth-helpers/flutter-auth-ui' },
    ],
  },
  {
    section: 'Deep Dive',
    pages: [
      {
        label: 'Part One: JWTs',
        href: '/learn/auth-deep-dive/auth-deep-dive-jwts',
      },
      {
        label: 'Part Two: Row Level Security',
        href: '/learn/auth-deep-dive/auth-row-level-security',
      },
      { label: 'Part Three: Policies', href: '/learn/auth-deep-dive/auth-policies' },
      { label: 'Part Four: GoTrue', href: '/learn/auth-deep-dive/auth-gotrue' },
      {
        label: 'Part Five: Google OAuth',
        href: '/learn/auth-deep-dive/auth-google-oauth',
      },
    ],
  },
]
