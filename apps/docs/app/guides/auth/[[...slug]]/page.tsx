import { compileMDX } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'url'

import { Admonition } from 'ui/src/components/Admonition'
import AuthProviders from '~/components/AuthProviders'
import { IconPanel } from 'ui/src/components/IconPanel'

const components = { Admonition, AuthProviders, IconPanel, Link }

export default async function RemoteMdxPage({ params: { slug } }: { params: { slug: string[] } }) {
  const shortPath = slug?.join('/') ?? ''
  const guidesDir = join(fileURLToPath(import.meta.url), '../../../../../content/guides')
  const fullPath = `${guidesDir}/auth${shortPath ? `/${shortPath}` : ''}.mdx`

  try {
    const source = await readFile(fullPath, 'utf-8')
    const { content, frontmatter } = await compileMDX({
      source,
      components,
      options: { parseFrontmatter: true },
    })

    return (
      <>
        <h1>{frontmatter.title}</h1>
        {content}
      </>
    )
  } catch {
    return <h1>404</h1>
  }
}
