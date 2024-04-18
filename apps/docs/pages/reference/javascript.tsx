import { type InferGetStaticPropsType } from 'next'
import { RefPageV2 } from '~/features/references/RefPageV2'
import { getClientLibProps } from '~/features/references/client-libs/clientLibProps'
import spec from '~/spec/supabase_js_v2.yml' assert { type: 'yml' }

type JsRefProps = InferGetStaticPropsType<typeof getStaticProps>
const JsRef = (props: JsRefProps) => <RefPageV2 {...props} />

const getStaticProps = getClientLibProps({
  spec,
  docsDir: 'javascript',
  excludeLabel: 'reference_javascript_v2',
})

export default JsRef
export { getStaticProps }
