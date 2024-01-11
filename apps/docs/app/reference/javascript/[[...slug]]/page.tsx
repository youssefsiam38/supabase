import clientLibsCommonSections from '~/spec/common-client-libs-sections.json'
import typeSpec from '~/spec/enrichments/tsdoc_v2/combined.json'
import spec from '~/spec/supabase_js_v2.yml' assert { type: 'yml' }
import handleRefStaticProps from '~/lib/mdx/handleRefStaticProps'
import { InnerLayout } from '../../InnerLayout'
import { createRemoveExcluder } from '../../navUtils'
import { ScrollHandler } from '../../ScrollHandler'
import { flattenSections } from '~/lib/helpers'
import { extractTsDocNode, generateParameters } from '~/lib/refGenerator/helpers'
import ReactMarkdown from 'react-markdown'
import { Fragment } from 'react'
import { ICommonSection } from '~/components/reference/Reference.types'
import Link from 'next/link'

const flattenedSections = flattenSections(
  createRemoveExcluder('reference_javascript_v2')(clientLibsCommonSections)
)

function NullComponent(props: any) {
  return null
}

function FunctionComponent({ section }: { section: ICommonSection }) {
  const functionSpec = spec.functions.find((fn) => fn.id === section.id)
  if (!functionSpec) return null

  const hasTsRef = functionSpec['$ref'] || null

  const tsDefinition = hasTsRef && typeSpec ? extractTsDocNode(hasTsRef, typeSpec) : null
  const parameters = hasTsRef && tsDefinition ? generateParameters(tsDefinition) : ''
  const shortText = hasTsRef && tsDefinition ? tsDefinition.signatures[0].comment.shortText : ''

  return (
    <section>
      <h2 id={section.slug}>
        <Link href={`#${section.slug}`}>{functionSpec.title}</Link>
      </h2>
      <header className={['prose'].join(' ')}>
        {shortText && <ReactMarkdown className="text-sm">{shortText}</ReactMarkdown>}
      </header>
      {functionSpec.description && (
        <div className="prose">
          <ReactMarkdown className="text-sm">{functionSpec.description}</ReactMarkdown>
        </div>
      )}
      {functionSpec.notes && (
        <div className="prose">
          <ReactMarkdown className="text-sm">{functionSpec.notes}</ReactMarkdown>
        </div>
      )}
    </section>
  )
}

export default function JavaScriptReference({ params: { slug } }: { params: { slug: string } }) {
  return (
    <>
      <ScrollHandler slug={slug} />
      <article>
        <InnerLayout>
          {flattenedSections.map((section) => {
            const type = section.type
            const Component =
              type === 'markdown'
                ? 'p'
                : type === 'function'
                ? FunctionComponent
                : type === 'cli-command'
                ? 'p'
                : type === 'operation'
                ? 'p'
                : NullComponent

            return (
              <Fragment key={section.id}>
                <Component section={section} />
              </Fragment>
            )
          })}
        </InnerLayout>
      </article>
    </>
  )
}
