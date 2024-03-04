import React, { useEffect, useState } from 'react'
import { useAnimationFrame } from 'framer-motion'
import { isBrowser } from 'common'
import { debounce } from 'lodash'
import DefaultLayout from '~/components/Layouts/Default'
import { Dot } from '~/components/LaunchWeek/11/Dot'

const LW11 = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 1200, h: 800 })

  const DOT_AREA = 30
  let GRID_COLS = Math.floor(canvasRef.current?.getBoundingClientRect().width! / DOT_AREA)
  let GRID_ROWS = Math.floor(canvasRef.current?.getBoundingClientRect().height! / DOT_AREA)
  const c = canvasRef.current?.getContext('2d')

  let dotsArray: any[] = []

  function init() {
    if (!c) return
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
    dotsArray = []

    GRID_COLS = Math.floor(canvasRef.current?.getBoundingClientRect().width! / DOT_AREA)
    GRID_ROWS = Math.floor(canvasRef.current?.getBoundingClientRect().height! / DOT_AREA)

    for (let i = 0; i < GRID_COLS; i++) {
      for (let j = 0; j < GRID_ROWS; j++) {
        const isLarge = Math.random() > 0.99
        const isAnimated = isLarge || Math.random() > 0.8
        const direction = isAnimated ? (Math.random() > 0.5 ? 'vertical' : 'horizontal') : undefined
        const speed = isAnimated ? Math.floor(Math.random() * 4) : undefined
        const isReverse = isAnimated ? Math.random() > 0.5 : undefined
        const oscillation = isAnimated ? Math.random() : undefined
        const animationConfig = isAnimated
          ? {
              direction,
              speed,
              isReverse,
              oscillation,
            }
          : undefined
        const dotSize = isLarge ? Math.random() * 3 : Math.random() * 0.6
        const x = (canvasRef.current?.getBoundingClientRect().width! / GRID_COLS) * i
        const y = (canvasRef.current?.getBoundingClientRect().height! / GRID_ROWS) * j
        const w = dotSize
        const h = dotSize

        dotsArray.push(new Dot(x, y, w, h, animationConfig))
      }
    }
  }

  useAnimationFrame((clock) => {
    animate && animate(clock)
  })

  function animate(clock: number) {
    if (!isBrowser) return

    c?.clearRect(0, 0, size.w, size.h)

    for (let i = 0; i < dotsArray.length; i++) {
      dotsArray[i].update(c, clock)
    }
  }

  function resize() {
    setSize({ w: window.innerWidth, h: window.innerHeight })
    init()
  }

  useEffect(() => {
    if (!isBrowser) return
    const handleDebouncedResize = debounce(() => resize(), 10)
    window.addEventListener('resize', handleDebouncedResize)

    return () => window.removeEventListener('resize', handleDebouncedResize)
  }, [])

  useEffect(() => {
    resize()
    init()
  }, [])

  init()

  return (
    <DefaultLayout>
      <canvas
        ref={canvasRef}
        className="opacity-0 animate-fade-in duration-1000 w-full h-full"
        width={size.w}
        height={size.h}
      />
    </DefaultLayout>
  )
}

export default LW11
