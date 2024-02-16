import { type GetStaticPaths, type GetStaticProps, type InferGetStaticPropsType } from 'next'
import { MDXRemote } from 'next-mdx-remote'

import components from '~/components'
import NavigationMenuGuideList from '~/components/Navigation/NavigationMenu/NavigationMenuGuideList'
import Layout from '~/layouts/DefaultGuideLayout'
import { NavContainerContents } from '~/layouts/utils/contexts/NavContainerContext'
import { getGuidesStaticPaths, getGuidesStaticProps } from '~/lib/docs'

export const getStaticPaths = (async () => {
  return getGuidesStaticPaths('auth')
}) satisfies GetStaticPaths

export const getStaticProps = (async (args) => {
  return getGuidesStaticProps('auth', args)
}) satisfies GetStaticProps

export default function AuthGuide({
  frontmatter,
  mdxSource,
  editLink,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { hideToc, ...meta } = frontmatter

  return (
    <Layout meta={meta} hideToc={hideToc} editLink={editLink}>
      <NavContainerContents menuId="auth">
        <NavigationMenuGuideList menuId="auth" />
      </NavContainerContents>
      <MDXRemote {...mdxSource} components={components} />
    </Layout>
  )
}
