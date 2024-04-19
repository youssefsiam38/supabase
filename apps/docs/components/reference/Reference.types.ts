import { type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { enrichedOperation } from '~/lib/refGenerator/helpers'

export interface ISpec {
  openref: any
  info: {
    id: string
    title: string
    description: string
    definition: string
    libraries: any
    slugPrefix: string
    specUrl: string
  }
  functions: IFunctionDefinition[]
}

export interface IAPISpec {
  info: {
    title: string
    description?: string
    version: string
    contact?: {}
  }
  operations: enrichedOperation[]
  sections: any
}

export interface IFunctionDefinition {
  title: string
  id: string
  $ref: string
  description: string
  examples?: []
}

export interface ICommonBase {
  type: string
  title: string
  summary?: string
}

export interface ICommonBaseSection extends ICommonBase {
  id: string
  slug: string
  excludes?: string[]
}

export interface ICommonCategory extends ICommonBase {
  type: 'category'
  items: ICommonSection[]
  excludes?: string[]
}

export interface ICommonMarkdown extends ICommonBaseSection {
  type: 'markdown'
}

export interface ICommonFunctionGroup extends ICommonBaseSection {
  type: 'function'
  isFunc: false
  product: string
  items: ICommonFunction[]
}

export interface ICommonFunction extends ICommonBaseSection {
  type: 'function'
  product: string
  parent?: string
  description?: string
  notes?: string
}

export interface ICommonCliCommand extends ICommonBaseSection {
  type: 'cli-command'
}

export interface ICommonApiOperation extends ICommonBaseSection {
  type: 'operation'
}

export type ICommonSection =
  | ICommonMarkdown
  | ICommonFunctionGroup
  | ICommonFunction
  | ICommonCliCommand
  | ICommonApiOperation

export type ICommonItem = ICommonCategory | ICommonSection

export interface IRefFunctionSection {
  funcData: any
  commonFuncData: ICommonFunction
  spec: any
}

export interface ICompiledMarkdown extends ICommonMarkdown {
  __EMPTY: boolean
  compiled?: MDXRemoteSerializeResult
  meta?: Record<string, unknown>
}

export interface IAnnotatedFunction extends ICommonFunction {
  __EMPTY: boolean
  details?: any
}

export type IProcessedCommonSection =
  | Exclude<ICommonSection, ICommonMarkdown | ICommonFunction>
  | ICompiledMarkdown
  | IAnnotatedFunction

export type IProcessedCommonItem = ICommonCategory | ICommonSection

export interface IRefStaticDoc {
  id: string
  title: string
  meta: {
    id: string
    title: string
    hideTitle: boolean
  }
  content: {
    compiledSource: string
    frontmatter: {}
    scope: {}
  }
}
