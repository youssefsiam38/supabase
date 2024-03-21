import Editor, { useMonaco } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import {
  type PropsWithChildren,
  useCallback,
  useReducer,
  useSyncExternalStore,
  useState,
} from 'react'

import { Button_Shadcn_ } from 'ui'

import { useOnceWithDependencies } from '~/hooks/useOnceWithDependencies'
import { DbStatus, db } from './postgres'

const LoadingMessage = ({ children }: PropsWithChildren) => <>{children}</>

enum QueryStateType {
  Empty = 'Empty',
  Loading = 'Loading',
  SuccessData = 'SuccessData',
  SuccessNoData = 'SuccessNoData',
  Error = 'Error',
}

type QuerySuccessState =
  | { __state: QueryStateType.SuccessData; results: Array<any> }
  | { __state: QueryStateType.SuccessNoData }

type QueryState =
  | { __state: QueryStateType.Empty }
  | { __state: QueryStateType.Loading }
  | QuerySuccessState
  | { __state: QueryStateType.Error }

const initialQueryState = { __state: QueryStateType.Empty } as QueryState

enum QUERY_EVENT_TYPE {
  QUERY_SENT = 'QUERY_SENT',
  SUCCESS_RECEIVED = 'SUCCESS_RECEIVED',
  ERRORED = 'ERRORED',
  RESET = 'RESET',
}

type QueryEvent =
  | { __type: QUERY_EVENT_TYPE.QUERY_SENT }
  | { __type: QUERY_EVENT_TYPE.SUCCESS_RECEIVED; response: Array<any> | undefined }
  | { __type: QUERY_EVENT_TYPE.ERRORED }
  | { __type: QUERY_EVENT_TYPE.RESET }

const queryStateReducer = (state: QueryState, event: QueryEvent): QueryState => {
  switch (event.__type) {
    case QUERY_EVENT_TYPE.QUERY_SENT:
      if (state.__state !== QueryStateType.Loading) {
        return {
          __state: QueryStateType.Loading,
        }
      }
      break
    case QUERY_EVENT_TYPE.SUCCESS_RECEIVED:
      if (state.__state === QueryStateType.Loading) {
        if (event.response) {
          return {
            __state: QueryStateType.SuccessData,
            results: event.response,
          }
        } else {
          return {
            __state: QueryStateType.SuccessNoData,
          }
        }
      }
      break
    case QUERY_EVENT_TYPE.ERRORED:
      return {
        __state: QueryStateType.Error,
      }
    case QUERY_EVENT_TYPE.RESET:
      return {
        __state: QueryStateType.Empty,
      }
  }

  return state
}

const QueryResults = ({ state }: { state: QuerySuccessState }) => {
  if (state.__state === QueryStateType.SuccessNoData) {
    return 'Success'
  }

  if (!state.results.length) return 'No results found'

  const columns = Object.keys(state.results[0])

  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {state.results.map((result, idx) => (
          <tr key={idx}>
            {Object.values(result).map((value, idx) => (
              <td key={idx}>{`${value}`}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const getTheme = (theme: string) => {
  const isDarkMode = theme.includes('dark')
  // [TODO] Probably need better theming for light mode
  return {
    base: isDarkMode ? 'vs-dark' : 'vs', // can also be vs-dark or hc-black
    inherit: true, // can also be false to completely replace the builtin rules
    rules: [
      { background: isDarkMode ? '1f1f1f' : 'f0f0f0' },
      {
        token: '',
        background: isDarkMode ? '1f1f1f' : 'f0f0f0',
        foreground: isDarkMode ? 'd4d4d4' : '444444',
      },
      { token: 'string.sql', foreground: '24b47e' },
      { token: 'comment', foreground: '666666' },
      { token: 'predefined.sql', foreground: isDarkMode ? 'D4D4D4' : '444444' },
    ],
    colors: { 'editor.background': isDarkMode ? '#1f1f1f' : '#f0f0f0' },
  }
}

const useConfigureEditor = () => {
  const { resolvedTheme } = useTheme()
  const monaco = useMonaco()

  const configureEditor = useCallback(() => {
    if (monaco && resolvedTheme) {
      const mode: any = getTheme(resolvedTheme)
      monaco.editor.defineTheme('supabase', mode)
    }
  }, [resolvedTheme, monaco])

  useOnceWithDependencies(configureEditor, [monaco, resolvedTheme])
}

const DbQueryForm = () => {
  const [state, dispatch] = useReducer(queryStateReducer, initialQueryState)

  useConfigureEditor()
  const [sql, setSql] = useState('')

  const isSuccess =
    state.__state === QueryStateType.SuccessData || state.__state === QueryStateType.SuccessNoData
  const isLoading = state.__state === QueryStateType.Loading
  const isError = state.__state === QueryStateType.Error

  const onSubmitQuery = useCallback(async () => {
    try {
      dispatch({ __type: QUERY_EVENT_TYPE.QUERY_SENT })
      const response = await db.db.query(sql)
      dispatch({
        __type: QUERY_EVENT_TYPE.SUCCESS_RECEIVED,
        response: response as Array<any> | undefined,
      })
    } catch (err) {
      dispatch({
        __type: QUERY_EVENT_TYPE.ERRORED,
      })
    }
  }, [sql])

  const clearEditor = () => setSql('')
  const clearResults = () => dispatch({ __type: QUERY_EVENT_TYPE.RESET })

  return (
    <>
      <Editor
        theme="supabase"
        height="50vh"
        defaultLanguage="sql"
        value={sql}
        onChange={(value) => setSql(value)}
      />
      <Button_Shadcn_ disabled={isLoading} onClick={onSubmitQuery}>
        Execute SQL
      </Button_Shadcn_>
      <Button_Shadcn_ disabled={!sql.length} onClick={clearEditor}>
        Clear editor
      </Button_Shadcn_>
      <Button_Shadcn_
        disabled={state.__state !== QueryStateType.SuccessData}
        onClick={clearResults}
      >
        Clear results
      </Button_Shadcn_>
      {isSuccess && <QueryResults state={state} />}
      {isError && 'Sorry, error!'}
    </>
  )
}

const DbStatusSwitch = () => {
  switch (db.status) {
    case DbStatus.Initializing:
      return <LoadingMessage>Setting up database...</LoadingMessage>
    case DbStatus.Reinitializing:
      return <LoadingMessage>Resetting database...</LoadingMessage>
    case DbStatus.SettingUp:
      return (
        <LoadingMessage>
          Seeding data with <code>{db.dataset}</code> dataset...
        </LoadingMessage>
      )
    case DbStatus.Ready:
      return <DbQueryForm />
    case DbStatus.Closing:
    case DbStatus.Closed:
    case DbStatus.Error:
    default:
      return 'error'
  }
}

const EmbeddedPostgres = () => {
  useSyncExternalStore(db.subscribe, () => db.status)
  return <DbStatusSwitch />
}

export default EmbeddedPostgres
