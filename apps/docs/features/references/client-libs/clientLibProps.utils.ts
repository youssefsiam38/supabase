import { stat } from 'fs/promises'
import { type RecObj } from '../RefPageV2.utils'

const filterRec = <RecKey extends string | number | symbol, Elem extends object>(
  filter: (elem: Elem) => boolean,
  recKey: RecKey,
  arr: RecObj<RecKey, Elem>[]
): Elem[] =>
  arr.reduce(
    (acc, elem) => (
      filter(elem) &&
        (recKey in elem
          ? acc.push({ ...elem, [recKey]: filterRec(filter, recKey, elem[recKey]) })
          : acc.push(elem)),
      acc
    ),
    []
  )

const mutateRecAsync = async <RecKey extends string | number | symbol, Elem extends object>(
  mutate: (elem: Elem) => void | Promise<void>,
  recKey: RecKey,
  arr: RecObj<RecKey, Elem>[]
) =>
  Promise.all(
    arr.map(async (elem) => {
      await mutate(elem)
      if (recKey in elem) await mutateRecAsync(mutate, recKey, elem[recKey])
    })
  ).then(() => {})

const fileExistsAsync = async (absPath: string) =>
  stat(absPath)
    .then(() => true)
    .catch(() => false)

export { filterRec, mutateRecAsync, fileExistsAsync }
