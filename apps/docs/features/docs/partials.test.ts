import { join } from 'node:path'
import { DOCS_DIR } from '~/features/helpers.fs'
import { _getPartialPath, _swapPartials } from './partials'

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
    expect(actual).toEqual(expected)
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
    expect(actual).toEqual(expected)
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
    expect(actual).toEqual(expected)
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
    expect(actual).toEqual(expected)
  })

  it('Partials are not replaced if not separated by newlines', async () => {
    const mdx = `Here is an inline <Partial path="path/to/some/file" />.`

    const actual = await _swapPartials(mdx, async () => 'Substitution')
    expect(actual).toEqual(mdx)
  })
})

describe('Extract path from partial tag', () => {
  it('Correct path is extracted from partial tag', () => {
    const tag = `<Partial path="path/to/some/file" />`
    const expected = join(DOCS_DIR, 'content/partials/path/to/some/file.mdx')
    const actual = _getPartialPath(tag)
    expect(actual).toEqual(expected)
  })

  it('Correct path is extracted from partial tag if it uses single quotes', () => {
    const tag = `<Partial path='path/to/some/file' />`
    const expected = join(DOCS_DIR, 'content/partials/path/to/some/file.mdx')
    const actual = _getPartialPath(tag)
    expect(actual).toEqual(expected)
  })
})
