import React from 'react'
import anime from 'animejs'
import { isBrowser } from 'common'
import { cn } from 'ui'
import { useInterval } from 'react-use'
import DefaultLayout from '~/components/Layouts/Default'
import SectionContainer from '~/components/Layouts/SectionContainer'

const SEQUENCE = ['random', 'random', 'random', 'random', 'eleven']

const LW11Canvas = () => {
  const [sequenceIndex, setSequenceIndex] = React.useState<number>(0)
  const [comp, setComp] = React.useState<number[]>(figures.eleven)
  const [isTimerActive, setIsTimerActive] = React.useState(true)
  if (!isBrowser) return null
  const GRID_WIDTH = 60
  const GRID_HEIGHT = 40
  let SEQUENCE_DELAY = 3000

  useInterval(
    () => {
      // setSequenceIndex((prev: number) => (prev === SEQUENCE.length - 1 ? 0 : ++prev))
      handleSequenceAnimation()
    },
    isTimerActive ? (sequenceIndex === 2 ? SEQUENCE_DELAY : 200) : null
  )

  const gridArr = [...new Array(GRID_WIDTH * GRID_HEIGHT)]

  const Dots = () => (
    <>
      {gridArr.map((_, index) => {
        const isActive = comp.includes(index)

        return (
          <div
            className={cn(
              'group rounded-full h-4 w-4 transition-colors hover:bg-surface-100 flex items-center justify-center'
            )}
            onClick={() => handleDotClick(index)}
            key={`dot-${index}`}
          >
            <div
              className={cn(
                'dot-point opacity-10 h-px w-px rounded-[2px] bg-foreground group-hover:from-indigo-600 group-hover:to-white transition-all will-change-transform',
                // isActive && 'isActive'
                isActive && 'isActive'
              )}
              data-index={index}
            />
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
      scale: [
        { value: 2, easing: 'easeOutSine', duration: 200 },
        { value: 1, easing: 'easeInOutQuad', duration: 400 },
      ],
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

  React.useEffect(() => {
    const isEleven = sequenceIndex === 2
    anime({
      targets: '.isActive',
      scale: [
        { value: 5, easing: 'easeOutSine', duration: isEleven ? 100 : 10 },
        // { value: 1, easing: 'easeInOutQuad', duration: 400 },
      ],
      opacity: [
        { value: 1, easing: 'easeOutSine', duration: isEleven ? 100 : 10 },
        // { value: 0.1, easing: 'easeInOutQuad', duration: 400 },
      ],
      // complete: handleSequenceAnimation,
    })
  }, [sequenceIndex])

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

  return (
    <DefaultLayout className="overflow-none">
      <SectionContainer>
        <div className="mx-auto relative w-full"></div>
      </SectionContainer>
      <div className="absolute flex items-center justify-center object-center -top-4 mx-auto w-screen h-screen overflow-hidden">
        {/* <div className="absolute left-4 top-4 bg-overlay rounded border p-4">
        <p>
          Current sequence: #{sequenceIndex} - {SEQUENCE[sequenceIndex]}
        </p>
      </div> */}
        <div
          style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)` }}
          className="grid-container object-center grid w-full h-full items-center justify-center"
        >
          <Dots />
        </div>
      </div>
    </DefaultLayout>
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
