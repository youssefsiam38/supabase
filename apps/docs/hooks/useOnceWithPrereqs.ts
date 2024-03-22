import { useRef } from 'react'

const useOnceWithPrereqs = <Output>(onceFn: () => Output, deps: Array<unknown>) => {
  const alreadyRun = useRef(false)

  if (!alreadyRun.current && deps.every(Boolean)) {
    onceFn()
    alreadyRun.current = true
  }
}

export { useOnceWithPrereqs }
