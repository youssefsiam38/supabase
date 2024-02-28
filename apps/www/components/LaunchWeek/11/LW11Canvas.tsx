import React from 'react'
import anime from 'animejs'
import { isBrowser } from 'common'
import { Button, cn } from 'ui'
import { useInterval } from 'react-use'

const SEQUENCE = ['random', 'random', 'random', 'random', 'eleven']

const LW11Canvas = () => {
  // const [mounted, setMounted] = React.useState(false)
  const [sequenceIndex, setSequenceIndex] = React.useState<number>(0)
  const [comp, setComp] = React.useState<number[]>(figures.eleven)
  const [isTimerActive, setIsTimerActive] = React.useState(true)
  if (!isBrowser) return null
  const GRID_WIDTH = 40
  const GRID_HEIGHT = 20
  const grid = [GRID_WIDTH, GRID_HEIGHT]
  let SEQUENCE_DELAY = 3000

  // useInterval(
  //   () => {
  //     // setSequenceIndex((prev: number) => (prev === SEQUENCE.length - 1 ? 0 : ++prev))
  //     handleSequenceAnimation()
  //   },
  //   isTimerActive ? (sequenceIndex === 2 ? SEQUENCE_DELAY : 200) : null
  // )

  const gridArr = [...new Array(GRID_WIDTH * GRID_HEIGHT)]

  const Dots = () => (
    <>
      {gridArr.map((_, index) => {
        const isActive = comp.includes(index)

        return (
          <div
            className={cn(
              'relative group rounded-full h-full aspect-square transition-colors hover:bg-surface-100 flex items-center justify-center'
            )}
            onClick={() => handleDotClick(index)}
            key={`dot-${index}`}
          >
            <div
              className={cn(
                'dot-point opacity-50 h-px w-px rounded-xs bg-foreground group-hover:from-indigo-600 group-hover:to-white transition-all will-change-transform'
              )}
              data-index={index}
            />
            {/* <div className='absolute inset-0 w-px h-px rounded bg-foreground opacity-10' /> */}
          </div>
        )
      })}
    </>
  )

  const handleDotClick = (index: number) => {
    // setIsTimerActive(false)
    // if (comp.includes(index)) {
    //   const newArr = comp.filter((el) => el !== index)

    //   setComp(newArr)
    // } else {
    //   setComp((prevComp: any) => [...prevComp, index])
    // }

    anime({
      targets: '.dot-point',
      opacity: [
        { value: 1, easing: 'easeOutSine', duration: 200 },
        { value: 0.1, easing: 'easeInOutQuad', duration: 400 },
      ],
      complete: () => setIsTimerActive(true),
      delay: anime.stagger(20, {
        grid: [GRID_WIDTH, GRID_HEIGHT],
        from: index,
      }),
    })
  }

  const handleSequenceAnimation = () => {
    // setTimeout(
    //   () => {
    setSequenceIndex((prev: number) => {
      const newValue = prev === SEQUENCE.length - 1 ? 0 : ++prev
      const isEleven = newValue === 2
      setComp(isEleven ? figures.eleven : selectRandom(20))

      return newValue
    })

    //   },
    //   isEleven ? SEQUENCE_DELAY : 10
    // )
  }

  const tl = anime
    .timeline({
      targets: '.dot-point',
      // easing: 'easeInOutSine',
      // delay: anime.stagger(50),
      loop: true,
      autoplay: false,
    })
    .add({
      scale: [
        { value: 2, easing: 'easeOutSine', duration: 1500 },
        { value: 1, easing: 'easeInOutQuad', duration: 3000 },
      ],
      opacity: [
        { value: 1, easing: 'easeOutSine', duration: 1100 },
        { value: 0.1, easing: 'easeInOutQuad', duration: 3000 },
      ],
      delay: anime.stagger(100, { grid: grid, from: 'center' }),
    })
    .add({
      keyframes: [
        {
          opacity: 1,
          duration: 1800,
        },
        {
          translateX: 0,
          translateY: -10,
          scaleY: 4,
          scaleX: 1,
          opacity: 0.5,
          scale: 2,
        },
        {
          translateY: 0,
          opacity: 1,
          scaleY: 4,
          scaleX: 1,
          rotateZ: (_: any, i: number) => 1 + i,
          duration: 2000,
          delay: anime.stagger(10, { grid: grid, from: 'center' }),
        },
        {
          translateY: 0,
          opacity: (_: any, i: number) => anime.random(0, 1),
          scaleY: 1,
          scaleX: 1,
          duration: 1800,
          scale: 1,
          delay: anime.stagger(30, { grid: grid, from: 'center' }),
        },
      ],
      duration: 3000,
      easing: 'easeOutElastic(1, .8)',
      delay: anime.stagger(100, { grid: grid, from: 'center' }),
    })
    .add({
      opacity: [
        { value: 1, easing: 'easeOutSine', duration: 400 },
        { value: 0.1, easing: 'easeInOutQuad', duration: 20 },
      ],
      duration: 2000,
      delay: anime.stagger(20, { grid: grid, from: 'center' }),
    })
    .add({
      opacity: [
        { value: 1, easing: 'easeOutSine', duration: 150 },
        { value: 0.1, easing: 'easeInOutQuad', duration: 200 },
      ],
      duration: 1000,
      delay: anime.stagger(50, { grid: grid, from: 'center' }),
    })
    .add({
      scale: 1,
      translateX: 0,
      translateY: 0,
      opacity: 1,
      duration: 2000,
      rotate: anime.stagger(0, { grid: grid, from: 'center' }),
      delay: anime.stagger(10, { grid: grid, from: 'center' }),
    })
    .add({
      translateX: 0,
      translateY: 0,
      scaleY: 6,
      scaleX: 1,
      rotate: 180,
      duration: 2000,
      opacity: 1,
      delay: anime.stagger(50, { grid: grid, from: 'center' }),
    })
    .add({
      rotate: anime.stagger([90, 0], { grid: grid, from: 'center' }),
      duration: 3000,
      delay: anime.stagger(100, { grid: grid, from: 'center' }),
    })
    .add({
      scaleY: anime.stagger(1.5, { grid: grid, from: 'center' }),
      delay: anime.stagger(10, { grid: grid, from: 'center' }),
    })
    .add({
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      rotate: 180,
      duration: 2000,
      delay: anime.stagger(50, { grid: grid, from: 'center' }),
    })
    .add({
      translateX: anime.stagger('.25rem', { grid: grid, from: 'center', axis: 'x' }),
      translateY: anime.stagger('.25rem', { grid: grid, from: 'center', axis: 'y' }),
      rotate: 0,
      scaleX: 1,
      scaleY: 1.25,
      duration: 2000,
      delay: anime.stagger(1, { from: 'center' }),
    })
    .add({
      translateX: [
        { value: anime.stagger('-.1rem', { grid: grid, from: 'center', axis: 'x' }) },
        { value: anime.stagger('.1rem', { grid: grid, from: 'center', axis: 'x' }) },
      ],
      translateY: [
        { value: anime.stagger('-.1rem', { grid: grid, from: 'center', axis: 'y' }) },
        { value: anime.stagger('.1rem', { grid: grid, from: 'center', axis: 'y' }) },
      ],
      duration: 2000,
      scale: 1.5,
      delay: anime.stagger(10, { grid: grid, from: 'center' }),
    })
    .add({
      scale: 1,
      rotate: () => anime.random(-10, 180),
      delay: anime.stagger(10, { grid: grid, from: 'center' }),
    })
    .add({
      scale: 1,
      opacity: 1,
      translateX: 0,
      translateY: 0,
      rotate: 0,
      duration: 1000,
      delay: anime.stagger(10, { grid: grid, from: 'center' }),
    })
  // .add({
  //   translateX: [
  //     {value: anime.stagger('-.1rem', {grid: grid, from: 'center', axis: 'x'}) },
  //     {value: anime.stagger('.1rem', {grid: grid, from: 'center', axis: 'x'}) }
  //   ],
  //   translateY: [
  //     {value: anime.stagger('-.1rem', {grid: grid, from: 'center', axis: 'y'}) },
  //     {value: anime.stagger('.1rem', {grid: grid, from: 'center', axis: 'y'}) }
  //   ],
  //   duration: 400,
  //   scale: .5,
  //   delay: anime.stagger(20, {grid: grid, from: 'center'})
  // })
  // .add({
  //   translateX: () => anime.random(-10, 10),
  //   translateY: () => anime.random(-10, 10),
  //   delay: anime.stagger(1, {from: 'last'})
  // })
  // .add({
  //   translateX: anime.stagger('.25rem', {grid: grid, from: 'center', axis: 'x'}),
  //   translateY: anime.stagger('.25rem', {grid: grid, from: 'center', axis: 'y'}),
  //   rotate: 0,
  //   scaleX: 2.5,
  //   scaleY: .25,
  //   delay: anime.stagger(1, {from: 'center'})
  // })
  // .add({
  //   rotate: anime.stagger([90, 0], {grid: grid, from: 'center'}),
  //   delay: anime.stagger(10, {grid: grid, from: 'center'})
  // })
  // .add({
  //   translateX: 0,
  //   translateY: 0,
  //   scale: .5,
  //   scaleX: 1,
  //   rotate: 180,
  //   duration: 1000,
  //   delay: anime.stagger(50, {grid: grid, from: 'center'})
  // })
  // .add({
  //   scaleY: 1,
  //   scale: 1,
  //   delay: anime.stagger(20, {grid: grid, from: 'center'})
  // })

  React.useEffect(() => {
    // setMounted(true)

    // setTimeout(() => {
    tl.play()
    // }, 100)
  }, [])

  const selectRandom = (amount: number) => {
    let randomPicks = []
    for (let i = 0; i < amount; i++) {
      randomPicks.push(getRandomNumber(0, gridArr.length))
    }

    return randomPicks
  }

  function getRandomNumber(min: number, max: number) {
    var range = max - min
    var randomNumber = Math.random() * range + min

    return Math.round(randomNumber)
  }

  // if (!mounted) return null

  return (
    <div className="absolute flex items-center justify-center object-center -top-4 mx-auto w-screen h-screen overflow-hidden">
      <div className="absolute left-4 top-4 bg-overlay rounded border p-4">
        {/* <p>
          Current sequence: #{sequenceIndex} - {SEQUENCE[sequenceIndex]}
        </p> */}
        <div className="flex gap-2">
          <Button onClick={() => tl.play()}>Play</Button>
          <Button onClick={() => tl.pause()} type="default">
            Pause
          </Button>
          <Button onClick={() => tl.restart()} type="default">
            Restart
          </Button>
        </div>
      </div>
      <div
        style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)` }}
        className="grid-container object-center grid w-full h-full items-center justify-center"
      >
        <Dots />
      </div>
    </div>
  )
}

const figures = {
  eleven: [
    747, 807, 867, 927, 987, 1047, 1107, 746, 806, 866, 926, 986, 1046, 1106, 805, 864, 687, 1105,
    1104, 1108, 1109, 1110, 1111, 810, 751, 692, 811, 812, 752, 872, 932, 992, 1052, 1112, 1113,
    1114, 804, 745, 686, 693, 753, 813, 873, 933, 993, 1053, 870,
  ],
}

export default LW11Canvas
