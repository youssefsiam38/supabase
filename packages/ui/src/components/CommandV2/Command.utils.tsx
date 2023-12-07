import { ReactNode, createContext, memo, useContext } from 'react'
import {
  PublicCommandList as CommandList,
  useCommandPage,
  useCommandSearch,
} from './useCommandMenu'
import { cn } from '@ui/lib/utils'

const CommandPagesContext = createContext<ReturnType<typeof useCommandPage> | null>(null)

export function useCommandPagesContext() {
  const pagesContext = useContext(CommandPagesContext)

  if (!pagesContext) {
    throw Error('`useCommandPagesContext` must be used within a `CommandPagesProvider`')
  }

  return pagesContext
}

export function CommandPagesProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const context = useCommandPage()

  return <CommandPagesContext.Provider value={context}>{children}</CommandPagesContext.Provider>
}

const CommandSearchContext = createContext<ReturnType<typeof useCommandSearch> | null>(null)

export function useCommandSearchContext() {
  const commandContext = useContext(CommandSearchContext)

  if (!commandContext) {
    throw Error('`useCommandSearchContext` must be used within a `CommandSearchProvider`')
  }

  return commandContext
}

export function CommandSearchProvider({
  commands,
  children,
}: {
  commands: CommandList[]
  children: ReactNode | ReactNode[]
}) {
  const context = useCommandSearch(commands)

  return <CommandSearchContext.Provider value={context}>{children}</CommandSearchContext.Provider>
}

export function CommandInput() {
  const {
    search: { search, setSearch, inputRef },
  } = useCommandSearchContext()

  return (
    <input
      ref={inputRef}
      type="text"
      value={search}
      onChange={(evt) => setSearch(evt.target.value)}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent px-4 py-7 text-sm',
        'focus:shadow-none focus:ring-transparent',
        'text-foreground-light placeholder:text-border-stronger disabled:cursor-not-allowed disabled:opacity-50 border-0'
      )}
    />
  )
}

function CommandItem({ item, selected }) {
  console.log(`rendering item: ${item.label}`)
  return (
    <li
      key={item.label}
      aria-selected={selected}
      className="cursor-default select-none items-center rounded-md text-sm group py-3 text-foreground-light relative flex px-2 aria-selected:bg-overlay-hover/80 aria-selected:backdrop-filter aria-selected:backdrop-blur-md data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    >
      {item.type === 'button' ? <button onClick={item.onClick}>{item.label}</button> : item.label}
    </li>
  )
}

const MemoizedCommandItem = memo(CommandItem)

export function CommandList() {
  console.log('rendering command list')
  const {
    lists: { lists, displayedLists, displayedItems },
    selection: { selectedIndex },
  } = useCommandSearchContext()

  return (
    <div>
      {lists.map((list) =>
        displayedLists.has(list.listIndex) ? (
          <div>
            <h2 key={list.heading} className="text-foreground-muted text-sm">
              {list.heading}
            </h2>
            <ul className="list-none">
              {list.items.map((item) =>
                displayedItems.has(item.itemIndex) ? (
                  <MemoizedCommandItem item={item} selected={item.itemIndex === selectedIndex} />
                ) : null
              )}
            </ul>
          </div>
        ) : null
      )}
    </div>
  )
}

export function DocsSearch() {
  return (
    <>
      <h1>Docs search</h1>
    </>
  )
}
