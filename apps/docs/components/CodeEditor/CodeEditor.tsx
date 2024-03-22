import EditorPrimitive from '@monaco-editor/react'
import { type ComponentProps } from 'react'

import { useConfigureEditor } from './CodeEditor.utils'

const Editor = (props: ComponentProps<typeof EditorPrimitive>) => {
  useConfigureEditor()

  return <EditorPrimitive theme="supabase" {...props} />
}

export { Editor }
