import { readFile } from 'node:fs/promises'
import { EOL } from 'node:os'
import { join, sep } from 'node:path'
import { DOCS_DIR } from '~/features/helpers.fs'

const PARTIAL_REGEX = /(?<=^|\n)([^\S\r\n]*)<\s*?Partial\s+?path\s*?=\s*?(['"])[\w\/-]+\2[^>]*\/>/g

const _swapPartials = async (original: string, replace: (spliced: string) => Promise<string>) => {
  let replaced = original
  const regex = new RegExp(PARTIAL_REGEX)

  let match: RegExpExecArray | null
  while ((match = regex.exec(replaced)) !== null) {
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

const _extractSubstitutions = (tag: string) => {
  const regex = /substitutions\s*?=\s*?\{(\{[^}]+(?:\}[^\}][^}]*)*?\})\}\s+/
  const subs = tag.match(regex)?.[1]
  if (!subs) return null

  try {
    const json = subs.replace(/(['"])?([a-zA-Z0-9]+)\1:/g, '"$2":')
    return JSON.parse(json)
  } catch (err) {
    throw Error(`Error parsing props for tag ${tag}`, { cause: err })
  }
}

const _replaceSubstitutions = (str: string, substitutions: Record<string, unknown>) => {
  let replaced = str
  const regex = /\{\s*substitution\.([^\s\}]+)\s*\}/g

  let match: RegExpExecArray | null
  while ((match = regex.exec(replaced)) !== null) {
    const idx = match.index
    const splicedOut = match[0]
    const key = match[1]

    const valueAsAny = substitutions[key]
    if (valueAsAny === undefined) {
      throw Error(`Missing substitution for key ${key}`)
    }
    const value = String(valueAsAny)

    replaced = replaced.substring(0, idx) + value + replaced.substring(idx + splicedOut.length)
    regex.lastIndex += value.length - splicedOut.length
  }

  return replaced
}

const _getPartialContent = async (tag: string) => {
  try {
    const filePath = _getPartialPath(tag)
    const content = (await readFile(filePath, 'utf8')).trim()

    const substitutions = _extractSubstitutions(tag)
    return substitutions ? _replaceSubstitutions(content, substitutions) : content
  } catch (err) {
    throw Error(`Error getting partial content from ${tag}`, { cause: err })
  }
}

const fillOutPartials = async (content: string) => {
  let replaced = content

  do {
    replaced = await _swapPartials(replaced, _getPartialContent)
  } while (PARTIAL_REGEX.test(replaced))

  return replaced
}

export {
  _swapPartials,
  _getPartialPath,
  _extractSubstitutions,
  _replaceSubstitutions,
  fillOutPartials,
}
