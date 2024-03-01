import React, { useEffect, useState } from 'react'
import { isBrowser } from 'common'
import { debounce } from 'lodash'
import DefaultLayout from '~/components/Layouts/Default'
import { Dot } from '~/components/LaunchWeek/11/Dot'
import { useFrame } from '@react-three/fiber'
import { useAnimationFrame } from 'framer-motion'

const LW11 = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 1200, h: 800 })

  const DOT_AREA = 30
  const DOT_SIZE = 1
  let GRID_COLS = Math.floor(canvasRef.current?.getBoundingClientRect().width! / DOT_AREA)
  let GRID_ROWS = Math.floor(canvasRef.current?.getBoundingClientRect().height! / DOT_AREA)
  const c = canvasRef.current?.getContext('2d')

  let dotsArray: any[] = []

  function init() {
    c?.clearRect(0, 0, window.innerWidth, window.innerHeight)
    dotsArray = []

    GRID_COLS = Math.floor(canvasRef.current?.getBoundingClientRect().width! / DOT_AREA)
    GRID_ROWS = Math.floor(canvasRef.current?.getBoundingClientRect().height! / DOT_AREA)

    for (let i = 0; i < GRID_COLS; i++) {
      for (let j = 0; j < GRID_ROWS; j++) {
        // if (!canvasRef.current) return
        // const dotSize = Math.random() > 0.98 ? 2 : DOT_SIZE
        const dotSize = Math.random() > 0.98 ? 2.5 : Math.random() * DOT_SIZE * 1.5
        const x = (canvasRef.current?.getBoundingClientRect().width! / GRID_COLS) * i
        const y = (canvasRef.current?.getBoundingClientRect().height! / GRID_ROWS) * j
        const w = dotSize
        const h = dotSize
        dotsArray.push(new Dot(x, y, w, h))
      }
    }

    // animate()
  }

  useAnimationFrame((clock) => {
    animate && animate(clock)
  })

  function animate(clock: number) {
    if (!isBrowser) return

    // window.requestAnimationFrame(animate)
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

  init()

  return (
    <DefaultLayout>
      <canvas ref={canvasRef} className="w-full h-full" width={size.w} height={size.h} />
    </DefaultLayout>
  )
}

export default LW11
