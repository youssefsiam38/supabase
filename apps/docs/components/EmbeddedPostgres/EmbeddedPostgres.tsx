import { useSyncExternalStore, type PropsWithChildren } from 'react'

import { Input_Shadcn_ } from 'ui'

import { DbStatus, db } from './postgres'

const LoadingMessage = ({ children }: PropsWithChildren) => <>{children}</>

const DbQueryForm = () => <Input_Shadcn_ />

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
