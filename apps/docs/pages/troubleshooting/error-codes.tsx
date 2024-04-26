import { ChevronDown } from 'lucide-react'
import { type PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Input_Shadcn_,
  SelectContent_Shadcn_,
  SelectItem_Shadcn_,
  SelectTrigger_Shadcn_,
  SelectValue_Shadcn_,
  Select_Shadcn_,
  cn,
} from 'ui'
import { MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import { postgrestErrorCodes } from '~/content/troubleshooting/error-codes.postgrest'
import { storageErrorCodes } from '~/content/troubleshooting/error-codes.storage'
import type { ErrorCode } from '~/content/troubleshooting/error-codes.types'
import Layout from '~/layouts/DefaultGuideLayout'

/**
 * TODO What does the mobile version look like?
 */

const products = ['database', 'storage'] as const
type Product = (typeof products)[number]

const meta = {
  title: 'Error codes',
  description:
    'Definitions of standardized error codes for Supabase products and their recommended resolutions',
}

const leadingCap = (str: string) => (!str ? str : str[0].toUpperCase() + str.substring(1))

const ErrorCodesPage = () => (
  <Layout meta={meta} hideToc={true} menuId={MenuId.Troubleshooting}>
    <p>something something standardized error codes</p>
    <ErrorCodesReference />
  </Layout>
)

const ErrorCodesReferenceCtx = createContext<{
  productFilter: Product | undefined
  statusCodeFilter: number | undefined
  searchTerm: string
}>({
  productFilter: undefined,
  statusCodeFilter: undefined,
  searchTerm: '',
})

const ErrorCodesReference = () => {
  const [productFilter, setProductFilter] = useState<Product>()
  const [statusCodeFilter, setStatusCodeFilter] = useState<number>()
  const [searchTerm, setSearchTerm] = useState('')

  const ctx = useMemo(
    () => ({
      productFilter,
      statusCodeFilter,
      searchTerm,
    }),
    [productFilter, statusCodeFilter, searchTerm]
  )

  return (
    <ErrorCodesReferenceCtx.Provider value={ctx}>
      <section aria-labelledby="error-codes-reference-table-title" className="mr-12">
        <h2 id="error-codes-reference-table-title" className="mb-12">
          Error codes reference
        </h2>
        <div
          className={cn(
            'mb-12',
            'flex flex-wrap [--albatross:calc(550px-100%)] gap-6',
            '[&>*]:grow [&>*]:basis-[calc(var(--albatross)*999)]'
          )}
        >
          <LabelledInput label="Filter by product">
            <Selector
              options={['None', ...products]}
              defaultValue="None"
              onValueChange={(value) =>
                setProductFilter(value === 'None' ? undefined : (value as Product))
              }
            />
          </LabelledInput>
          <LabelledInput label="Filter by status code">
            <Input_Shadcn_
              onChange={(evt) =>
                setStatusCodeFilter(
                  Number.isNaN(Number(evt.currentTarget.value))
                    ? undefined
                    : Number(evt.currentTarget.value)
                )
              }
            />
          </LabelledInput>
          <LabelledInput label="Search error code">
            <Input_Shadcn_ onChange={(evt) => setSearchTerm(evt.currentTarget.value)} />
          </LabelledInput>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Error code</th>
              <th>Status code</th>
              <th>Description</th>
              <th className="sr-only">Toggle</th>
            </tr>
          </thead>
          <tbody>
            {postgrestErrorCodes.map((errorCode) => (
              <ErrorCodesRow key={errorCode.errorCode} product="database" errorCode={errorCode} />
            ))}
            {storageErrorCodes.map((errorCode) => (
              <ErrorCodesRow key={errorCode.errorCode} product="storage" errorCode={errorCode} />
            ))}
          </tbody>
        </table>
      </section>
    </ErrorCodesReferenceCtx.Provider>
  )
}

const LabelledInput = ({ label, children }: PropsWithChildren<{ label: string }>) => (
  <div className="flex flex-col gap-2">
    <span>{label}</span>
    {children}
  </div>
)

const Selector = ({
  options,
  defaultValue,
  onValueChange,
}: {
  options: string[]
  defaultValue: string
  onValueChange: (value: string) => void
}) => (
  <Select_Shadcn_ defaultValue={defaultValue} onValueChange={onValueChange}>
    <SelectTrigger_Shadcn_ className="leading-5 h-[unset]">
      <SelectValue_Shadcn_ />
    </SelectTrigger_Shadcn_>
    <SelectContent_Shadcn_>
      {options.map((option) => (
        <SelectItem_Shadcn_ value={option}>{leadingCap(option)}</SelectItem_Shadcn_>
      ))}
    </SelectContent_Shadcn_>
  </Select_Shadcn_>
)

const ErrorCodesRow = ({ product, errorCode }: { product: Product; errorCode: ErrorCode }) => {
  const { productFilter, statusCodeFilter, searchTerm } = useContext(ErrorCodesReferenceCtx)
  const [showResolution, setShowResolution] = useState(false)

  const visible =
    (!productFilter || productFilter === product) &&
    (!statusCodeFilter || errorCode.statusCode?.includes(statusCodeFilter.toString())) &&
    (!searchTerm || errorCode.errorCode.toLowerCase().includes(searchTerm.toLowerCase())) // should use trigram match

  return (
    visible && (
      <>
        <tr>
          <td>{leadingCap(product)}</td>
          <td>{errorCode.errorCode ?? '-'}</td>
          <td>{errorCode.statusCode ?? '-'}</td>
          <td>{errorCode.description ?? '-'}</td>
          <td className="align-middle">
            {errorCode.resolution && (
              <button
                className="align-middle"
                aria-label={`${showResolution ? 'Hide' : 'Show'} recommended resolution in next row`}
                aria-expanded={showResolution}
                onClick={() => setShowResolution((show) => !show)}
              >
                <ChevronDown
                  strokeWidth={1}
                  className={cn(showResolution && 'rotate-180', 'transition-transform')}
                />
              </button>
            )}
          </td>
        </tr>
        {showResolution && (
          <tr>
            <td colSpan={5}>
              <h6 className="m-0">Resolution</h6>
              <ReactMarkdown>{errorCode.resolution}</ReactMarkdown>
            </td>
          </tr>
        )}
      </>
    )
  )
}

export default ErrorCodesPage
