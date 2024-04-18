import { type GetStaticProps } from 'next'
import {
  type ICommonMarkdown,
  type ICommonBase,
  type ICommonFunction,
  type ICompiledMarkdown,
  type IAnnotatedFunction,
  IProcessedCommonItem,
} from '~/components/reference/Reference.types'
import { commonClientLibSections } from '~/spec/common-client-libs-sections'
import { fileExistsAsync, filterRec, mutateRecAsync } from './clientLibProps.utils'
import { curry, negate } from 'lodash'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFile } from 'fs/promises'
import { compileMdx } from '~/features/mdx/compiler'
import type { Json } from '~/types'
import { flattenOnKey } from '../RefPageV2.utils'

const DOCS_DIRECTORY = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  '..',
  'docs',
  'ref'
)
const getDocsPath = (docsDir: string, markdown: ICommonMarkdown) =>
  join(DOCS_DIRECTORY, docsDir, `${markdown.slug}.mdx`)

const typedCommonClientSections = structuredClone(commonClientLibSections) as ICommonBase[]

const mightContainExclusions = (base: ICommonBase): base is ICommonBase & { excludes: unknown[] } =>
  'excludes' in base && Array.isArray(base.excludes)
const isExplicitlyExcluded = (excludeLabel: string, base: ICommonBase) =>
  mightContainExclusions(base) && base.excludes.includes(excludeLabel)
const isNotExplicitlyExcluded = curry(negate(isExplicitlyExcluded), 2)

const isMarkdown = (base: ICommonBase): base is ICommonMarkdown => base.type === 'markdown'
const compileMarkdownForSpec =
  (docsDir: string | undefined) => async (maybeMarkdown: ICommonBase) => {
    /** If it's not Markdown, nothing to process. */
    if (!isMarkdown(maybeMarkdown)) return
    /**
     * Cheating because it's not compiled yet. Make sure there are no code
     * paths that fail to attach the compiled property.
     */
    const markdown = maybeMarkdown as ICompiledMarkdown

    /** If there are no docs, mark file as not compiled. */
    if (!(docsDir && (await fileExistsAsync(getDocsPath(docsDir, markdown))))) {
      markdown.compiled = false
    } else {
      /** Compile Markdown and attach to object. */
      const filePath = getDocsPath(docsDir, markdown)
      try {
        const file = await readFile(filePath, 'utf-8')
        const { meta, compiled } = await compileMdx(file)
        markdown.meta = meta
        markdown.compiled = compiled
      } catch (err) {
        console.error(`[Ref Markdown compilation]: Error compiling Markdown for ${filePath}:
        ${err}`)

        /** Failed, so mark file as not compiled. */
        markdown.compiled = false
      }
    }

    if (!('compiled' in markdown)) {
      throw Error(
        '[Ref Markdown compilation]: Asserting that that is compiled Markdown, but missing compiled prop',
        { cause: markdown }
      )
    }
  }
const annotateMarkdown = (docsDir: string | undefined, base: ICommonBase[]) =>
  mutateRecAsync(compileMarkdownForSpec(docsDir), 'items', base)

const isFunction = (base: ICommonBase): base is ICommonFunction =>
  base.type === 'function' && !('isFunc' in base && base.isFunc === false)
const attachDetailsFromSpec = (spec: Json) => async (maybeFn: ICommonBase) => {
  /** If spec is not a proper spec, or has no functions, nothing to process. */
  if (!(spec && typeof spec === 'object' && 'functions' in spec && Array.isArray(spec.functions)))
    return

  /** If it's not a function group, nothing to process. */
  if (!isFunction(maybeFn)) return
  const fn = maybeFn as IAnnotatedFunction

  /** Find the function details and attach them to the object. */
  const details = (spec.functions ?? []).find(
    (details) => typeof details === 'object' && 'id' in details && details.id === fn.id
  )
  if (details) fn.details = details
}
const annotateFunction = (spec: Json, base: ICommonBase[]) =>
  mutateRecAsync(attachDetailsFromSpec(spec), 'items', base)

const getClientLibProps = ({
  spec,
  docsDir,
  excludeLabel = '*',
}: {
  spec: Json
  docsDir?: string
  excludeLabel?: string
}) =>
  (async () => {
    const filteredSections = filterRec(
      isNotExplicitlyExcluded(excludeLabel),
      'items',
      typedCommonClientSections
    )
    await annotateMarkdown(docsDir, filteredSections)
    await annotateFunction(spec, filteredSections)

    let sections = filteredSections as IProcessedCommonItem[]
    /**
     * Typing is very broken but let's fix this later.
     * Also should preserve some minimal nesting information to build the nav
     * menu.
     */
    sections = flattenOnKey<'items', IProcessedCommonItem>('items', sections)
    sections.forEach((section) => void ('items' in section && delete section.items))

    return { props: { sections } }
  }) satisfies GetStaticProps

export { getClientLibProps }
