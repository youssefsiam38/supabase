import { Modal } from '../Modal'
import { cn } from '@ui/lib/utils'
import {
  CommandInput,
  CommandPagesProvider,
  CommandSearchProvider,
  useCommandPagesContext,
  useCommandSearchContext,
} from './Command.utils'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'

export function CommandMenu({ isOpen }: { isOpen: boolean }) {
  return (
    <Modal
      visible={isOpen}
      hideFooter
      className={cn(
        '!bg-overlay/90 backdrop-filter backdrop-blur-sm',
        '!border-overlay/90',
        'transition ease-out',
        'place-self-start mx-auto top-24'
      )}
    >
      <CommandPagesProvider>
        <CommandMenuInner isOpen={isOpen} />
      </CommandPagesProvider>
    </Modal>
  )
}

function SmoothHeightWrapper({ heightKey, className, children }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState<'auto' | number>('auto')

  const debouncedSetHeight = debounce((height) => setContainerHeight(height), 0)

  useEffect(() => {
    if (innerRef.current) {
      const { height } = innerRef.current.getBoundingClientRect()
      if (containerHeight === 'auto' || height > containerHeight) {
        setContainerHeight(height)
      } else {
        debouncedSetHeight(height)
      }
    }
  }, [heightKey])

  return (
    <div
      style={
        {
          '--smooth-height-container-height':
            containerHeight === 'auto' ? 'auto' : `${containerHeight}px`,
        } as CSSProperties
      }
      className={cn('transition-all h-[var(--smooth-height-container-height)]', 'overflow-auto')}
    >
      <div ref={innerRef} className={className}>
        {children}
      </div>
    </div>
  )
}

function CommandMenuInner({ isOpen }: { isOpen: boolean }) {
  const { commandLists, pageBack } = useCommandPagesContext()

  useEffect(() => {
    function handleEscape(evt: KeyboardEvent) {
      if (isOpen && evt.key === 'Escape') {
        pageBack()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => window.removeEventListener('keydown', handleEscape)
  }, [pageBack])

  return (
    <CommandSearchProvider commands={commandLists ?? []}>
      <CommandInput />
      <hr />
      <CommandBody />
    </CommandSearchProvider>
  )
}

function CommandBody() {
  const { Component } = useCommandPagesContext()
  const {
    lists: { displayedItems, displayedLists },
  } = useCommandSearchContext()

  return (
    <SmoothHeightWrapper heightKey={displayedItems.size + displayedLists.size} className="p-2">
      <Component />
    </SmoothHeightWrapper>
  )
}
