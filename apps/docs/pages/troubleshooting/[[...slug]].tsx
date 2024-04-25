import { type CodeHikeConfig, remarkCodeHike } from '@code-hike/mdx'
import codeHikeTheme from 'config/code-hike.theme.json' assert { type: 'json' }
import matter from 'gray-matter'
import { type GetStaticPaths, type GetStaticProps, type InferGetStaticPropsType } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import type { SerializeOptions } from 'next-mdx-remote/dist/types'
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import components from '~/components'
import { MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import Layout from '~/layouts/DefaultGuideLayout'

const DOCS_DIRECTORY = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const CONTENT_DIRECTORY = join(DOCS_DIRECTORY, 'content')

type Frontmatter = {
  title: string
  description?: string
  hideToc?: boolean
}

export function isValidFrontmatter(obj: object): obj is Frontmatter {
  if (!('title' in obj) || typeof obj.title !== 'string') return false
  if ('description' in obj && typeof obj.description !== 'string') return false
  return true
}

export const getStaticPaths = (async () => {
  const directory = join(CONTENT_DIRECTORY, 'troubleshooting')

  const files = (await readdir(directory, { recursive: true }))
    .filter((file) => extname(file) === '.mdx')
    .map((file) => ({
      params: {
        slug: file.replace(/\.mdx$/, '').split(sep),
      },
    }))

  // Index page isn't included in the directory
  const indexFile = join(CONTENT_DIRECTORY, 'troubleshooting.mdx')
  if (existsSync(indexFile)) {
    files.push({ params: { slug: [] } })
  }

  return {
    paths: files,
    fallback: false,
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (
  { params: { slug } }: { params: { slug?: Array<string> } }
) => {
  const relPath = slug ? `troubleshooting${sep}${slug.join(sep)}` : 'troubleshooting'
  const fullPath = join(CONTENT_DIRECTORY, `${relPath}.mdx`)

  /**
   * SAFETY CHECK:
   * Prevent accessing anything outside of CONTENT_DIRECTORY
   */
  if (!fullPath.startsWith(CONTENT_DIRECTORY)) {
    throw Error('Accessing forbidden route. Content must be within the CONTENT_DIRECTORY.')
  }

  const mdx = await readFile(fullPath, 'utf-8')

  const editLink = `supabase/supabase/blob/master/apps/docs/content/${relPath}.mdx`

  const { data: frontmatter, content } = matter(mdx)
  if (!isValidFrontmatter(frontmatter)) {
    throw Error('Type of frontmatter is not valid')
  }

  const codeHikeOptions: CodeHikeConfig = {
    theme: codeHikeTheme,
    lineNumbers: true,
    showCopyButton: true,
    skipLanguages: [],
    autoImport: false,
  }

  const mdxOptions: SerializeOptions = {
    mdxOptions: {
      useDynamicImport: true,
      remarkPlugins: [
        [remarkMath, { singleDollarTextMath: false }],
        remarkGfm,
        [remarkCodeHike, codeHikeOptions],
      ],
      rehypePlugins: [rehypeKatex as any],
    },
  }
  const mdxSource = await serialize(content, mdxOptions)

  return {
    props: {
      frontmatter,
      mdxSource,
      editLink,
    },
  }
}) satisfies GetStaticProps

export default function TroubleshootingGuide({
  frontmatter,
  mdxSource,
  editLink,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { hideToc, ...meta } = frontmatter

  return (
    <Layout meta={meta} hideToc={hideToc} editLink={editLink} menuId={MenuId.Troubleshooting}>
      <MDXRemote {...mdxSource} components={components} />
    </Layout>
  )
}
