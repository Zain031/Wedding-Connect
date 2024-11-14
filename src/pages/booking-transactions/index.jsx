import { useEffect, useState } from 'react'
import { Link, useLoaderData, useSearchParams } from 'react-router-dom'
import { FilterSVG, SearchSVG } from '../../assets/svgs'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'

const statusColors = {
  PENDING: 'warning',
  REJECTED: 'error',
  WAITING_FOR_PAYMENT: 'info',
  CHECKING_PAYMENT: 'info',
  PAID: 'accent',
  CANCELED: 'error',
  FINISHED: 'success',
}
const statusLabels = {
  PENDING: 'pending',
  REJECTED: 'rejected',
  WAITING_FOR_PAYMENT: 'awaiting',
  CHECKING_PAYMENT: 'verifying',
  PAID: 'settlement',
  CANCELED: 'canceled',
  FINISHED: 'finished',
}
function TransactionsIndex() {
  const { data: orders, countOrderByStatus, paging } = useLoaderData()

  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(paging.page || 1)
  const [filter, setFilter] = useState({
    keyword: searchParams.get('keyword') || '',
    page: searchParams.get('page') || '',
    status: searchParams.get('status') || '',
    weddingPackageId: searchParams.get('weddingPackageId') || '',
    weddingOrganizerId: searchParams.get('weddingOrganizerId') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  })

  const updateFilter = (newFilter) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }))
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    updateFilter({ page })
  }

  useEffect(() => {
    const { keyword, status, weddingPackageId, weddingOrganizerId, startDate, endDate, page } = filter
    const params = {}

    if (keyword) params.keyword = keyword
    if (page) params.page = page
    if (status) params.status = status
    if (weddingPackageId) params.weddingPackageId = weddingPackageId
    if (weddingOrganizerId) params.weddingOrganizerId = weddingOrganizerId
    if (startDate) params.startDate = new Date(startDate).toISOString().split('T')[0] + 'T00:00:00'
    if (endDate) params.endDate = new Date(endDate).toISOString().split('T')[0] + 'T23:59:59'

    setSearchParams(params)
  }, [filter, setSearchParams])

  return (
    <Container>
      <Header title="Booking Transactions" />
      <div className="divider" />

      <FilterByStatus countOrderByStatus={countOrderByStatus} updateFilter={updateFilter} />

      {/* Table */}
      <div className="mt-5 overflow-x-visible rounded-xl bg-base-200 py-6 shadow-xl">
        <div className="mb-6 flex items-center justify-end gap-1 px-6">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="search..."
              value={filter.keyword}
              onChange={(e) => updateFilter({ keyword: e.target.value })}
            />
            <SearchSVG />
          </label>
          <Filter orders={orders} filter={filter} updateFilter={updateFilter} />
        </div>
        <table className="table table-zebra">
          <thead className="bg-base-100">
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Wedding Package</th>
              <th>Wedding Organizer</th>
              <th>Customer Name</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Booking Code</th>
              <th>Booking Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order?.id} className="bg-base-100">
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>{order?.weddingPackage.name}</td>
                <td>{order?.weddingOrganizer.name}</td>
                <td className="capitalize">{order.customer.name}</td>
                <td>
                  {order?.totalPrice?.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })}
                </td>
                <td>
                  <span className={`badge badge-outline badge-${statusColors[order?.status]} rounded-md font-semibold`}>
                    {statusLabels[order?.status]}
                  </span>
                </td>
                <td>{order.bookCode}</td>
                <td>
                  {new Date(order?.transactionDate).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
                <td>
                  <Link to={`/booking-transactions/${order?.id}`} className="btn btn-ghost btn-sm">
                    details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={paging.totalPages} onPageChange={handlePageChange} />
    </Container>
  )
}
const Filter = ({ orders, filter, updateFilter }) => {
  const countNonEmptyFilters = (filter) =>
    Object.entries(filter).filter(([key, value]) => key !== 'page' && value !== '').length
  const filterCount = countNonEmptyFilters(filter)

  const weddingPackages = Array.from(new Set(orders?.map((order) => order.weddingPackage?.id))).map(
    (id) => orders.find((order) => order.weddingPackage?.id === id)?.weddingPackage,
  )

  const statusOrders = {
    PENDING: 'warning',
    REJECTED: 'error',
    WAITING_FOR_PAYMENT: 'info',
    CHECKING_PAYMENT: 'info',
    PAID: 'success',
    CANCELED: 'error',
    FINISHED: 'success',
  }

  return (
    <div className="dropdown dropdown-end">
      <div className="indicator">
        <span className={`badge indicator-item badge-secondary badge-sm ${filterCount === 0 ? 'hidden' : ''}`}>
          {filterCount}
        </span>
        <div tabIndex={0} role="button" className="btn input input-bordered m-1">
          <FilterSVG />
        </div>
      </div>
      <div tabIndex={0} className="menu dropdown-content z-[1] w-[17rem] rounded-box bg-base-100 p-3 shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Filter</h3>
          <button
            className="btn btn-error btn-xs"
            onClick={() =>
              updateFilter({
                page: '',
                status: '',
                weddingPackageId: '',
                weddingOrganizerId: '',
                startDate: '',
                endDate: '',
              })
            }
          >
            Clear All Filter
          </button>
        </div>
        <hr className="my-2" />
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text-alt">Status</span>
            </div>
            <select
              className="select select-bordered select-sm"
              value={filter.status}
              onChange={(e) => updateFilter({ status: e.target.value })}
            >
              <option disabled value={''}>
                Pick one
              </option>
              {Object.keys(statusOrders).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text-alt">Wedding Package</span>
            </div>
            <select
              className="select select-bordered select-sm"
              value={filter.weddingPackageId}
              onChange={(e) => updateFilter({ weddingPackageId: e.target.value })}
            >
              <option value={''} disabled>
                Pick one
              </option>
              {weddingPackages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text-alt">Booking Date Start</span>
            </div>
            <input
              type="date"
              className="input input-sm input-bordered w-full"
              placeholder="Pick date"
              value={filter.startDate}
              onChange={(e) => updateFilter({ startDate: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text-alt">Booking Date End</span>
            </div>
            <input
              type="date"
              className="input input-sm input-bordered w-full"
              placeholder="Pick date"
              value={filter.endDate}
              onChange={(e) => updateFilter({ endDate: e.target.value })}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

const FilterByStatus = ({ countOrderByStatus, updateFilter }) => {
  return (
    <div className="mx-auto flex w-full max-w-fit items-center justify-center gap-3 rounded-xl bg-base-200 p-3">
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: '' })}>
        All
        <span className="badge badge-primary badge-md rounded-md">{countOrderByStatus.ALL}</span>
      </button>
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: 'PENDING' })}>
        Pending
        <span className="badge badge-warning badge-md rounded-md">{countOrderByStatus.PENDING}</span>
      </button>
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: 'FINISHED' })}>
        Finished
        <span className="badge badge-success badge-md rounded-md">{countOrderByStatus.FINISHED}</span>
      </button>
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: 'CANCELED' })}>
        Canceled
        <span className="badge badge-error badge-md rounded-md">{countOrderByStatus.CANCELED}</span>
      </button>
    </div>
  )
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-5 flex items-center justify-end">
      <div className="join">
        <button className="btn join-item" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          «
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`btn join-item ${currentPage === index + 1 ? 'btn-active' : ''}`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn join-item"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  )
}

export default TransactionsIndex
