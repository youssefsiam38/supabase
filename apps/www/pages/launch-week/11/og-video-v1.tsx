import React, { useEffect, useState } from 'react'
import anime from 'animejs'
import { debounce } from 'lodash'
import { isBrowser } from 'common'
import { Button } from 'ui'
import supabase from '~/lib/supabaseMisc'
import DefaultLayout from '~/components/Layouts/Default'
import { NextSeo } from 'next-seo'
// import { Dot } from '~/components/LaunchWeek/11/Dot2'

const CANVAS_CONFIG = {
  w: 1200,
  h: 630,
}

const defaultConfig = {
  dotGrid: 25,
  percentageLarge: 0.99,
  percentageAnimated: 0.75,
  randomizeLargeDots: 5,
  randomizeSmallDots: 1.5,
  minSpeed: 1,
  maxSpeed: 4,
  minOscillation: 1,
  maxOscillation: 12,
  minDelay: -3000,
  maxDelay: 15000,
  minDuration: 200,
  maxDuration: 10000,
}

const ticketConfig = {
  id: 1,
  ticketNumber: '0000004',
  name: 'Franjesco Sansalvadore',
  username: 'fsansalvadore',
}

const LW11 = () => {
  const OG_VIDEO_DURATION = 6
  const STORAGE_BUCKET = 'images'
  const STORAGE_PATH = 'lw11-ga/videos/test/og-test-v13'

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const canvasSnapRef = React.useRef<HTMLImageElement>(null)
  const [size, setSize] = useState({ w: CANVAS_CONFIG.w, h: CANVAS_CONFIG.h })
  const [uploadState, setUploadState] = useState('initial')
  const [ogImagePath, setOgImagePath] = useState(
    `${process.env.NEXT_PUBLIC_MISC_USE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_PATH}.png`
  )
  const [ogVideoPath, setOgVideoPath] = useState(
    `${process.env.NEXT_PUBLIC_MISC_USE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_PATH}.mp4`
  )
  const [config, setConfig] = useState(defaultConfig)

  const DOT_AREA = config.dotGrid
  let GRID_COLS = Math.floor(canvasRef.current?.getBoundingClientRect().width! / DOT_AREA)
  let GRID_ROWS = Math.floor(canvasRef.current?.getBoundingClientRect().height! / DOT_AREA)
  const canvas = canvasRef.current
  const c = canvas?.getContext('2d')
  // let c: any
  let dotsArray: any[] = []
  let imageGA: HTMLImageElement
  let innerTicketImage: HTMLImageElement

  function init() {
    // if (!isBrowser) return
    // const canvas = document.getElementById('lw-canvas')
    // // @ts-ignore
    // c = canvas.getContext('2d')
    if (!c || !canvas) return
    imageGA = new Image(40)
    imageGA.src = '/images/launchweek/11-ga/ga-v2.svg'

    innerTicketImage = new Image(CANVAS_CONFIG.h)
    innerTicketImage.src = '/images/launchweek/11-ga/lwga-ticket-2.png'
    c.globalCompositeOperation = 'destination-over'
    c.clearRect(0, 0, window.innerWidth, window.innerHeight)

    // Generate grid
    dotsArray = []

    GRID_COLS = Math.floor(canvasRef.current?.getBoundingClientRect().width! / DOT_AREA)
    GRID_ROWS = Math.floor(canvasRef.current?.getBoundingClientRect().height! / DOT_AREA)

    for (let i = 0; i < GRID_COLS; i++) {
      for (let j = 0; j < GRID_ROWS; j++) {
        const isLarge = Math.random() > config.percentageLarge
        const isGreen = isLarge ? Math.random() > 0.5 : false
        const isAnimated = isLarge || Math.random() > config.percentageAnimated
        const direction = isAnimated ? (Math.random() > 0.5 ? 'vertical' : 'horizontal') : undefined
        const speed = isAnimated ? anime.random(config.minSpeed, config.maxSpeed) : undefined
        const opacity = isLarge ? 1 : anime.random(0.4, 1)
        const isReverse = isAnimated ? Math.random() > 0.5 : undefined
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

        // @ts-ignore
        dotsArray.push(new Dot(id, x, y, w, h, isGreen, opacity, animationConfig))
      }
    }

    animate()
    // drawOgContent()

    console.log('canvas', c, c.canvas, c.getImageData(0, 0, 100, 100))
  }

  const handleSetConfig = (name: string, value: any) => {
    setConfig((prevConfig: any) => ({ ...prevConfig, [name]: value }))
  }

  const GA_LOGO_CONFIG = {
    x: DOT_AREA * 2 - 2,
    y: DOT_AREA * 3,
    fillStyle: '#ffffff',
  }
  const INNER_TICKET_CONFIG = {
    x: 500,
    y: 50,
  }
  const OG_TEXT_CONFIG = {
    x: DOT_AREA * 2,
    y: DOT_AREA * 11,
    fillStyle: '#cdcdcd',
  }
  const USER_TICKET_CONTENT_CONFIG = {
    x: 540,
    y: 260,
    fillStyle: '#ffffff',
  }

  const drawOgContent = () => {
    if (!c) return
    // const base_image = new Image(40)
    // base_image.src = '/images/launchweek/11-ga/ga-v1.svg'
    // base_image.onload = function () {
    c.drawImage(imageGA, GA_LOGO_CONFIG.x, GA_LOGO_CONFIG.y)
    c.font = '32px IBM Plex Mono'
    // @ts-ignore
    c.letterSpacing = '16px'
    c.fillStyle = OG_TEXT_CONFIG.fillStyle
    c.fillText('APRIL 11', OG_TEXT_CONFIG.x, OG_TEXT_CONFIG.y)
    c.fillText('10AM PT', OG_TEXT_CONFIG.x, OG_TEXT_CONFIG.y + 40)
    c.font = '16px IBM Plex Mono'
    c.fillStyle = '#444444'
    c.fillText(
      `N.${ticketConfig.ticketNumber}`,
      USER_TICKET_CONTENT_CONFIG.x,
      USER_TICKET_CONTENT_CONFIG.y
    )
    c.font = '42px IBM Plex Mono'
    c.fillStyle = OG_TEXT_CONFIG.fillStyle
    // @ts-ignore
    c.letterSpacing = '0px'
    ticketConfig.name
      .split(' ')
      .map((text, i) =>
        c.fillText(text, USER_TICKET_CONTENT_CONFIG.x, USER_TICKET_CONTENT_CONFIG.y + 80 + i * 48)
      )
    c.drawImage(innerTicketImage, INNER_TICKET_CONFIG.x, INNER_TICKET_CONFIG.y)

    anime
      .timeline({
        loop: false,
        autoplay: true,
        direction: 'normal',
      })
      // .add(
      //   {
      //     targets: GA_LOGO_CONFIG,
      //     y: (v: any) => [v.y - 500, v.y],
      //     duration: 1000,
      //     delay: 0,
      //     easing: 'easeInOutExpo',
      //   },
      //   0
      // )
      .add(
        {
          targets: INNER_TICKET_CONFIG,
          y: (v: any) => [v.y + CANVAS_CONFIG.h, v.y],
          duration: 1000,
          delay: 0,
          easing: 'easeInOutExpo',
        },
        0
      )
      .add(
        {
          targets: USER_TICKET_CONTENT_CONFIG,
          y: (v: any) => [v.y + CANVAS_CONFIG.h, v.y],
          duration: 1000,
          delay: 0,
          easing: 'easeInOutExpo',
        },
        0
      )
      // .add({
      //   targets: GA_LOGO_CONFIG,
      //   x: (v: any) => v.x,
      //   y: (v: any) => v.y,
      //   duration: 10000,
      //   delay: 0,
      //   loop: false,
      //   easing: 'linear',
      // })
      // .add(
      //   {
      //     targets: OG_TEXT_CONFIG,
      //     x: (v: any) => [v.x - 300, v.x],
      //     duration: 1000,
      //     delay: 0,
      //     loop: false,
      //     easing: 'easeInOutExpo',
      //   },
      //   0
      // )
      // .add(
      //   {
      //     targets: OG_TEXT_CONFIG,
      //     x: (v: any) => v.x,
      //     y: (v: any) => v.y,
      //     duration: 10000,
      //     delay: 0,
      //     loop: false,
      //     easing: 'linear',
      //   },
      //   1000
      // )
      .add(
        {
          targets: INNER_TICKET_CONFIG,
          x: (v: any) => v.x,
          y: (v: any) => v.y,
          duration: 30000,
          delay: 0,
          loop: false,
          easing: 'linear',
        },
        1000
      )
      .add(
        {
          targets: USER_TICKET_CONTENT_CONFIG,
          x: (v: any) => v.x,
          y: (v: any) => v.y,
          duration: 30000,
          delay: 0,
          loop: false,
          easing: 'linear',
        },
        1000
      )
  }

  // async function initGUI() {
  //   // if (!isSandbox) return
  //   const dat = await import('dat.gui')
  //   const gui = new dat.GUI()
  //   gui.width = 200

  //   gui
  //     .add(config, 'dotGrid')
  //     .name('Dot area (px)')
  //     .onChange((v) => handleSetConfig('dotGrid', v))
  //   gui
  //     .add(config, 'percentageLarge')
  //     .name('Large dots %')
  //     .onChange((v) => handleSetConfig('percentageLarge', v))
  //   gui
  //     .add(config, 'percentageAnimated')
  //     .name('Animatedd dots %')
  //     .onChange((v) => handleSetConfig('percentageAnimated', v))
  //   gui
  //     .add(config, 'randomizeLargeDots')
  //     .name('Large Dots size (px)')
  //     .onChange((v) => handleSetConfig('randomizeLargeDots', v))
  //   gui
  //     .add(config, 'randomizeSmallDots')
  //     .name('Small Dots size (px)')
  //     .onChange((v) => handleSetConfig('randomizeSmallDots', v))
  //   gui
  //     .add(config, 'minSpeed')
  //     .name('Min Speed')
  //     .onChange((v) => handleSetConfig('minSpeed', v))
  //   gui
  //     .add(config, 'maxSpeed')
  //     .name('Max Speed')
  //     .onChange((v) => handleSetConfig('maxSpeed', v))
  //   gui
  //     .add(config, 'minOscillation')
  //     .name('Min Oscillation (px)')
  //     .onChange((v) => handleSetConfig('minOscillation', v))
  //   gui
  //     .add(config, 'maxOscillation')
  //     .name('Max Oscillation (px)')
  //     .onChange((v) => handleSetConfig('maxOscillation', v))
  //   gui
  //     .add(config, 'minDelay')
  //     .name('Min Delay (ms)')
  //     .onChange((v) => handleSetConfig('minDelay', v))
  //   gui
  //     .add(config, 'maxDelay')
  //     .name('Max Delay (ms)')
  //     .onChange((v) => handleSetConfig('maxDelay', v))
  //   gui
  //     .add(config, 'minDuration')
  //     .name('Min Duration (ms)')
  //     .onChange((v) => handleSetConfig('minDuration', v))
  //   gui
  //     .add(config, 'maxDuration')
  //     .name('Max Duration (ms)')
  //     .onChange((v) => handleSetConfig('maxDuration', v))
  // }

  function animate() {
    if (!isBrowser) return

    for (let i = 0; i < dotsArray.length; i++) {
      dotsArray[i].update(c)
    }

    drawOgContent()

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
    if (!isBrowser || !c) return

    c.clearRect(0, 0, size.w, size.h)
    drawOgContent()
    for (let i = 0; i < dotsArray.length; i++) {
      dotsArray[i].update(c, 0)
    }
    for (var i = 0; i < anim.animatables.length; i++) {
      anim.animatables[i].target.update(c, 0)
    }
    c.fillStyle = '#0F0F0F'
    c.fillRect(0, 0, CANVAS_CONFIG.w, CANVAS_CONFIG.h)
  }

  function resize() {
    setSize({ w: CANVAS_CONFIG.w, h: CANVAS_CONFIG.h })
    init()
  }

  function Dot(
    id: string,
    x: number,
    y: number,
    w: number,
    h: number,
    isGreen: boolean,
    opacity: number,
    animationConfig: any
  ) {
    // @ts-ignore
    this.id = id
    // @ts-ignore
    this.x = x
    // @ts-ignore
    this.y = y
    // @ts-ignore
    this.w = w
    // @ts-ignore
    this.h = h
    // @ts-ignore
    this.isGreen = isGreen
    // @ts-ignore
    this.opacity = opacity
    // @ts-ignore
    this.anim = animationConfig
    // @ts-ignore
    this.isVert = this.anim?.direction === 'vertical'
    // this.endPos = { x: this.anim?.speed * 10 ?? 0, y: this.anim?.speed * 10 ?? 0 }

    // @ts-ignore
    this.draw = function (c) {
      c.fillStyle = this.isGreen ? `#3ECF8E` : `rgba(255,255,255,${this.opacity})`
      c.fillRect(this.x, this.y, this.w, this.h)
      c.fill()
    }

    // @ts-ignore
    this.update = function (c) {
      this.draw(c)
    }
  }

  const uploadHandler = async (video: Blob) => {
    setUploadState('uploading')
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(STORAGE_PATH + '.mp4', video, {
        // cacheControl: '3600',
        contentType: 'video/mp4',
        upsert: true,
      })

    if (data) {
      setUploadState(`success: ${data.path}`)
      setOgVideoPath(
        `${process.env.NEXT_PUBLIC_MISC_USE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${STORAGE_PATH}`
      )
    }
    error && setUploadState(`error: ${error.message}`)
    console.log('upload video', data, error)
  }
  const uploadImage = async (blob: Blob | string) => {
    const { data: imageData, error: imageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(STORAGE_PATH + '.png', blob!, {
        // cacheControl: '3600',
        contentType: 'image/png',
        upsert: true,
      })

    console.log(imageData, imageError)

    if (imageData) {
      console.log('uploaded image', imageData)
      setOgImagePath(imageData.path)
    }
    imageError && console.log(`error: ${imageError.message}`)
  }

  const record = () => {
    if (!c || !canvas || !canvasSnapRef) return
    console.log('start recording', c)
    setUploadState('recording')
    const chunks: any = []
    const stream = canvas.captureStream() // grab our canvas MediaStream
    const rec = new MediaRecorder(stream) // init the recorder

    rec.ondataavailable = (e) => chunks.push(e.data)
    rec.onstop = () => {
      canvas.toBlob(
        (b) => {
          uploadImage(b!)
        },
        'image/png',
        1
      )

      uploadHandler(new Blob(chunks, { type: 'video/mp4' }))
    }

    rec.start()
    setTimeout(() => rec.stop(), OG_VIDEO_DURATION * 1000)
  }

  useEffect(() => {
    if (!isBrowser) return
    const handleDebouncedResize = debounce(() => resize(), 10)
    window.addEventListener('resize', handleDebouncedResize)

    return () => window.removeEventListener('resize', handleDebouncedResize)
  }, [])

  useEffect(() => {
    setTimeout(() => {
      resize()
      init()
    }, 100)
    // initGUI()
  }, [])

  init()

  return (
    <>
      <NextSeo
        title={'Supabase GA week'}
        description={'Supabase GA week'}
        openGraph={{
          title: 'Supabase GA week',
          description: 'Supabase GA week',
          url: 'https://supabase.com/launch-week',
          images: [
            {
              url: ogImagePath,
              width: CANVAS_CONFIG.w,
              height: CANVAS_CONFIG.h,
              alt: 'Supabase GA week',
              type: 'image/png',
            },
          ],
          videos: [
            {
              url: ogVideoPath,
              secureUrl: ogVideoPath,
              width: CANVAS_CONFIG.w,
              height: CANVAS_CONFIG.h,
              alt: 'Supabase GA week',
              type: 'video/mp4',
            },
          ],
        }}
      />
      <DefaultLayout>
        <div className="absolute z-20 left-4 top-4 bg-alternative border rounded-lg p-4 shadow flex flex-col gap-2">
          <Button onClick={record}>Start recording</Button>
          <p className="text-sm text-foreground-light">
            {uploadState === 'initial'
              ? '-'
              : uploadState === 'recording'
                ? 'recording...'
                : uploadState === 'uploading'
                  ? 'uploading'
                  : uploadState}
          </p>
        </div>
        <div className="relative py-10 gap-4 items-center justify-center w-full h-full overflow-hidden flex flex-col">
          <canvas
            ref={canvasRef}
            id="lw-canvas"
            className="opacity-0 animate-fade-in duration-1000 w-[1200px] h-[600px] border"
            width={size.w}
            height={size.h}
          />
        </div>
      </DefaultLayout>
    </>
  )
}

export default LW11
