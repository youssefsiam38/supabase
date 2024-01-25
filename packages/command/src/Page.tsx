import { uniqueId } from 'lodash'

export type PageId = string

export type PageDraft = {
  name: string
}

export type PageMap = Map<PageId, Page>

export class Page {
  private _id: PageId
  name: string

  private _parentIds: Array<PageId>
  private _childIds: Array<PageId>

  private _pageMap: PageMap | null

  static genId() {
    return uniqueId('page_')
  }

  constructor(draft: PageDraft, pageMap?: PageMap) {
    this._id = Page.genId()
    this.name = draft.name
    this._parentIds = []
    this._childIds = []
    this._pageMap = pageMap ?? null
  }

  get id() {
    return this._id
  }

  hasPageMap() {
    return this._pageMap != null // deliberate loose equality
  }

  attachPageMap(pageMap: PageMap) {
    this._pageMap = pageMap
    this._pageMap.set(this.id, this)
  }

  attachChild(child: Page) {
    if (this._childIds.includes(child.id)) {
      return false
    }
    this._childIds.push(child.id)
    child._parentIds.push(this.id)
    if (this._pageMap && !child.hasPageMap()) {
      child.attachPageMap(this._pageMap)
    }
  }
}
