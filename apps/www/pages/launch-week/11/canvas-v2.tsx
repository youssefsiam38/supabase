import React, { useEffect, useState } from 'react'
import anime from 'animejs'
import { isBrowser } from 'common'
import { debounce } from 'lodash'
import DefaultLayout from '~/components/Layouts/Default'
import { Dot } from '~/components/LaunchWeek/11/Dot2'

const LW11 = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 1200, h: 800 })

  const DOT_AREA = 15
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
        const isAnimated = isLarge || Math.random() > 0.75
        const direction = isAnimated ? (Math.random() > 0.5 ? 'vertical' : 'horizontal') : undefined
        const speed = isAnimated ? anime.random(1, 4) : undefined
        const isReverse = isAnimated ? Math.random() > 0.5 : undefined
        const oscillation = isAnimated ? anime.random(1, 10).toFixed() : undefined
        const dotSize = isLarge ? Math.random() * 4 : Math.random() * 0.7
        const endPos = {
          x: anime
            .random(
              DOT_AREA * 1 - DOT_AREA / 2 + dotSize / 2,
              DOT_AREA * 10 - DOT_AREA / 2 + dotSize / 2
            )
            .toFixed(),
          y: anime
            .random(
              DOT_AREA * 1 - DOT_AREA / 2 + dotSize / 2,
              DOT_AREA * 10 - DOT_AREA / 2 + dotSize / 2
            )
            .toFixed(),
        }
        const delay = anime.random(0, 15000)
        const duration = anime.random(2000, 7000)
        const animationConfig = isAnimated
          ? {
              direction,
              speed,
              isReverse,
              oscillation,
              endPos,
              delay,
              duration,
            }
          : undefined
        const x =
          (canvasRef.current?.getBoundingClientRect().width! / GRID_COLS) * i +
          DOT_AREA / 2 -
          dotSize / 2
        const y =
          (canvasRef.current?.getBoundingClientRect().height! / GRID_ROWS) * j +
          DOT_AREA / 2 -
          dotSize / 2
        const w = dotSize
        const h = dotSize

        dotsArray.push(new Dot(x, y, w, h, animationConfig))
      }
    }

    animate(0)
  }

  function animate(clock?: number) {
    if (!isBrowser) return

    c?.clearRect(0, 0, size.w, size.h)

    for (let i = 0; i < dotsArray.length; i++) {
      dotsArray[i].update(c, clock)
    }

    const tl = anime
      .timeline({
        targets: dotsArray.filter((dot) => dot.anim),
        loop: true,
        direction: 'alternate',
        autoplay: true,
        update: renderParticule,
      })
      .add(
        {
          x: (p: any) =>
            !p.isVert ? `${p.anim?.isReverse ? '+' : '-'}=${DOT_AREA * p.anim.oscillation}` : p.x,
          y: (p: any) =>
            p.isVert ? `${p.anim?.isReverse ? '+' : '-'}=${DOT_AREA * p.anim.oscillation}` : p.y,
          duration: (p: any) => p.anim?.duration,
          delay: (p: any) => p.anim?.delay - 1000,
          easing: 'easeInOutExpo',
        },
        '-=1000'
      )

    tl.play()
  }

  function renderParticule(anim: any) {
    if (!isBrowser) return

    c?.clearRect(0, 0, size.w, size.h)
    for (let i = 0; i < dotsArray.length; i++) {
      dotsArray[i].update(c, 0)
    }
    for (var i = 0; i < anim.animatables.length; i++) {
      anim.animatables[i].target.update(c, 0)
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
