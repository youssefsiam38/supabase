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

const mapRecAsync = async <O extends object | Promise<object>>(
  map: (elem: object) => O,
  recKey: string,
  arr: object[]
) =>
  Promise.all(
    arr.map(async (elem) => {
      const changed = await map(elem)
      if (recKey in changed) changed[recKey] = await mapRecAsync(map, recKey, changed[recKey])
      return changed
    })
  )

const fileExistsAsync = async (absPath: string) =>
  stat(absPath)
    .then(() => true)
    .catch(() => false)

/**
 * Substitutions: METHOD_NAME, NAMESPACE.*, OTHER.*
 */
const replaceSubstitutions = (
  str: string,
  spec: any,
  config: any,
  library: string,
  version: string
) =>
  str.replace(/<SUBSTITUTION\.([_.A-Z0-9]+)>/g, (_, capture) => {
    if (capture === 'METHOD_NAME') return spec.method_name ?? ''

    let match: RegExpExecArray | null

    if ((match = capture.match(/^NAMESPACE\.(AUTH|FUNCTIONS|STORAGE)$/))) {
      switch (match[1]) {
        case 'AUTH':
          return version
            ? config[library][version].namespaces.auth
            : config[library].namespaces.auth
        case 'FUNCTIONS':
          return version
            ? config[library][version].namespaces.functions
            : config[library].namespaces.functions
        case 'STORAGE':
          return version
            ? config[library][version].namespaces.functions
            : config[library].namespaces.functions
        default:
          return ''
      }
    }

    if ((match = capture.match(/^OTHER\.([_A-Z0-9]+)$/))) {
      return spec.substitutions.other[match[1].toLowerCase()]
    }

    return ''
  })

export { filterRec, mapRecAsync, fileExistsAsync, replaceSubstitutions }
