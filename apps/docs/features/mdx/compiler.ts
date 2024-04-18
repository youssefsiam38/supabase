import { remarkCodeHike, type CodeHikeConfig } from '@code-hike/mdx'
import codeHikeTheme from 'config/code-hike.theme.json' assert { type: 'json' }
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'

const codeHikeOptions: CodeHikeConfig = {
  theme: codeHikeTheme,
  lineNumbers: true,
  showCopyButton: true,
  skipLanguages: [],
  autoImport: false,
}

const compileMdx = async (mdxString: string) => {
  const { data, content } = matter(mdxString)

  const compiled = await serialize(content, {
    mdxOptions: {
      useDynamicImport: true,
      remarkPlugins: [remarkGfm, [remarkCodeHike, codeHikeOptions]],
    },
  })

  return {
    meta: data,
    compiled,
  }
}

export { compileMdx }
