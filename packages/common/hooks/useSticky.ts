import { useCallback, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface IntersectionObserverOptions {
  rootMargin?: string
  threshold?: number
}

const useSticky = <Element extends HTMLElement>({
  enabled = true,
  style = {},
  options: { rootMargin = '0px 0px 0px 0px', threshold = 0.1 } = {} as IntersectionObserverOptions,
}: {
  enabled?: boolean
  style?: Partial<CSSStyleDeclaration>
  options?: IntersectionObserverOptions
}) => {
  const [inView, setInView] = useState(false)
  const stickyRef = useRef<Element>(null)
  const { ref: observedRef } = useInView({
    skip: !enabled,
    rootMargin,
    threshold,
    onChange: (inView) => (inView ? setInView(true) : setInView(false)),
  })

  const handleSticking = useCallback(
    () => {
      if (!stickyRef.current) return

      if (enabled && inView) {
        stickyRef.current.style.position = 'sticky'
        stickyRef.current.style.top = '100px'
        stickyRef.current.style.zIndex = '5'

        for (const property in style) {
          // @ts-ignore
          stickyRef.current.style[property] = style[property]
        }
      } else {
        stickyRef.current.style.position = ''
        stickyRef.current.style.top = ''
        stickyRef.current.style.zIndex = ''
        for (const property in style) {
          // @ts-ignore
          stickyRef.current.style[property] = ''
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, inView, JSON.stringify(style)]
  )

  /**
   * Change the sticking behavior when the containing element scrolls in and out
   * of sight, and when the hook is enabled and disabled.
   */
  useMemo(() => {
    handleSticking()
  }, [inView, enabled])

  return {
    inView,
    observedRef,
    stickyRef,
  }
}

export { useSticky }
