import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react'

type CommandContextValue = { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }

const CommandContext = createContext<CommandContextValue | undefined>(undefined)
CommandContext.displayName = 'CommandContext'

export function CommandContextProvider({
  children,
  context,
}: PropsWithChildren<{ context: CommandContextValue }>) {
  useEffect(() => {
    function handleMenuToggle(evt: KeyboardEvent) {
      if (evt.key === 'k' && (evt.metaKey || evt.ctrlKey) && !evt.defaultPrevented) {
        // Need to handle case where something is focused or user is typing
        // Also check case of IME
        context.setOpen((open) => !open)
        evt.preventDefault()
      }
    }

    window.addEventListener('keydown', handleMenuToggle)
    return () => window.removeEventListener('keydown', handleMenuToggle)
  }, [])

  return <CommandContext.Provider value={context}>{children}</CommandContext.Provider>
}

export function useCommandContext() {
  const context = useContext(CommandContext)
  if (context === undefined) {
    throw Error('`useCommandContext` must be used within a `CommandContextProvider`')
  }
  return context
}
