import ReactMarkdown from 'react-markdown'
import { storageErrorCodes } from '~/content/troubleshooting/error-codes.storage'
import type { ErrorCode } from '~/content/troubleshooting/error-codes.types'

type ErrorCodesProduct = 'storage'

const productCodesMap: Record<ErrorCodesProduct, ErrorCode[]> = {
  storage: storageErrorCodes,
}

const ErrorCodesTable = ({ product }: { product: ErrorCodesProduct }) => (
  <table>
    <thead>
      <tr>
        <th>ErrorCode</th>
        <th>Description</th>
        <th>StatusCode</th>
        <th className="w-1/3">Resolution</th>
      </tr>
    </thead>
    <tbody>
      {productCodesMap[product].map((errorCode) => (
        <tr key={errorCode.errorCode}>
          <td>{errorCode.errorCode}</td>
          <td>{errorCode.description}</td>
          <td>{errorCode.statusCode ?? '-'}</td>
          <td>
            <ReactMarkdown>{errorCode.resolution}</ReactMarkdown>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

export { ErrorCodesTable }
