import { FunctionComponent, Key, memo, useEffect, useMemo, useRef, useState } from 'react'
import { CommandList, DocsSearch } from './Command.utils'

export const INITIAL_ITEMS: CommandList[] = [
  {
    heading: 'Search',
    displayBehavior: 'forceMount',
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
      },
    ],
  },
  {
    heading: 'Utilities',
    items: [
      {
        label: 'Get API keys',
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
  const totalItems = lists.reduce((totalNumber, list) => totalNumber + list.items.length, 0)

  if (search) {
    const result = filterBySearch(lists, search)
    result.totalItems = totalItems
    return result
  } else {
    const result = filterByDisplayBehavior(lists)
    result.totalItems = totalItems
    return result
  }
}

export function useCommandSearch(initialLists: CommandList[]) {
  const [search, setSearch] = useState('')
  const [lists, setLists] = useState<AnnotatedCommandList[]>(() => annotateLists(initialLists))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(lists.length ? 0 : null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { totalItems, displayedItems, displayedLists } = useMemo(
    () => filterLists(lists, search),
    [lists, search]
  )

  function refreshLists(updatedList: CommandList[]) {
    setLists(annotateLists(updatedList))
  }

  function getFirst() {
    let start = 0
    while (start < totalItems) {
      if (displayedItems.has(start)) {
        return start
      }
      start++
    }
    return null
  }

  function getLast() {
    let end = totalItems - 1
    while (end >= 0) {
      if (displayedItems.has(end)) {
        return end
      }
      end--
    }
    return null
  }

  function getPrevious() {
    if (selectedIndex === null) {
      return null
    }
    let curr = selectedIndex === 0 ? totalItems - 1 : selectedIndex - 1
    while (curr >= 0) {
      if (displayedItems.has(curr)) {
        return curr
      }
      curr--
    }
    return getLast()
  }

  function getNext() {
    if (selectedIndex === null) {
      return null
    }
    let curr = selectedIndex === totalItems - 1 ? 0 : selectedIndex + 1
    while (curr < totalItems) {
      if (displayedItems.has(curr)) {
        return curr
      }
      curr++
    }
    return getFirst()
  }

  useEffect(() => {
    function keyHandler(evt: KeyboardEvent) {
      if (document.activeElement !== inputRef.current) {
        return
      }

      switch (evt.key) {
        // Need to account for IME
        case 'ArrowUp':
          if (evt.metaKey || evt.ctrlKey) {
            setSelectedIndex(getFirst())
          } else {
            setSelectedIndex(getPrevious())
          }
          break
        case 'ArrowDown':
          if (evt.metaKey || evt.ctrlKey) {
            setSelectedIndex(getLast())
          } else {
            setSelectedIndex(getNext())
          }
          break
        default:
          return
      }
    }

    window.addEventListener('keydown', keyHandler)

    return () => window.removeEventListener('keydown', keyHandler)
  }, [getFirst, getPrevious, getNext, getLast])

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
    },
  }
}
