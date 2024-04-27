'use client'

import { useSticky } from 'common'
import { Check, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react'
import { Badge, cn } from 'ui'

const MaturityModel = ({ className, children }: PropsWithChildren<{ className?: string }>) => (
  <div className={cn('@container', className)}>
    <div className="grid @lg:grid-cols-[auto_1fr] gap-x-20 gap-y-4">{children}</div>
  </div>
)

const MaturityLevel = ({
  name,
  recommendations,
  children,
}: PropsWithChildren<{
  name: string
  recommendations: Recommendation[]
}>) => {
  const [isDoubleCol, setIsDoubleCol] = useState(false)
  const { inView, observedRef, stickyRef } = useSticky<HTMLHeadingElement>({
    enabled: isDoubleCol,
    options: { rootMargin: '-10% 0% -50%' },
  })
  const measuredRef = useRef<HTMLElement>(null)

  const measure = useCallback(() => {
    const elem = measuredRef.current
    if (!elem) return

    const doubleCol = getComputedStyle(elem).getPropertyValue('--sentinel') === '1'
    setIsDoubleCol(doubleCol)
  }, [])

  const setSticky = (elem: HTMLElement | null) => {
    observedRef(elem)
    measuredRef.current = elem
    measure()
  }

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  return (
    <>
      <h3 className="self-start m-0" ref={stickyRef}>
        {name}
      </h3>
      <div ref={setSticky} className="@lg:[--sentinel:1] [&>p]:mt-2">
        <h4 className="sr-only">Summary of recommendations</h4>
        <ul className="not-prose flex flex-wrap gap-1">
          {recommendations.map((rec) => (
            <li key={rec.label}>
              <Recommendation {...rec} />
            </li>
          ))}
        </ul>
        {children}
      </div>
    </>
  )
}

interface Recommendation {
  label: string
  type: 'default' | 'good' | 'warning' | 'danger'
}

const Recommendation = ({ label, type }: Recommendation) => {
  const iconProps = useMemo(
    () => ({ width: 12, height: 12, className: 'mr-1', 'aria-hidden': true }),
    []
  )

  const icon = useMemo(
    () =>
      type === 'good' ? (
        <Check {...iconProps} />
      ) : type === 'warning' || type === 'danger' ? (
        <X {...iconProps} />
      ) : null,
    [type, iconProps]
  )

  const a11yLabel =
    type === 'good'
      ? 'Strongly recommended'
      : type === 'warning'
        ? 'Strongly discouraged'
        : type === 'danger'
          ? 'Should never use'
          : ''

  return (
    <Badge
      variant={
        type === 'good'
          ? 'success'
          : type === 'warning'
            ? 'warning'
            : type === 'danger'
              ? 'destructive'
              : 'default'
      }
    >
      {icon}
      <span className="sr-only">{a11yLabel}</span>
      {label}
    </Badge>
  )
}

MaturityModel.Level = MaturityLevel
export { MaturityModel }
