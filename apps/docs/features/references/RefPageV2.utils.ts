type RecObj<RecKey extends string | number | symbol, T extends object> = T & {
  [key in RecKey]?: RecObj<RecKey, T>[]
}

const flattenOnKey = <RecKey extends string | number | symbol, Elem extends object>(
  recKey: RecKey,
  arr: RecObj<RecKey, Elem>[]
): Elem[] =>
  arr.reduce((acc, elem) => {
    acc.push(elem)
    if (recKey in elem) acc.push(...flattenOnKey(recKey, elem[recKey]))
    return acc
  }, [])

export { flattenOnKey }
export type { RecObj }
