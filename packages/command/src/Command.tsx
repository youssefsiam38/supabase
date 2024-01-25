import { type ActionPage } from './Page/ActionPage'
import { type PageId, Page, PageMap } from './Page/Page'
import { NonEmptyArray } from './utils'

export type AnyPage = Page | ActionPage
type Subscriber = (state: State) => void
type State = string

export class Command {
  private _query: string
  private _subscribers: Array<Subscriber>

  private _pageTree: AnyPage
  private _pageMap: Map<PageId, AnyPage>
  private _activePageId: PageId

  private _history: NonEmptyArray<AnyPage>

  constructor(defaultPage: AnyPage) {
    this._query = ''
    this._subscribers = []

    this._pageTree = defaultPage
    this._activePageId = defaultPage.id

    this._pageMap = new Map([[defaultPage.id, defaultPage]])
    defaultPage.attachPageMap(this._pageMap)

    this._history = [defaultPage]
  }

  get query() {
    return this._query
  }

  set query(value: string) {
    this._query = value
  }

  get activePageId() {
    return this._activePageId
  }

  pageForId(id: PageId) {
    return this._pageMap.get(id)
  }

  subscribe(fn: Subscriber) {
    this._subscribers.push(fn)
    return this._unsubscribe.bind(this, fn)
  }

  private _unsubscribe(fn: Subscriber) {
    const idx = this._subscribers.indexOf(fn)
    if (idx > -1) this._subscribers.splice(idx, 1)
  }
}
