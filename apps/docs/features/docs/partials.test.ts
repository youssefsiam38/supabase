import { join } from 'node:path'
import { DOCS_DIR } from '~/features/helpers.fs'
import {
  _extractSubstitutions,
  _getPartialPath,
  _replaceSubstitutions,
  _swapPartials,
} from './partials'

describe('Partials are detected in MDX content', () => {
  it('Partial is detected and replaced with substitute string', async () => {
    const mdx = `
Here is an MDX document containing a partial:

<Partial path="some/path/to/file" />

Some text after.
	`.trim()

    const substitution = 'Substitution'

    const expected = `
Here is an MDX document containing a partial:

${substitution}

Some text after.
	`.trim()

    const actual = await _swapPartials(mdx, async () => substitution)
    expect(actual).toBe(expected)
  })

  it('Partial is detected if it uses single quotes', async () => {
    const mdx = `
Here is an MDX document containing a partial:

<Partial path='some/path/to/file' />

Some text after.
	`.trim()

    const substitution = 'Substitution'

    const expected = `
Here is an MDX document containing a partial:

${substitution}

Some text after.
	`.trim()

    const actual = await _swapPartials(mdx, async () => substitution)
    expect(actual).toBe(expected)
  })

  it('Partial substitution accounts for indentation', async () => {
    const mdx = `
Here is an MDX Document containing some indentation:

1. List item one

   <Partial path="some/path/to/file" />

   List item one continued

1. List item two
      `.trim()

    const substitution = `
Here is a multi-line
substitution.

It also has blank lines.
	  `.trim()

    const expected = `
Here is an MDX Document containing some indentation:

1. List item one

   Here is a multi-line
   substitution.

   It also has blank lines.

   List item one continued

1. List item two
	`.trim()

    const actual = await _swapPartials(mdx, async () => substitution)
    expect(actual).toBe(expected)
  })

  it('Partial substitution accounts for whitespace in tag', async () => {
    const mdx = `
Here is a partial with some whitespace:

<Partial
  path = "path/to/some/file"
/>
	  `.trim()

    const expected = `
Here is a partial with some whitespace:

Substitution
      `.trim()

    const actual = await _swapPartials(mdx, async () => 'Substitution')
    expect(actual).toBe(expected)
  })

  it('Partials are not replaced if not separated by newlines', async () => {
    const mdx = `Here is an inline <Partial path="path/to/some/file" />.`

    const actual = await _swapPartials(mdx, async () => 'Substitution')
    expect(actual).toBe(mdx)
  })

  it('All partials are replaced if there is more than one', async () => {
    const mdx = `
Partial one:

<Partial path="one" />

Some more text:

<Partial path="two" />
	  `.trim()

    const expected = `
Partial one:

one

Some more text:

two
	  `.trim()

    const actual = await _swapPartials(mdx, async (str) => str.match(/"(\w+)"/)?.[1] ?? '')
    expect(actual).toBe(expected)
  })

  it('All partials are replaced if there is more than one and they are consecutive', async () => {
    const mdx = `
Partial one:

<Partial path="one" />

<Partial path="two" />
	  `.trim()

    const expected = `
Partial one:

one

two
	  `.trim()

    const actual = await _swapPartials(mdx, async (str) => str.match(/"(\w+)"/)?.[1] ?? '')
    expect(actual).toBe(expected)
  })
})

describe('Extract path from partial tag', () => {
  it('Correct path is extracted from partial tag', () => {
    const tag = `<Partial path="path/to/some/file" />`
    const expected = join(DOCS_DIR, 'content/partials/path/to/some/file.mdx')
    const actual = _getPartialPath(tag)
    expect(actual).toBe(expected)
  })

  it('Correct path is extracted from partial tag if it uses single quotes', () => {
    const tag = `<Partial path='path/to/some/file' />`
    const expected = join(DOCS_DIR, 'content/partials/path/to/some/file.mdx')
    const actual = _getPartialPath(tag)
    expect(actual).toBe(expected)
  })
})

describe('Extract substitutions from partial tag', () => {
  it('Returns null if no substitutions', () => {
    const tag = `<Partial substitutions="no-props" />`
    const expected = null
    const actual = _extractSubstitutions(tag)
    expect(actual).toEqual(expected)
  })

  it('Correctly parses substitutions', () => {
    const tag = `<Partial path="lalala" substitutions = {{ provider: "Google", number: 8.2 }} />`
    const expected = {
      provider: 'Google',
      number: 8.2,
    }
    const actual = _extractSubstitutions(tag)
    expect(actual).toEqual(expected)
  })

  it('Correctly parses substitutions with quoted keys', () => {
    const tag = `<Partial path="lalala" substitutions = {{ "provider": "Google"}} />`
    const expected = {
      provider: 'Google',
    }
    const actual = _extractSubstitutions(tag)
    expect(actual).toEqual(expected)
  })
})

describe('Replace substitutions', () => {
  it('Correctly replaces a string substitution', () => {
    const subs = { wizard: 'Radagast the Brown' }
    const str = '{substitution.wizard} is a wizard'
    const expected = 'Radagast the Brown is a wizard'
    const actual = _replaceSubstitutions(str, subs)
    expect(actual).toBe(expected)
  })

  it('Correctly replaces a number substitution', () => {
    const subs = { pi: 3.14 }
    const str = 'The value of pi is {substitution.pi}.'
    const expected = 'The value of pi is 3.14.'
    const actual = _replaceSubstitutions(str, subs)
    expect(actual).toBe(expected)
  })

  it('Correctly replaces a substitution with extra whitespace', () => {
    const subs = { wizard: 'Radagast the Brown' }
    const str = '{ substitution.wizard } is a wizard'
    const expected = 'Radagast the Brown is a wizard'
    const actual = _replaceSubstitutions(str, subs)
    expect(actual).toBe(expected)
  })

  it('Correctly ignores extra substitutions', () => {
    const subs = { wizard: 'Radagast the Brown', forest: 'Mirkwood' }
    const str = '{substitution.wizard} is a wizard'
    const expected = 'Radagast the Brown is a wizard'
    const actual = _replaceSubstitutions(str, subs)
    expect(actual).toBe(expected)
  })

  it('Correctly throws if missing substitutions', () => {
    const subs = { unused: 'something' }
    const str = '{substitution.wizard} is a wizard'
    expect(() => _replaceSubstitutions(str, subs)).toThrow()
  })

  it('Correctly replaces multiple substitutions', () => {
    const subs = { elves: 3, dwarves: 7 }
    const str = `
{substitution.elves} rings for the Elven kings under the sky,
{substitution.dwarves} for the Dwarf lords in their halls of stone...
	`.trim()
    const expected = `
3 rings for the Elven kings under the sky,
7 for the Dwarf lords in their halls of stone...
	`.trim()
    const actual = _replaceSubstitutions(str, subs)
    expect(actual).toBe(expected)
  })

  it('Correctly replaces the same substitution multiple times', () => {
    const subs = { three: 3 }
    const str = `{substitution.three} x {substitution.three} = 9`
    const expected = '3 x 3 = 9'
    const actual = _replaceSubstitutions(str, subs)
    expect(actual).toBe(expected)
  })
})
