import { uniqueId } from 'lodash'

export type PageId = string

export type PageDraft = {
  name: string
}

export type PageMap = Map<PageId, Page>

export class Page {
  private _id: PageId
  name: string

  protected _parentIds: Array<PageId>
  protected _childIds: Array<PageId>

  protected _pageMap: PageMap | null

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

  detach() {
    // Detach own children first to prevent leaking children
    for (const childId of this._childIds) {
      const child = this._pageMap?.get(childId)
      if (!child) return

      const index = child._parentIds.indexOf(this.id)
      child._parentIds.splice(index, 1)
      if (child._parentIds.length === 0) {
        child.detach()
      }
    }

    for (const parentId of this._parentIds) {
      const parent = this._pageMap?.get(parentId)
      if (!parent) return

      const index = parent._childIds.indexOf(this.id)
      parent._childIds.splice(index, 1)
    }

    this._pageMap?.delete(this.id)
    // Suspect this isn't actually necessary
    this._pageMap = null
  }
}
