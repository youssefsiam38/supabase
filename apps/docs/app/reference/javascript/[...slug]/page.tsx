import { MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import type { TypeSpec } from '~/components/reference/Reference.types'
import { RefDisplay } from '~/features/docs/Reference.Display'
import { getRefDataForLib } from '~/features/docs/Reference.server'
import typeSpecUntyped from '~/spec/enrichments/tsdoc_v2/combined.json' assert { type: 'json' }
import spec from '~/spec/supabase_js_v2.yml' assert { type: 'yml' }

const typeSpec = typeSpecUntyped as TypeSpec

const JsReference = async () => {
  const { navData, flattenedSections } = await getRefDataForLib(
    'javascript',
    { excludeLabel: 'reference_javascript_v2' },
    { spec, typeSpec },
  )

  return <RefDisplay menuId={MenuId.RefJavaScriptV2} navData={navData} flattenedSections={flattenedSections} />
}

export default JsReference
