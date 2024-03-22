import { SeedData, closeDb, initDb, setupDb } from './postgres'

let db

/**
 * Only initiate one because it's quite a hefty operation. Most tests are fine
 * operating against the same instance.
 *
 * Those that aren't can initiate their own local instance.
 */
beforeAll(async () => {
  db = initDb()
  // Running a select starts up the DB, which is a slow operation
  await db.db.query('select 1')
}, 10_000)

afterAll(async () => {
  /**
   * TODO: Should probably clean up but can't figure out how to catch error
   * thrown by the WASM process exiting.
   */
  // await closeDb(db)
})

describe('basic db functionality', () => {
  it('can select', async () => {
    const result = await db.db.query('select 1')
    expect(result).toStrictEqual([{ '?column?': 1 }])
  })
})

describe('seeded data', () => {
  beforeAll(async () => {
    await setupDb(db, { data: SeedData.Countries })
  })

  it('can query seeded data', async () => {
    const result = await db.db.query('select name from countries order by name limit 1')
    expect(result).toStrictEqual([{ name: 'Afghanistan' }])
  })
})
