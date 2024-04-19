import { type InferGetStaticPropsType } from 'next'
import { RefPageV2 } from '~/features/references/RefPageV2'
import { getClientLibProps } from '~/features/references/client-libs/clientLibProps'

type JsRefProps = InferGetStaticPropsType<typeof getStaticProps>
const JsRef = (props: JsRefProps) => <RefPageV2 {...props} />

const getStaticProps = getClientLibProps({
  library: 'js',
  excludeLabel: 'reference_javascript_v2',
})

export default JsRef
export { getStaticProps }
