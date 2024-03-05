import React, { use, useEffect, useState } from 'react'
import anime from 'animejs'
import { isBrowser } from 'common'
import { debounce } from 'lodash'
import DefaultLayout from '~/components/Layouts/Default'
import { Dot } from '~/components/LaunchWeek/11/Dot3'
import { Button } from 'ui'
import { useAnimationFrame } from 'framer-motion'

const defaultConfig = {
  dotGrid: 15,
  percentageLarge: 0.99,
  percentageAnimated: 0.75,
  randomizeLargeDots: 4,
  randomizeSmallDots: 0.7,
  minSpeed: 1,
  maxSpeed: 4,
  minOscillation: 1,
  maxOscillation: 12,
  minDelay: -3000,
  maxDelay: 15000,
  minDuration: 200,
  maxDuration: 10000,
}

const LW11 = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState({ w: 1200, h: 800 })
  const [config, setConfig] = useState(defaultConfig)
  const [showSettings, setShowSettings] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const DOT_AREA = config.dotGrid
  let GRID_COLS = Math.floor(canvasRef.current?.getBoundingClientRect().width! / DOT_AREA)
  let GRID_ROWS = Math.floor(canvasRef.current?.getBoundingClientRect().height! / DOT_AREA)
  const c = canvasRef.current?.getContext('2d')

  let dotsArray: any[] = []

  const mouse = { x: 0, y: 0 }

  const init = React.useCallback(() => {
    if (!c) return
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)
    dotsArray = []

    GRID_COLS = Math.floor(canvasRef.current?.getBoundingClientRect().width! / DOT_AREA)
    GRID_ROWS = Math.floor(canvasRef.current?.getBoundingClientRect().height! / DOT_AREA)

    for (let i = 0; i < GRID_COLS; i++) {
      for (let j = 0; j < GRID_ROWS; j++) {
        // const isLarge = Math.random() > config.percentageLarge
        // const isAnimated = isLarge || Math.random() > config.percentageAnimated
        // const opacity = isLarge ? 1 : anime.random(0, 1)
        // const isReverse = isAnimated ? Math.random() > 0.5 : undefined
        const isLarge = false
        const isAnimated = false
        const direction = isAnimated ? (Math.random() > 0.5 ? 'vertical' : 'horizontal') : undefined
        const speed = isAnimated ? anime.random(config.minSpeed, config.maxSpeed) : undefined
        const opacity = 1
        const isReverse = false
        const oscillation = isAnimated
          ? anime.random(config.minOscillation, config.maxOscillation).toFixed()
          : undefined
        const dotSize = isLarge
          ? Math.random() * config.randomizeLargeDots
          : Math.random() * config.randomizeSmallDots
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
        const delay = anime.random(config.minDelay, config.maxDelay)
        const duration = anime.random(config.minDuration, config.maxDuration)
        const animationConfig: any = isAnimated
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
        const id = i + '-' + j

        dotsArray.push(new Dot(id, x, y, w, h, opacity, animationConfig, mousePos))
      }
    }

    animate(0)
  }, [mousePos])

  const handleSetConfig = (name: string, value: any) => {
    setConfig((prevConfig: any) => ({ ...prevConfig, [name]: value }))
  }

  async function initGUI() {
    // if (!isSandbox) return
    const dat = await import('dat.gui')
    const gui = new dat.GUI()
    gui.width = 500

    gui
      .add(config, 'dotGrid')
      .name('Dot area (px)')
      .onChange((v) => handleSetConfig('dotGrid', v))
    gui
      .add(config, 'percentageLarge')
      .name('Large dots %')
      .onChange((v) => handleSetConfig('percentageLarge', v))
    gui
      .add(config, 'percentageAnimated')
      .name('Animatedd dots %')
      .onChange((v) => handleSetConfig('percentageAnimated', v))
    gui
      .add(config, 'randomizeLargeDots')
      .name('Large Dots size (px)')
      .onChange((v) => handleSetConfig('randomizeLargeDots', v))
    gui
      .add(config, 'randomizeSmallDots')
      .name('Small Dots size (px)')
      .onChange((v) => handleSetConfig('randomizeSmallDots', v))
    gui
      .add(config, 'minSpeed')
      .name('Min Speed')
      .onChange((v) => handleSetConfig('minSpeed', v))
    gui
      .add(config, 'maxSpeed')
      .name('Max Speed')
      .onChange((v) => handleSetConfig('maxSpeed', v))
    gui
      .add(config, 'minOscillation')
      .name('Min Oscillation (px)')
      .onChange((v) => handleSetConfig('minOscillation', v))
    gui
      .add(config, 'maxOscillation')
      .name('Max Oscillation (px)')
      .onChange((v) => handleSetConfig('maxOscillation', v))
    gui
      .add(config, 'minDelay')
      .name('Min Delay (ms)')
      .onChange((v) => handleSetConfig('minDelay', v))
    gui
      .add(config, 'maxDelay')
      .name('Max Delay (ms)')
      .onChange((v) => handleSetConfig('maxDelay', v))
    gui
      .add(config, 'minDuration')
      .name('Min Duration (ms)')
      .onChange((v) => handleSetConfig('minDuration', v))
    gui
      .add(config, 'maxDuration')
      .name('Max Duration (ms)')
      .onChange((v) => handleSetConfig('maxDuration', v))
  }

  useAnimationFrame((clock) => {
    animate(clock)
  })

  function animate(clock?: number) {
    if (!isBrowser) return

    c?.clearRect(0, 0, size.w, size.h)

    for (let i = 0; i < dotsArray.length; i++) {
      dotsArray[i].update(c, clock)
    }

    // const tl = anime
    //   .timeline({
    //     targets: dotsArray.filter((dot) => dot.anim),
    //     loop: true,
    //     direction: 'alternate',
    //     autoplay: true,
    //     update: renderParticule,
    //   })
    //   .add(
    //     {
    //       x: (p: any) =>
    //         !p.isVert ? `${p.anim?.isReverse ? '+' : '-'}=${DOT_AREA * p.anim.oscillation}` : p.x,
    //       y: (p: any) =>
    //         p.isVert ? `${p.anim?.isReverse ? '+' : '-'}=${DOT_AREA * p.anim.oscillation}` : p.y,
    //       duration: (p: any) => p.anim?.duration,
    //       delay: (p: any) => p.anim?.delay - 1000,
    //       easing: 'easeInOutExpo',
    //     },
    //     '-=1000'
    //   )

    // tl.play()
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

  function handleMouseMove(e: MouseEvent) {
    setMousePos({ x: e.x, y: e.y })
    mouse.x = e.x
    mouse.y = e.y

    // animate(0)
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    resize()
    init()
    // initGUI()

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  init()

  return (
    <DefaultLayout>
      {/* <Button
        type="default"
        className="absolute z-20 left-4 top-4"
        onClick={() => setShowSettings(!showSettings)}
      >
        {showSettings ? 'Hide' : 'Show'} settings
      </Button> */}
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
