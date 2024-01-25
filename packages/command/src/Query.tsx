import { proxy } from 'valtio'

import { Command } from './Command'

export function createQueryState(command: Command) {
  const state = proxy({
    query: {
      query: '',
      setQuery: (value: string) => (state.query.query = value),
    },
    command,
  })

  return state
}

export type QueryState = ReturnType<typeof createQueryState>
