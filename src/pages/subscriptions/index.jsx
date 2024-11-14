import { useEffect, useState } from 'react'
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { confirmSubscriptionPayment } from '../../api/subscriptions'
import { FilterSVG, SearchSVG } from '../../assets/svgs'
import Container from '../../components/container'
import Loading from '../../components/loading'
import ModalPreviewImage from '../../components/modal-preview-image'
import Hearder from '../../layouts/partials/header'

const apiUrl = import.meta.env.VITE_API_URL
export default function Subscriptions() {
  const { data: orders, countSubscriptionPaymentStatus, paging } = useLoaderData()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(paging.page || 1)
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
    updateFilter({ page })
  }

  const handleConfirmPayment = async (orderId) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Confirm Payment?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm',
    })

    if (isConfirmed) {
      try {
        const { success, message } = await confirmSubscriptionPayment(orderId)
        if (!success) throw new Error(message)

        await Swal.fire('Success', 'Payment Confirmed', 'success')
      } catch (error) {
        await Swal.fire('Error', error.message, 'error')
      } finally {
        navigate('.', { replace: true })
      }
    }
  }

  useEffect(() => {
    const { keyword, page, status, startDate, endDate } = filter
    const params = {}

    if (keyword) params.keyword = keyword
    if (page) params.page = page
    if (status) params.status = status
    if (startDate) params.startDate = new Date(startDate).toISOString().split('T')[0] + 'T00:00:00'
    if (endDate) params.endDate = new Date(endDate).toISOString().split('T')[0] + 'T23:59:59'

    setLoading(true)
    setSearchParams(params)
  }, [filter, setSearchParams])

  useEffect(() => {
    setLoading(false)
  }, [searchParams])

  return (
    <Container>
      <Hearder title="Subscriptions Orders" />
      <div className="divider" />

      <FilterByStatus countSubscriptionPaymentStatus={countSubscriptionPaymentStatus} updateFilter={updateFilter} />

      <div className="mt-5 overflow-x-visible rounded-xl bg-base-200 py-6 shadow-xl">
        <div className="mb-6 flex items-center justify-end gap-1 px-6">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="search..." />
            <SearchSVG />
          </label>
          <Filter filter={filter} updateFilter={updateFilter} />
        </div>
        <table className="table table-zebra">
          <thead className="bg-base-100">
            <tr>
              <th className="w-24">Order Id</th>
              <th>Wedding Organizer&apos;s Name</th>
              <th>Subscription Plan</th>
              <th>Price</th>
              <th>Receipt</th>
              <th>Status</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <Loading />
                </td>
              </tr>
            ) : (
              orders.map((item) => (
                <tr key={item.id} className="bg-base-100">
                  <th>{item?.id}</th>
                  <td>{item?.weddingOrganizer.name}</td>
                  <td>{item?.subscriptionPacket.name}</td>
                  <td>
                    {item?.totalPaid.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => document.getElementById('preview_image_modal').showModal()}
                    >
                      See Receipt
                    </button>
                    <ModalPreviewImage image={`${apiUrl}/${item?.paymentImage?.url}`} />
                  </td>
                  <td>
                    <span
                      className={`badge badge-${item?.paymentStatus === 'CONFIRMED' ? 'success' : 'info'} badge-outline rounded-md font-semibold`}
                    >
                      {item?.paymentStatus === 'CONFIRMED' ? 'settelement' : 'pending'}
                    </span>
                  </td>
                  <td>
                    {new Date(item?.transactionDate).toLocaleString('id-ID', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td>
                    {item?.paymentStatus === 'PAID' && (
                      <button
                        className="btn btn-outline btn-warning btn-sm"
                        onClick={() => handleConfirmPayment(item?.id)}
                      >
                        Confirm Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={paging.totalPages} onPageChange={handlePageChange} />
    </Container>
  )
}

const Filter = ({ filter, updateFilter }) => {
  const countNonEmptyFilters = (filter) =>
    Object.entries(filter).filter(([key, value]) => key !== 'page' && value !== '').length
  const filterCount = countNonEmptyFilters(filter)

  const statusOrders = {
    PAID: 'info',
    CONFIRMED: 'success',
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
      <div tabIndex={0} className="menu dropdown-content z-[1] w-52 rounded-box bg-base-100 p-3 shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Filter</h3>
          <button
            className="btn btn-error btn-xs"
            onClick={() =>
              updateFilter({
                status: '',
                page: '',
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
              <span className="label-text-alt">Transaction Date Start</span>
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
              <span className="label-text-alt">Transaction Date End</span>
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

const FilterByStatus = ({ countSubscriptionPaymentStatus, updateFilter }) => {
  return (
    <div className="mx-auto flex max-w-fit items-center justify-center gap-3 rounded-xl bg-base-200 p-2">
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: '' })}>
        All
        <span className="badge badge-primary badge-md rounded-md">{countSubscriptionPaymentStatus.ALL}</span>
      </button>
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: 'PAID' })}>
        Paid
        <span className="badge badge-info badge-md rounded-md">{countSubscriptionPaymentStatus.PAID}</span>
      </button>
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: 'CONFIRMED' })}>
        Settelement
        <span className="badge badge-success badge-md rounded-md">{countSubscriptionPaymentStatus.CONFIRMED}</span>
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
