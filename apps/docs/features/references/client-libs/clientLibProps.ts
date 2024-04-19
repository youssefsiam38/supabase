import { type GetStaticProps } from 'next'
import {
  type ICommonMarkdown,
  type ICommonFunction,
  type ICompiledMarkdown,
  type IAnnotatedFunction,
  type IProcessedCommonItem,
  type ICommonItem,
  ICommonCategory,
} from '~/components/reference/Reference.types'
import commonClientLibSections from '~/spec/common-client-libs-sections.json' assert { type: 'json' }
import {
  fileExistsAsync,
  filterRec,
  mapRecAsync,
  replaceSubstitutions,
} from './clientLibProps.utils'
import { curry, lte, negate } from 'lodash'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFile } from 'fs/promises'
import { compileMdx } from '~/features/mdx/compiler'
import type { Json } from '~/types'
import { flattenOnKey } from '../RefPageV2.utils'
import { parse } from 'toml'

const REFS_DIRECTORY = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'content',
  'reference',
  'client-libs'
)

const typedCommonClientSections = structuredClone(commonClientLibSections) as ICommonItem[]

const mightContainExclusions = (item: ICommonItem): item is ICommonItem & { excludes: unknown[] } =>
  'excludes' in item && Array.isArray(item.excludes)
const isExplicitlyExcluded = (excludeLabel: string, item: ICommonItem) =>
  mightContainExclusions(item) && item.excludes.includes(excludeLabel)
const isNotExplicitlyExcluded = curry(negate(isExplicitlyExcluded), 2)

const isMarkdown = (item: ICommonItem): item is ICommonMarkdown => item.type === 'markdown'
const getMdxPath = (library: string, version: string | undefined, markdown: ICommonMarkdown) =>
  join(REFS_DIRECTORY, `${markdown.slug}.${library}${version ? `.${version}` : ''}.mdx`)
const compileMarkdownForSpec =
  (library: string, version?: string) => async (markdown: ICommonMarkdown) => {
    const compiledMarkdown = markdown as ICompiledMarkdown

    const filePath = getMdxPath(library, version, markdown)

    /** If there are no docs, mark file as not compiled. */
    if (!(await fileExistsAsync(filePath))) {
      compiledMarkdown.__EMPTY = true
    } else {
      /** Compile Markdown and attach to object. */
      try {
        const file = await readFile(filePath, 'utf-8')
        const { meta, compiled } = await compileMdx(file)
        compiledMarkdown.__EMPTY = false
        compiledMarkdown.meta = meta
        compiledMarkdown.compiled = compiled
      } catch (err) {
        console.error(`[Ref Markdown compilation]: Error compiling Markdown for ${filePath}:
        ${err}`)

        /** Failed, so mark file as not compiled. */
        compiledMarkdown.__EMPTY = true
      }
    }

    return compiledMarkdown
  }

const isFunction = (item: ICommonItem): item is ICommonFunction =>
  item.type === 'function' && !('isFunc' in item && item.isFunc === false)
const getTomlPaths = (
  library: string,
  version: string | undefined,
  fn: ICommonFunction
): [string, string, string] => [
  join(REFS_DIRECTORY, `${fn.id}.toml`),
  join(REFS_DIRECTORY, `${fn.id}.${library}${version ? `.${version}` : ''}.toml`),
  join(REFS_DIRECTORY, '_meta.toml'),
]
const attachFunctionDetails =
  (library: string, version?: string) => async (fn: ICommonFunction) => {
    const annotatedFn = fn as IAnnotatedFunction

    const specs = getTomlPaths(library, version, fn)

    /** If there are no files, there's nothing to process. */
    if (!(await Promise.all(specs.map(fileExistsAsync))).every(Boolean)) {
      annotatedFn.__EMPTY = true
    }

    try {
      const [genSpec, specSpec, config] = await Promise.all(
        specs.map((spec) => readFile(spec, 'utf-8').then(parse))
      )

      /**
       * Replace substituted variables in descriptions and notes.
       */
      genSpec.description &&= replaceSubstitutions(
        genSpec.description,
        specSpec,
        config,
        library,
        version
      )
      genSpec.notes &&= replaceSubstitutions(genSpec.notes, specSpec, config, library, version)

      /**
       * Overwrite and/or append descriptions and notes.
       */
      const combinedDescription = (
        (specSpec.description?.overwrite ?? genSpec.description ?? '') +
        '\n' +
        (specSpec.description?.append ?? '')
      ).trim()
      const combinedNotes = (
        (specSpec.notes.overwrite ?? genSpec.notes ?? '') +
        '\n' +
        (specSpec.notes?.append ?? '')
      ).trim()

      /**
       * Merge the objects and return.
       */
      annotatedFn.__EMPTY = false
      annotatedFn.details = {
        ...genSpec,
        ...specSpec,
        description: combinedDescription,
        notes: combinedNotes,
      }
    } catch (err) {
      console.error(`[Ref function annotation]: Error annotating function for ${fn.id}:
        ${err}`)

      /** Failed, so mark file as not annotated. */
      annotatedFn.__EMPTY = true
    }

    return annotatedFn
  }

const isCategory = (item: ICommonItem): item is ICommonCategory => item.type === 'category'
const annotateSection = (library: string, version?: string) => (item: ICommonItem) => {
  if (isCategory(item)) return item
  if (isMarkdown(item)) return compileMarkdownForSpec(library, version)(item)
  if (isFunction(item)) return attachFunctionDetails(library, version)(item)
  return item
}

const getClientLibProps = ({
  library,
  version,
  excludeLabel = '*',
}: {
  library: string
  version?: string
  excludeLabel?: string
}) =>
  (async () => {
    const filteredSections = filterRec(
      isNotExplicitlyExcluded(excludeLabel),
      'items',
      typedCommonClientSections
    )
    let sections = (await mapRecAsync(
      annotateSection(library, version),
      'items',
      filteredSections
    )) as IProcessedCommonItem[]

    const navTree = sections.map(({ id, title, slug, items }) => {
      const result = { title } as any // TODO FIX

      if (id) result.id = id
      if (title) result.title = title
      if (slug) result.slug = slug
      if (items) result.items = items.map(({ id, title, slug }) => ({ id, title, slug }))

      return result
    })
    console.log('一二三四五六', JSON.stringify(navTree, null, 2))

    /**
     * Typing is very broken but let's fix this later.
     * Also should preserve some minimal nesting information to build the nav
     * menu.
     */
    const flatSections = flattenOnKey<'items', IProcessedCommonItem>('items', sections).filter(
      (item) => !isCategory(item)
    )
    flatSections.forEach((section) => void ('items' in section && delete section.items))

    return { props: { flatSections, navTree } }
  }) satisfies GetStaticProps

export { getClientLibProps }
