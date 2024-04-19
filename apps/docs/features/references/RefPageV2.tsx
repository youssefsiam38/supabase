import { CSSProperties, type PropsWithChildren } from 'react'
import { cn } from 'ui'
import { MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import {
  type IAnnotatedFunction,
  type ICompiledMarkdown,
  type IProcessedCommonItem,
} from '~/components/reference/Reference.types'
import { MainSkeleton } from '~/layouts/MainSkeleton'
import { MDXRemote } from 'next-mdx-remote'
import components from '~/components'
import { Heading } from '~/components/CustomHTMLElements'
import ReactMarkdown from 'react-markdown'

const RefPageV2 = (props) => (
  console.log(props),
  (
    <MainSkeleton menuId={MenuId.Home}>
      <div
        className={cn(
          'w-full max-w-7xl mx-auto',
          'px-5 py-16',
          'flex flex-col gap-16 lg:gap-32 divide-y',
          '@container'
        )}
      >
        {/* {flattenOnKey<'items', IProcessedCommonItem>('items', sections).map((section, idx) => (
        <RefSectionSwitch
          key={'id' in section ? section.id : section.title}
          section={section}
          idx={idx}
        />
      ))} */}
      </div>
    </MainSkeleton>
  )
)

const RefSectionSwitch = ({ section, idx }: { section: IProcessedCommonItem; idx: number }) => {
  switch (section.type) {
    case 'markdown':
      return <RefMarkdownSection section={section as ICompiledMarkdown} isFirst={idx === 0} />
    case 'function':
      return <RefFunctionSection section={section as IAnnotatedFunction} />
    case 'category':
    default:
      return null
  }
}

const RefSectionWrapper = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <article className={cn('prose max-w-none w-full', className)}>{children}</article>
)

const RefMarkdownSection = ({
  section: { compiled, meta },
  isFirst,
}: {
  section: ICompiledMarkdown
  isFirst?: boolean
}) => (
  <RefSectionWrapper>
    {!isFirst && meta?.title && <Heading tag="h2">{meta.title as string}</Heading>}
    {compiled && <MDXRemote {...compiled} components={components} />}
  </RefSectionWrapper>
)

const RefFunctionSection = ({
  section: { title, description, details, notes, ...rest },
}: {
  section: IAnnotatedFunction
}) => {
  /** Nothing worth displaying if we have no information about the function. */
  if (!details) return null

  return (
    <RefSectionWrapper>
      <Heading tag="h2">{title}</Heading>
      <div className="grid @4xl:grid-cols-2 gap-12">
        <section aria-labelledby={`function-${title}-overview`}>
          <h3 className="sr-only" id={`function-${title}-overview`}>
            Overview
          </h3>
          {description && <ReactMarkdown className="">{description}</ReactMarkdown>}
          {(notes || details.notes) && (
            <ReactMarkdown className="">{notes || details.notes}</ReactMarkdown>
          )}
          {details.params?.length > 0 && (
            <FunctionParameters title={title} params={details.params} />
          )}
        </section>
        <pre className="overflow-hidden">
          {JSON.stringify({ title, details, ...rest }, null, 2)}
        </pre>
      </div>
    </RefSectionWrapper>
  )
}

const FunctionParameters = ({ title, params }: { title; params }) => (
  <section aria-labelledby={`function-${title}-parameters`} className="not-prose">
    <h3 id={`function-${title}-parameters`} className="text-base text-foreground mb-3">
      Parameters
    </h3>
    <ul>
      {params.map((param) => (
        <li key={param.name} className="border-y py-5">
          <div className="flex gap-3 items-center">
            <h4>{param.name}</h4>
            {param.isOptional && <span>Optional</span>}
            {param.type && <span>{param.type}</span>}
          </div>
          {param.description && <ReactMarkdown>{param.description}</ReactMarkdown>}
          {param.subContent?.length > 0 && (
            <ul>
              {param.subContent.map((key) => (
                <li key={key.name}>{key.name}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </section>
)

export { RefPageV2 }
