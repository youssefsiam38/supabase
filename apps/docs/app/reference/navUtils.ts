import { flow } from 'lodash'
import { MenuItem } from '~/componentsV2/navigation/navTypes'
import commonClientLibSections from '~/spec/common-client-libs-sections.json'

/******************************************************************************
 * Types
 ******************************************************************************/

type CommonClientSpecSections = typeof commonClientLibSections
type CommonClientSpecSection = CommonClientSpecSections[number]

type CategorizedSection = { section: null | string; pages: CommonClientSpecSection[] }

/******************************************************************************
 * Utils
 ******************************************************************************/

function* iterAnonCategory(specSections: CommonClientSpecSections, startIndex = 0) {
  let index = startIndex

  while (index < specSections.length && specSections[index].type !== 'category') {
    yield index
    index++
  }
}

/******************************************************************************
 * Pipeline
 ******************************************************************************/

function clone<T>(struct: T) {
  return structuredClone(struct)
}

function createRemoveExcluder(excludedName: string) {
  return function removeExcludes(specSections: CommonClientSpecSections) {
    for (let i = 0; i < specSections.length; i++) {
      const section = specSections[i]
      if ('excludes' in section && section.excludes?.includes(excludedName)) {
        specSections.splice(i, 1)
        // correct the index since item is now gone
        i--
      } else if (section.items) {
        // @ts-expect-error -- TS not catching the truthy check above
        removeExcludes(section.items)
      }
    }

    return specSections
  }
}

function collectCategories(specSections: CommonClientSpecSections) {
  const result: CategorizedSection[] = []

  let index = 0
  while (index < specSections.length) {
    const currentCategory = { section: null, pages: [] } as CategorizedSection

    if (specSections[index].type === 'category') {
      // named category, add directly to results
      currentCategory.section = specSections[index].title
      if (specSections[index].items) {
        // @ts-expect-error -- TS not catching the truthy check above
        currentCategory.pages = specSections[index].items
        result.push(currentCategory)
      }
      index++
    } else {
      // anonymous category, collect members
      const getAnonCategoryMembers = iterAnonCategory(specSections, index)

      let current: IteratorResult<number, void>
      let lastValidIndex = index
      while (!(current = getAnonCategoryMembers.next()).done) {
        currentCategory.pages.push(specSections[current.value])
        lastValidIndex = current.value
      }

      result.push(currentCategory)
      index = lastValidIndex + 1
    }
  }

  return result
}

function createReformatter(pagePath: `/${string}`) {
  // Some ts-ignoring needed in this function because it mutates
  // a CategorizedSection[] to a MenuItem[], so the typing is
  // a hybrid somewhere in the middle
  return function reformat(categoryColl: CategorizedSection[]) {
    for (const category of categoryColl) {
      const newPages: MenuItem[] = category.pages.map(function formatPage(page) {
        const newPage = {
          label: page.title,
          href: (pagePath + ('slug' in page ? `#${page.slug}` : '')) as `/${string}`,
        } as MenuItem
        if (page.items) {
          // @ts-ignore
          newPage.pages = page.items.map(formatPage)
        }

        return newPage
      })

      // @ts-ignore
      category.pages = newPages
    }

    return categoryColl as unknown as MenuItem[]
  }
}

export function toNavMenu({
  excludedName,
  pagePath,
}: {
  excludedName: string
  pagePath: `/${string}`
}) {
  return flow([
    clone,
    createRemoveExcluder(excludedName),
    collectCategories,
    createReformatter(pagePath),
  ])(commonClientLibSections) as ReturnType<ReturnType<typeof createReformatter>>
}
