import { stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')

const existsFile = async (fullPath: string) => {
  try {
    await stat(fullPath)
    return true
  } catch {
    return false
  }
}

export { ROOT_DIR, existsFile }
