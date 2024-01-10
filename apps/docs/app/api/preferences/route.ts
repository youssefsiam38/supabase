import type { NextRequest } from 'next/server'
import { COOKIES } from '~/stores/cookies'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const theme = searchParams.get('theme')

  if (!theme || (theme !== 'dark' && theme !== 'light')) {
    return new Response('Invalid or missing query parameter', { status: 422 })
  }

  return new Response('OK, theme set', {
    status: 202,
    headers: {
      'Set-Cookie': `${COOKIES.THEME_PREFERENCE}=${theme}`,
    },
  })
}
