import { useRef } from 'react'

const useOnceWithDependencies = <Output>(onceFn: () => Output, deps: Array<unknown>) => {
  const run = useRef(false)

  if (!run.current && deps.every(Boolean)) {
    onceFn()
    run.current = true
  }

  return run.current
}

export { useOnceWithDependencies }
