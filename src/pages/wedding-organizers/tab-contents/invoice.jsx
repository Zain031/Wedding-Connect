import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getSubscriptions } from '../../../api/subscriptions'
import Container from '../../../components/container'
import Loading from '../../../components/loading'

export default function Invoice() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filter, setFilter] = useState({
    keyword: searchParams.get('keyword') || '',
    page: searchParams.get('page') || '',
    status: searchParams.get('status') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  })
  const updateFilter = (newFilter) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }))
  }

  useEffect(() => {
    const { keyword, status, startDate, endDate, page } = filter
    const params = {}

    if (keyword) params.keyword = keyword
    if (status) params.status = status
    if (startDate) params.startDate = startDate
    if (endDate) params.endDate = endDate
    if (page) params.page = page

    setSearchParams(params)
  }, [filter, setSearchParams])

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true)
      try {
        const request = { url: `${window.location.origin}${window.location.pathname}?${searchParams.toString()}` }
        const response = await getSubscriptions({ request })
        setInvoices(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [searchParams])

  useEffect(() => {
    setLoading(false)
  }, [searchParams])

  return (
    <Container>
      <h2 className="text-2xl font-bold">Invoices</h2>
      <p className="text-sm italic opacity-55">This section contains history of your subscription transactions.</p>
      <div className="divider my-1" />
      <InvoiceTable invoices={invoices} loading={loading} />
    </Container>
  )
}

const InvoiceTable = ({ invoices, loading }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Invoice Id</th>
            <th>Status</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Payment Image</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className="bg-base-100">
              <th className="text-center" colSpan={6}>
                <div className="flex items-center justify-center">
                  <Loading />
                </div>
              </th>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice?.id}</td>
                <td>
                  <span
                    className={`badge badge-${invoice?.paymentStatus === 'CONFIRMED' ? 'success' : 'warning'} badge-md rounded-md font-semibold`}
                  >
                    {invoice?.paymentStatus === 'CONFIRMED' ? 'settelement' : 'pending'}
                  </span>
                </td>
                <td>Subscription Plan: {invoice?.subscriptionPacket?.name}</td>
                <td>
                  {new Date(invoice?.transactionDate).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm">See Payment Proof</button>
                </td>
                <td>
                  <p className="font-bold">
                    {invoice?.totalPaid.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                  </p>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
