'use client'

import { IconPanel } from 'ui'
import { useBreakpoint } from 'common'

export function FrameworkPanel({ framework }) {
  const isXs = useBreakpoint(639)
  const iconSize = isXs ? 'sm' : 'lg'

  return (
    <IconPanel iconSize={iconSize} hideArrow tooltip={framework.tooltip} icon={framework.icon} />
  )
}
