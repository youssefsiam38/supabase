import { zodResolver } from '@hookform/resolvers/zod'
import { type PropsWithChildren, useCallback, useState, useSyncExternalStore } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button_Shadcn_, FormField_Shadcn_, Form_Shadcn_, Input_Shadcn_ } from 'ui'

import { DbStatus, db } from './postgres'

const LoadingMessage = ({ children }: PropsWithChildren) => <>{children}</>

const formSchema = z.object({
  sql: z.string().min(1),
})

const QueryResults = ({ results }: { results: Array<object> }) => {
  if (!results.length) return null

  const columns = Object.keys(results[0])

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
        {results.map((result, idx) => (
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
  const [results, setResults] = useState<Array<object>>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sql: '',
    },
  })

  const onSubmitQuery = useCallback(async ({ sql }: z.infer<typeof formSchema>) => {
    try {
      const response = await db.db.query(sql)
      if (Array.isArray(response)) setResults(response)
    } catch (err) {
      console.error(err)
    }
  }, [])

  const clearResults = useCallback(() => setResults([]), [])

  return (
    <>
      <Form_Shadcn_ {...form}>
        <form onSubmit={form.handleSubmit(onSubmitQuery)} className="flex gap-2">
          <FormField_Shadcn_
            control={form.control}
            name="sql"
            render={({ field }) => <Input_Shadcn_ {...field} />}
          />
          <Button_Shadcn_>Execute SQL</Button_Shadcn_>
        </form>
      </Form_Shadcn_>
      <Button_Shadcn_ onClick={clearResults}>Clear results</Button_Shadcn_>
      <QueryResults results={results} />
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

  return <></>
}

const EmbeddedPostgres = () => {
  useSyncExternalStore(db.subscribe, () => db.status)
  return <DbStatusSwitch />
}

export default EmbeddedPostgres
