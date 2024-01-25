import { useSnapshot } from 'valtio'
import { useCallback, useSyncExternalStore } from 'react'

import type { Command } from '../Command'
import { NO_SECTION_SYMBOL, type ActionPage, type Action } from '../Page/ActionPage'
import type { QueryState } from '../Query'

type CommandSelector<Slice> = (command: Command) => Slice

/**
 * Subscribe to a slice of Command state.
 *
 * The `selector` must return a stable value whenever the state is
 * unchanged, and a _fresh_ value whenever the state is changed. See
 * https://react.dev/reference/react/useSyncExternalStore to learn more.
 */
export function useCommand<T>(
  command: Command,
  selector: CommandSelector<T>,
  getServerSnapshot: (command: Command) => T
) {
  const _selector = useCallback(() => selector(command), [command, selector])
  const slice = useSyncExternalStore(command.subscribe, _selector, () => getServerSnapshot(command))
  return slice
}

function getActivePageId(command: Command) {
  return command.activePageId
}

export function useCommandActivePageId(command: Command) {
  const activePageId = useCommand(command, getActivePageId, getActivePageId)
  return activePageId
}

function match(command: Command, page: ActionPage, query: string) {
  const actions = page.actions
  const matchingActions = []

  for (const action of actions) {
    // Replace this with proper fuzzy matching later
    if (action.pinned || action.matchValue.includes(query)) {
      matchingActions.push(action)
    }

    if ('route' in action) {
      const childRoute = command.pageForId(action.route)
      if (!childRoute || !('actions' in childRoute)) continue

      for (const childAction of childRoute.actions) {
        if (childAction.previewInParent) {
          matchingActions.push(childAction)
        }
      }
    }
  }

  const sortedActions = actions.reduce((acc, action) => {
    const section = action.section ?? NO_SECTION_SYMBOL
    if (acc.has(section)) {
      // TypeScript demanding conditional chaining even though this seems checked
      acc.get(section)?.push(action)
    } else {
      acc.set(section, [action])
    }
    return acc
  }, new Map<string | Symbol, Array<Action>>()) // Using a map to preserve insertion order
  return sortedActions
}

export function useCommandFilter(queryState: QueryState, command: Command) {
  const { query } = useSnapshot(queryState.query)
  const activePageId = useCommandActivePageId(command)
  const activePage = command.pageForId(activePageId)

  if (!activePage || !('actions' in activePage)) return []

  const filteredActions = match(command, activePage, query)

  return filteredActions
}
