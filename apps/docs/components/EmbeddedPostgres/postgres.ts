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

const allowedTransitions: Record<
  DbStatus,
  Partial<
    Record<
      DbStatus,
      {
        condition?: (db: Db, options?: object) => boolean
        onEnter?: (db: Db, options?: any) => void // TODO: remove any
      }
    >
  >
> = {
  [DbStatus.Initializing]: {
    [DbStatus.SettingUp]: {
      condition: (_: Db, options?: object) => !!(options && 'dataset' in options),
      onEnter: (db: Db, options: any) => (db.dataset = options.dataset as SeedData),
    },
    [DbStatus.Error]: {},
  },
  [DbStatus.Reinitializing]: {
    [DbStatus.SettingUp]: {
      condition: (_: Db, options?: object) => !!(options && 'dataset' in options),
      onEnter: (db: Db, options: any) => (db.dataset = options.dataset as SeedData),
    },
    [DbStatus.Error]: {},
  },
  [DbStatus.SettingUp]: { [DbStatus.Ready]: {}, [DbStatus.Error]: {} },
  [DbStatus.Ready]: { [DbStatus.Closing]: {}, [DbStatus.Error]: {} },
  [DbStatus.Closing]: { [DbStatus.Closed]: {}, [DbStatus.Error]: {} },
  [DbStatus.Closed]: { [DbStatus.Error]: {} },
  [DbStatus.Error]: { [DbStatus.Error]: {} },
}

const transition = (db: Db, old: DbStatus, updated: DbStatus, options?: object) => {
  if (old === updated) {
    console.warn(`Trying to transition to the already active status: ${old}`)
    return old
  }

  const transition = allowedTransitions[old][updated]
  // Explicit check for false because lack of condition (undefined) = automatic pass
  if (!transition || transition.condition?.(db, options) === false) {
    throw Error(`Cannot transition between state ${old} and ${updated}`)
  }

  db.status = updated
  transition.onEnter?.(db, options)
  db.notify()
}

type Callback = () => void
type Unsubscribe = () => void

type Subscribable = {
  subscribe: (cb: Callback) => Unsubscribe
  notify: () => void
}

type DbBase = {
  db: PGlite
  status: DbStatus
  dataset: SeedData | null
}

type Db = DbBase & Subscribable

const run = <Output>(fn: () => Output) => fn()

const initSubscribable = (): Subscribable => {
  const subscribers: Array<Callback> = []

  return {
    subscribe: (cb: Callback) => {
      subscribers.push(cb)
      return () => {
        let idx: number
        ;(idx = subscribers.indexOf(cb)) && subscribers.splice(idx)
      }
    },
    notify: () => subscribers.forEach(run),
  }
}

const initDb = (): Db => {
  const subscribable = initSubscribable()

  return {
    db: new PGlite(),
    status: DbStatus.Initializing,
    dataset: null,
    ...subscribable,
  }
}

const noop = () => undefined

const withStatusTransition =
  <Options extends [object] | []>(
    fn: (db: Db, ...options: Options) => void,
    {
      pendingStatus,
      finalStatus,
      errorMessage = 'Error',
      closeOnError = true,
      transitionOptions = noop,
    }: {
      pendingStatus: DbStatus
      finalStatus: DbStatus
      errorMessage?: string
      closeOnError?: boolean
      transitionOptions?: (db: Db) => object
    }
  ) =>
  async (...params: [Db, ...Options]) => {
    try {
      transition(db, db.status, pendingStatus, transitionOptions(db))
      await fn(...params)
      transition(db, db.status, finalStatus, transitionOptions(db))
    } catch (err) {
      console.error(`${errorMessage}: ${err}`)
      if (closeOnError) closeDbOnError(db)
    }
  }

type Sql = string

enum SeedData {
  Countries = 'countries',
}

const seedMap: Record<SeedData, Sql> = {
  [SeedData.Countries]: countriesSeed,
}

const setupDb = withStatusTransition(
  async (db: Db, { data }: { data: SeedData }) => {
    await db.db.query(seedMap[data])
  },
  {
    pendingStatus: DbStatus.SettingUp,
    finalStatus: DbStatus.Ready,
    transitionOptions: (db) => ({ dataset: db.dataset }),
    errorMessage: 'Error setting up DB',
  }
)

const closeDb = withStatusTransition(
  async (db: Db) => {
    if (db.status !== DbStatus.Closed) {
      await db.db.close()
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
