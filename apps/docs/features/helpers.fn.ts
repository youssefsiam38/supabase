import type { OrPromise, RecObj } from '~/features/helpers.types'

const filterRec = <RecKey extends string | number | symbol, Elem extends object>(
  filter: (elem: Elem) => OrPromise<boolean>,
  recKey: RecKey,
  arr: readonly RecObj<RecKey, Elem>[],
  filterChildrenFirst: boolean = false
): Elem[] =>
  arr.reduce((acc, elem) => {
    if (filterChildrenFirst) {
      const parent = !!elem[recKey]
        ? { ...elem, [recKey]: filterRec(filter, recKey, elem[recKey]!) }
        : elem
      filter(parent) && acc.push(parent)
    } else if (filter(elem)) {
      acc.push(
        !!elem[recKey] ? { ...elem, [recKey]: filterRec(filter, recKey, elem[recKey]!) } : elem
      )
    }
    return acc
  }, [] as Elem[])

const mapRec = async <
  RecKey extends string | number | symbol,
  Elem extends object,
  Output extends object,
>(
  map: (elem: Elem) => OrPromise<Output>,
  recKey: RecKey,
  arr: readonly RecObj<RecKey, Elem>[]
): Promise<Output[]> =>
  Promise.all(
    arr.map(async (elem) =>
      !!elem[recKey]
        ? { ...(await map(elem)), [recKey]: await mapRec(map, recKey, elem[recKey]!) }
        : await map(elem)
    )
  )

export { filterRec, mapRec }
