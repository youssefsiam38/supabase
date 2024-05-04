import { readFile } from 'node:fs/promises'
import { EOL } from 'node:os'
import { join, sep } from 'node:path'
import { DOCS_DIR } from '~/features/helpers.fs'

const _swapPartials = async (original: string, replace: (spliced: string) => Promise<string>) => {
  let replaced = original
  const regex = /(?<=^|\n)([^\S\r\n]*)<\s*?Partial\s+?path\s*?=\s*?(['"])[\w\/-]+\2[^>]*\/>/g

  let match: RegExpExecArray | null
  while ((match = regex.exec(original)) !== null) {
    const spliceOut = match[0]
    const indent = match[1]

    const substitution = await replace(spliceOut)
    const indentedSubstitution = substitution
      .split(EOL)
      .map((line) => line && `${indent}${line}`)
      .join(EOL)

    replaced =
      replaced.substring(0, match.index) +
      indentedSubstitution +
      replaced.substring(match.index + spliceOut.length)

    regex.lastIndex += indentedSubstitution.length - spliceOut.length
  }

  return replaced
}

const _getPartialPath = (tag: string) => {
  const regex = /<\s*?Partial\s+?path\s*?=\s*?(['"])([^\s\1]+)\1[^>]*\/>/
  const PARTIALS_DIR = join(DOCS_DIR, 'content', 'partials')

  const relPath = tag.match(regex)?.[2]
  if (!relPath) throw Error(`The path could not be extracted from the partial tag ${tag}`)

  return join(PARTIALS_DIR, `${relPath.replaceAll('/', sep)}.mdx`)
}

const getPartialContent = async (relPath: string) => {
  try {
    const filePath = _getPartialPath(relPath)
    const content = await readFile(filePath, 'utf8')
    return content
  } catch (err) {
    throw Error(`Error getting partial content from ${relPath}`, { cause: err })
  }
}

const fillOutPartials = (content: string) => _swapPartials(content, getPartialContent)

export { _swapPartials, _getPartialPath, fillOutPartials }
