import { PGlite } from '@electric-sql/pglite'
import { countriesSeed } from './data/countries'

enum DbStatus {
  Initializing = 'Initializing',
  Reinitializing = 'Reinitializing',
  SettingUp = 'SettingUp',
  Ready = 'Ready',
  Closing = 'Closing',
  Closed = 'Closed',
  Error = 'Error',
}

const transitionStatus = (db: Db, old: DbStatus, updated: DbStatus) => {
  if (old === updated) {
    console.warn(`Trying to transition to the current status: ${old}`)
    return old
  }

  switch (old) {
    case DbStatus.Initializing:
      if (updated === DbStatus.SettingUp) db.status = updated
    case DbStatus.Reinitializing:
      if (updated === DbStatus.SettingUp) db.status = updated
    case DbStatus.SettingUp:
      if (updated === DbStatus.Ready) db.status = updated
    case DbStatus.Ready:
      if (updated === DbStatus.Closing) db.status = updated
    case DbStatus.Closing:
      if (updated === DbStatus.Closed) db.status = updated
    case DbStatus.Closed:
      if (updated === DbStatus.Reinitializing) db.status = updated
    default:
      if (updated === DbStatus.Error) db.status = updated
      throw Error(`Cannot transition between status ${old} and status ${updated}`)
  }
}

type Sql = string

enum SeedData {
  Countries = 'countries',
}

const seedMap: Record<SeedData, Sql> = {
  [SeedData.Countries]: countriesSeed,
}

interface Db {
  db: PGlite
  status: DbStatus
  dataset: SeedData | null
}

const withStatusTransition =
  <Options extends [object] | []>(
    fn: (db: Db, ...options: Options) => void,
    {
      pendingStatus,
      finalStatus,
      errorMessage = 'Error',
      closeOnError = true,
    }: {
      pendingStatus: DbStatus
      finalStatus: DbStatus
      errorMessage?: string
      closeOnError?: boolean
    }
  ) =>
  async (...params: [Db, ...Options]) => {
    try {
      transitionStatus(db, db.status, pendingStatus)
      await fn(...params)
      transitionStatus(db, db.status, finalStatus)
    } catch (err) {
      console.error(`${errorMessage}: ${err}`)
      if (closeOnError) closeDbOnError(db)
    }
  }

const initDb = () => ({ db: new PGlite(), status: DbStatus.Initializing, dataset: null }) as Db

const setupDb = withStatusTransition(
  async (db: Db, { data }: { data: SeedData }) => {
    await db.db.query(seedMap[data])
    db.dataset = data
  },
  {
    pendingStatus: DbStatus.SettingUp,
    finalStatus: DbStatus.Ready,
    errorMessage: 'Error setting up DB',
  }
)

const closeDb = withStatusTransition(
  async (db: Db) => {
    if (db.status !== DbStatus.Closed) {
      await db.db.close()
      db.dataset = null
    }
  },
  {
    pendingStatus: DbStatus.Closing,
    finalStatus: DbStatus.Closed,
    errorMessage: 'Error closing DB',
    closeOnError: false,
  }
)

const closeDbOnError = async (db: Db) => {
  try {
    await closeDb(db)
  } catch {
    // ignore
  }
}

const resetDb = async (db: Db, data?: SeedData) => {
  await closeDb(db)
  withStatusTransition((db: Db) => (db.db = new PGlite()), {
    pendingStatus: DbStatus.Closed,
    finalStatus: DbStatus.Reinitializing,
    errorMessage: 'Error initializing new DB',
  })
  setupDb(db, data && { data })
}

const db = initDb()
/**
 * Not awaited because we don't want to block render on seeding.
 *
 * Instead component should check for DbStatus.
 */
setupDb(db, { data: SeedData.Countries })

export { DbStatus, SeedData, db, resetDb }
