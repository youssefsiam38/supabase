import { createContext, useContext, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  Input_Shadcn_,
  SelectContent_Shadcn_,
  SelectItem_Shadcn_,
  SelectTrigger_Shadcn_,
  SelectValue_Shadcn_,
  Select_Shadcn_,
} from 'ui'
import { MenuId } from '~/components/Navigation/NavigationMenu/NavigationMenu'
import { storageErrorCodes } from '~/content/troubleshooting/error-codes.storage'
import type { ErrorCode } from '~/content/troubleshooting/error-codes.types'
import Layout from '~/layouts/DefaultGuideLayout'

/**
 * TODO What does the mobile version look like?
 */

const products = ['storage'] as const
type Product = (typeof products)[number]

const meta = {
  title: 'Error codes',
  description:
    'Definitions of standardized error codes for Supabase products and their recommended resolutions',
}

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
      <section aria-labelledby="error-codes-reference-table-title">
        <h2 id="error-codes-reference-table-title" className="sr-only">
          Error codes reference table
        </h2>
        <div className="flex gap-2">
          <Selector
            options={['None', ...products]}
            placeholder="Filter by product"
            onValueChange={(value) =>
              setProductFilter(value === 'None' ? undefined : (value as Product))
            }
          />
          <Input_Shadcn_
            onChange={(evt) =>
              setStatusCodeFilter(
                Number.isNaN(Number(evt.currentTarget.value))
                  ? undefined
                  : Number(evt.currentTarget.value)
              )
            }
          />
          <Input_Shadcn_ onChange={(evt) => setSearchTerm(evt.currentTarget.value)} />
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Error code</th>
              <th>Status code</th>
              <th>Description</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {storageErrorCodes.map((errorCode) => (
              <ErrorCodesRow key={errorCode.errorCode} product="storage" errorCode={errorCode} />
            ))}
          </tbody>
        </table>
      </section>
    </ErrorCodesReferenceCtx.Provider>
  )
}

const Selector = ({
  options,
  placeholder,
  onValueChange,
}: {
  options: string[]
  placeholder: string
  onValueChange: (value: string) => void
}) => (
  <Select_Shadcn_ onValueChange={onValueChange}>
    <SelectTrigger_Shadcn_>
      <SelectValue_Shadcn_ placeholder={placeholder} />
    </SelectTrigger_Shadcn_>
    <SelectContent_Shadcn_>
      {options.map((option) => (
        <SelectItem_Shadcn_ value={option}>{option}</SelectItem_Shadcn_>
      ))}
    </SelectContent_Shadcn_>
  </Select_Shadcn_>
)

const ErrorCodesRow = ({ product, errorCode }: { product: Product; errorCode: ErrorCode }) => {
  const { productFilter, statusCodeFilter, searchTerm } = useContext(ErrorCodesReferenceCtx)

  const visible =
    (!productFilter || productFilter === product) &&
    (!statusCodeFilter || errorCode.statusCode?.toString().includes(statusCodeFilter.toString())) &&
    (!searchTerm || errorCode.errorCode.toLowerCase().includes(searchTerm.toLowerCase())) // should use trigram match

  return (
    visible && (
      <tr>
        <td>{product[0].toUpperCase() + product.substring(1)}</td>
        <td>{errorCode.errorCode}</td>
        <td>{errorCode.statusCode}</td>
        <td>{errorCode.description}</td>
        <td>
          <ReactMarkdown>{errorCode.resolution}</ReactMarkdown>
        </td>
      </tr>
    )
  )
}

export default ErrorCodesPage
