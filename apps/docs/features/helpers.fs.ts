import { stat } from 'fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'url'

const DOCS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')

const existsFile = async (fullPath: string) => {
  try {
    await stat(fullPath)
    return true
  } catch {
    return false
  }
}

export { DOCS_DIR, existsFile }
