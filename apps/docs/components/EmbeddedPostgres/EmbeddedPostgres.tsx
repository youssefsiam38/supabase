import { zodResolver } from '@hookform/resolvers/zod'
import { type PropsWithChildren, useCallback, useReducer, useSyncExternalStore } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button_Shadcn_, FormField_Shadcn_, Form_Shadcn_, Input_Shadcn_ } from 'ui'

import { DbStatus, db } from './postgres'

const LoadingMessage = ({ children }: PropsWithChildren) => <>{children}</>

const formSchema = z.object({
  sql: z.string().min(1),
})

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

const DbQueryForm = () => {
  const [state, dispatch] = useReducer(queryStateReducer, initialQueryState)

  const isSuccess =
    state.__state === QueryStateType.SuccessData || state.__state === QueryStateType.SuccessNoData
  const isLoading = state.__state === QueryStateType.Loading
  const isError = state.__state === QueryStateType.Error

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sql: '',
    },
  })

  const onSubmitQuery = useCallback(
    async ({ sql }: z.infer<typeof formSchema>) => {
      try {
        dispatch({ __type: QUERY_EVENT_TYPE.QUERY_SENT })
        form.reset()
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
    },
    [form]
  )

  const clearResults = () => dispatch({ __type: QUERY_EVENT_TYPE.RESET })

  return (
    <>
      <Form_Shadcn_ {...form}>
        <form onSubmit={form.handleSubmit(onSubmitQuery)} className="flex gap-2">
          <FormField_Shadcn_
            control={form.control}
            name="sql"
            disabled={isLoading}
            render={({ field }) => <Input_Shadcn_ {...field} />}
          />
          <Button_Shadcn_ disabled={isLoading}>Execute SQL</Button_Shadcn_>
        </form>
      </Form_Shadcn_>
      <Button_Shadcn_ onClick={clearResults}>Clear results</Button_Shadcn_>
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
      return <LoadingMessage>Seeding data with {db.dataset} dataset...</LoadingMessage>
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
