import { FunctionComponent, memo, useMemo, useRef, useState } from 'react'
import { CommandList, DocsSearch } from './Command.utils'

export const INITIAL_ITEMS: CommandList[] = [
  {
    heading: 'Search',
    items: [
      {
        label: 'Docs search',
      },
      {
        label: 'Supabase AI',
      },
    ],
  },
  {
    heading: 'Support',
    items: [
      {
        label: 'Go to support',
        displayBehavior: 'whenMatch',
      },
    ],
  },
]

export enum COMMAND_PAGE {
  ROOT = 'Home',
  DOCS_SEARCH = 'Docs search',
}

// Must have at least root page
type CommandPages = [COMMAND_PAGE.ROOT, ...COMMAND_PAGE[]]

interface CommandItem {
  itemIndex?: number
  label: string
  displayBehavior?: 'forceMount' | 'whenMatch'
}

interface CommandList {
  listIndex?: number
  heading: string
  items: CommandItem[]
  displayBehavior?: 'forceMount'
}

type AnnotatedCommandList = Omit<Required<CommandList>, 'items'> & {
  items: (Omit<CommandItem, 'itemIndex'> & { itemIndex: number })[]
}

export type PublicCommandList = Omit<CommandList, 'listIndex' | 'items'> & {
  items: Omit<CommandItem, 'itemIndex'>[]
}

const commandPageContents: Record<
  COMMAND_PAGE,
  { Component: FunctionComponent; commands?: PublicCommandList[] }
> = {
  [COMMAND_PAGE.ROOT]: { Component: memo(CommandList), commands: INITIAL_ITEMS },
  [COMMAND_PAGE.DOCS_SEARCH]: { Component: memo(DocsSearch) },
}

export function useCommandPage() {
  const [pages, setPages] = useState<CommandPages>([COMMAND_PAGE.ROOT])

  function pageBack() {
    if (pages.length === 1) {
      // Nowhere to page back to if we're at root
      return
    }
    setPages(pages.slice(0, -1) as CommandPages) // Can cast here since we've enforced length check above
  }

  function pageForward(newPage: COMMAND_PAGE) {
    setPages([...pages, newPage])
  }

  const currentPage = pages[pages.length - 1]

  const { Component, commands } = commandPageContents[currentPage]

  return { Component, commandLists: commands, pageBack, pageForward }
}

function annotateLists(lists: CommandList[]) {
  console.log('annotating list')
  let itemIndex = 0

  lists.forEach((list, listIndex) => {
    list.listIndex = listIndex
    list.items.forEach((item) => {
      item.itemIndex = itemIndex++
    })
  })
  console.log(lists)
  return lists as unknown as AnnotatedCommandList[]
}

function match(element: CommandList | CommandItem, search: string) {
  const label = 'heading' in element ? element.heading : element.label
  return label.toLowerCase().includes(search.toLowerCase())
}

function filterBySearch(lists: AnnotatedCommandList[], search: string) {
  const displayedItems = new Set<number>()
  const displayedLists = new Set<number>()

  lists.forEach((list) => {
    if (list.displayBehavior === 'forceMount' || match(list, search)) {
      displayedLists.add(list.listIndex)
      list.items.forEach((item) => {
        if (item.displayBehavior !== 'whenMatch' || match(item, search)) {
          displayedItems.add(item.itemIndex)
        }
      })
    } else {
      let displayList = false
      list.items.forEach((item) => {
        if (item.displayBehavior === 'forceMount' || match(item, search)) {
          displayedItems.add(item.itemIndex)
          displayList = true
        }
      })

      if (displayList) {
        displayedLists.add(list.listIndex)
      }
    }
  })

  return { displayedItems, displayedLists }
}

function filterByDisplayBehavior(lists: AnnotatedCommandList[]) {
  const displayedItems = new Set<number>()
  const displayedLists = new Set<number>()

  lists.forEach((list) => {
    let displayList = false
    list.items.forEach((item) => {
      if (item.displayBehavior !== 'whenMatch') {
        displayedItems.add(item.itemIndex)
        displayList = true
      }
    })

    if (list.displayBehavior === 'forceMount' || displayList) {
      displayedLists.add(list.listIndex)
    }
  })

  return { displayedItems, displayedLists }
}

function filterLists(lists: AnnotatedCommandList[], search: string) {
  if (search) {
    return filterBySearch(lists, search)
  } else {
    return filterByDisplayBehavior(lists)
  }
}

export function useCommandSearch(initialLists: CommandList[]) {
  const [search, setSearch] = useState('')
  const [lists, setLists] = useState<AnnotatedCommandList[]>(() => annotateLists(initialLists))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(lists.length ? 0 : null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { displayedItems, displayedLists } = useMemo(
    () => filterLists(lists, search),
    [lists, search]
  )

  function refreshLists(updatedList: CommandList[]) {
    setLists(annotateLists(updatedList))
  }

  function safeSetSelectedIndex(index: number) {
    if (displayedItems.size === 0) {
      setSelectedIndex(null)
    } else if (index >= 0 && index < displayedItems.size) {
      setSelectedIndex(index)
    } else {
      setSelectedIndex(0)
    }
  }

  function selectPrior() {
    if (selectedIndex === null) {
      return
    }
    safeSetSelectedIndex(selectedIndex === 0 ? displayedItems.size - 1 : selectedIndex - 1)
  }

  function selectNext() {
    if (selectedIndex === null) {
      return
    }
    safeSetSelectedIndex(selectedIndex === displayedItems.size - 1 ? 0 : selectedIndex + 1)
  }

  function selectFirst() {
    safeSetSelectedIndex(0)
  }

  return {
    search: {
      search,
      setSearch,
      inputRef,
    },
    lists: {
      lists,
      refreshLists,
      displayedItems,
      displayedLists,
    },
    selection: {
      selectedIndex,
      selectPrior,
      selectNext,
      selectFirst,
    },
  }
}
