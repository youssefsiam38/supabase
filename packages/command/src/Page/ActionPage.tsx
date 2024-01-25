import { uniqueId } from 'lodash'

import { type PageId, type PageDraft, Page } from './Page'

type ActionId = `action_${string}`

interface ActionBase {
  id: ActionId
  name: string
  section?: string
  matchValue: string
  keywords?: Array<string>
  pinned?: boolean
  previewInParent?: boolean
}

type DerivedProperties = 'id' | 'matchValue'

interface ActionRun extends ActionBase {
  run: () => void
}
type ActionRunDraft = Omit<ActionRun, DerivedProperties>

interface ActionRoute extends ActionBase {
  route: PageId
}
type ActionRouteDraft = Omit<ActionRoute, DerivedProperties>

export type Action = ActionRun | ActionRoute
export type ActionDraft = ActionRunDraft | ActionRouteDraft

interface ActionPageDraft extends PageDraft {
  actions: Array<ActionDraft>
}

function genActionId() {
  return uniqueId('action_') as ActionId
}

export const NO_SECTION_SYMBOL = Symbol.for('sectionless action')

export class ActionPage extends Page {
  actions: Array<Action>

  constructor(draft: ActionPageDraft) {
    super(draft)
    this.actions = []

    for (const action of draft.actions) {
      const id = genActionId()
      const matchValue = `${action.section ?? ''} ${action.name} ${
        action.keywords ? action.keywords.join(' ') : ''
      }`.trim()
      const _action = { ...action, id, matchValue } satisfies Action
      this.actions.push(_action)
    }
  }
}
