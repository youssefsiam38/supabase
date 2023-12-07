import { PublicCommandList } from '../useCommandMenu'
import { COMMAND_PAGE } from './constants'

export function generateStudioHomeCommands({ pageForward }): PublicCommandList[] {
  return [
    {
      heading: 'Search',
      displayBehavior: 'forceMount',
      items: [
        {
          label: 'Docs search',
          type: 'button',
          onClick: () => pageForward(COMMAND_PAGE.DOCS_SEARCH),
        },
        {
          label: 'Supabase AI',
          type: 'button',
          onClick: () => {},
        },
      ],
    },
    {
      heading: 'Support',
      items: [
        {
          label: 'Go to support',
          type: 'link',
          href: '',
        },
      ],
    },
    {
      heading: 'Utilities',
      items: [
        {
          label: 'Get API keys',
          displayBehavior: 'whenMatch',
          type: 'button',
          onClick: () => pageForward(COMMAND_PAGE.API_KEYS),
        },
      ],
    },
  ]
}
