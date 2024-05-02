import matter from 'gray-matter'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { NavMenuSection } from '~/components/Navigation/Navigation.types'
import type {
  ICommonFunction,
  ICommonItem,
  ICommonMarkdown,
  ICommonSection,
  TypeSpec,
} from '~/components/reference/Reference.types'
import { filterRec, mapRec } from '~/features/helpers.fn'
import { ROOT_DIR, existsFile } from '~/features/helpers.fs'
import type { RecObj } from '~/features/helpers.types'
import clientLibsCommonSectionsUntyped from '~/spec/common-client-libs-sections.json' assert { type: 'json' }
import type { Json } from '~/types'

const clientLibsCommonSections = clientLibsCommonSectionsUntyped as readonly ICommonItem[]

interface Specs {
  spec?: Json
  typeSpec?: TypeSpec
}

interface AnnotatedMarkdown extends ICommonMarkdown {
  [IS_ANNOTATED]: true
  meta: { [key: string]: any }
  mdx: string
}

interface AnnotatedFunction extends ICommonFunction {
  [IS_ANNOTATED]: true
  details: { [key: string]: Json } & { id: string }
}

type IAnnotatedCommon = AnnotatedFunction | AnnotatedMarkdown

type HalfAnnotated = ICommonItem | IAnnotatedCommon

const getRefDataForLib = async (
  libPath: string,
  alts?: { excludeLabel?: string },
  specs?: Specs
) => {
  const includedSections = alts?.excludeLabel
    ? filterRec(isNotExcluded(alts.excludeLabel), 'items', clientLibsCommonSections)
    : clientLibsCommonSections

  const annotatedSections = (await mapRec(
    annotateSection(libPath, specs),
    'items',
    includedSections
  )) as HalfAnnotated[]
  const flattenedSections = flatten<HalfAnnotated, 'items'>(
    annotatedSections as RecObj<'items', HalfAnnotated>[],
    'items'
  ).filter(isAnnotatedFunctionOrMarkdown)

  const navDataUnfiltered = await mapRec(convertToNavItem(libPath), 'items', includedSections)
  const navData = filterRec(
    (navItem) =>
      ('items' in navItem && !!navItem.items?.length) ||
      ('id' in navItem && flattenedSections.some((section) => section.id === navItem.id)),
    'items',
    navDataUnfiltered,
    true
  )

  return { navData, flattenedSections }
}

const isNotExcluded = (excludeLabel: string) => (item: ICommonItem) =>
  !(!!item.excludes && item.excludes.includes(excludeLabel))

const convertToNavItem = (libPath: string) => (item: ICommonItem) =>
  ({
    ...('id' in item ? { id: item.id } : null),
    name: item.title,
    url: isMarkdown(item) || isFunction(item) ? `/reference/${libPath}/${item.slug}` : undefined,
  }) as Partial<NavMenuSection> & { id?: string }

const IS_ANNOTATED = Symbol('item is annotated')

const annotateSection =
  (libPath: string, specs: Specs | undefined) => async (item: ICommonItem) => {
    switch (true) {
      case isMarkdown(item):
        return await annotateMarkdown(libPath, item)
      case isFunction(item):
        return annotateFunction(libPath, specs, item)
      default:
        return { ...item, [IS_ANNOTATED]: false }
    }
  }

const isMarkdown = (item: ICommonItem): item is ICommonMarkdown => item.type === 'markdown'

const isAnnotatedMarkdown = (item: HalfAnnotated): item is AnnotatedMarkdown =>
  item.type === 'markdown' && item[IS_ANNOTATED]

const annotateMarkdown = async (libPath: string, item: ICommonMarkdown) => {
  const markdownDir = join(ROOT_DIR, 'docs', 'ref', libPath)
  const filePath = join(markdownDir, `${item.slug}.mdx`)

  if (!(await existsFile(filePath))) return { ...item, [IS_ANNOTATED]: false }

  const rawContent = await readFile(filePath, 'utf-8')
  const { data: meta, content: mdx } = matter(rawContent)

  return {
    ...item,
    [IS_ANNOTATED]: true,
    meta,
    mdx,
  } satisfies AnnotatedMarkdown
}

type FnDetails = {
  [key: string]: Json
} & { functions: Json[] }

const isFnDetails = (spec: Json): spec is FnDetails =>
  spec !== null && typeof spec === 'object' && 'functions' in spec && Array.isArray(spec.functions)

const isFunction = (item: ICommonItem): item is ICommonFunction =>
  item.type === 'function' && !('isFunc' in item && item.isFunc === false)

const isAnnotatedFunction = (item: HalfAnnotated): item is AnnotatedFunction =>
  item.type === 'function' && !('isFunc' in item && item.isFunc !== false) && item[IS_ANNOTATED]

const annotateFunction = (libPath: string, specs: Specs | undefined, item: ICommonFunction) => {
  if (!specs?.spec || !isFnDetails(specs.spec)) {
    return {
      ...item,
      [IS_ANNOTATED]: false,
    }
  }

  const fnSpec = specs.spec.functions.find(
    (fn) => fn !== null && typeof fn === 'object' && 'id' in fn && fn.id === item.id
  )
  if (!fnSpec) {
    return {
      ...item,
      [IS_ANNOTATED]: false,
    }
  }

  return {
    ...item,
    [IS_ANNOTATED]: true,
    details: fnSpec as { [key: string]: Json } & { id: string },
  } satisfies AnnotatedFunction
}

const isAnnotatedFunctionOrMarkdown = (
  item: HalfAnnotated
): item is AnnotatedFunction | AnnotatedMarkdown =>
  isAnnotatedFunction(item) || isAnnotatedMarkdown(item)

const flatten = <T extends object, K extends string | number | symbol>(
  arr: RecObj<K, T>[],
  recKey: K
) =>
  arr.reduce((acc, elem) => {
    if (!!elem[recKey]) {
      const newElem = { ...elem }
      delete newElem[recKey]
      acc.push(newElem)

      acc.push(...flatten(elem[recKey]!, recKey))
    } else {
      acc.push(elem)
    }

    return acc
  }, [] as T[])

export { getRefDataForLib, isAnnotatedFunction, isAnnotatedMarkdown }
export type { IAnnotatedCommon, AnnotatedFunction, AnnotatedMarkdown }
