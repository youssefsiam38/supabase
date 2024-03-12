import { DbStatus, db } from './postgres'

const EmbeddedPostgres = () => {
  switch (db.status) {
    case DbStatus.Initializing:
    case DbStatus.Reinitializing:
    case DbStatus.SettingUp:
    case DbStatus.Ready:
    case DbStatus.Closing:
    case DbStatus.Closed:
    case DbStatus.Error:
    default:
  }

  return <></>
}

export default EmbeddedPostgres
