import { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { deleteWeddingOrganizer } from '../../api/wo-loaders'
import { DeleteSVG, FilterSVG, SearchSVG } from '../../assets/svgs'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'

const apiUrl = import.meta.env.VITE_API_URL
const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'warning',
  DELETED: 'error',
}
function WeddingOrganizers() {
  const { data: weddingOrganizers, countUserStatus, paging } = useLoaderData()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(paging.page || 1)
  const [filter, setFilter] = useState({
    keyword: searchParams.get('keyword') || '',
    page: searchParams.get('page') || '',
    status: searchParams.get('status') || '',
    provinceId: searchParams.get('province') || '',
    regencyId: searchParams.get('regency') || '',
    districtId: searchParams.get('district') || '',
  })

  const handleDelete = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#ccc',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })

    if (confirmation.isConfirmed) {
      try {
        await deleteWeddingOrganizer(id)
        Swal.fire('Deleted!', 'Wedding organizer has been deleted successfully.', 'success')
      } catch (error) {
        Swal.fire(error.message, error.error, 'error')
      } finally {
        navigate('.', { replace: true })
      }
    }
  }

  const updateFilter = (newFilter) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }))
  }

  useEffect(() => {
    const { keyword, status, page, provinceId, regencyId, districtId } = filter
    const params = {}

    if (keyword) params.keyword = keyword
    if (status) params.status = status
    if (page) params.page = page
    if (provinceId) params.provinceId = provinceId
    if (regencyId) params.regencyId = regencyId
    if (districtId) params.districtId = districtId

    setSearchParams(params)
  }, [filter, setSearchParams])

  return (
    <Container>
      <Header title="Wedding Organizers" />
      <div className="divider" />

      <FilterByStatus countUserStatus={countUserStatus} updateFilter={updateFilter} />

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
          <Filter filter={filter} updateFilter={updateFilter} />
        </div>
        <table className="table table-zebra">
          <thead className="bg-base-100">
            <tr>
              <th className="text-center">No</th>
              <th>Name</th>
              <th>Regency</th>
              <th>Status</th>
              <th>Active Until</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {weddingOrganizers?.map((item, i) => (
              <tr key={item.id} className="bg-base-100">
                <th className="text-end">{(currentPage - 1) * paging.size + i + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle size-14">
                        <img
                          src={item?.avatar.url ? `${apiUrl}/${item?.avatar.url}` : 'https://via.placeholder.com/150'}
                          alt={item?.name}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{item?.name}</div>
                      <div className="text-sm font-semibold italic opacity-75">
                        {item?.weddingPackageCount} packages
                      </div>
                    </div>
                  </div>
                </td>
                <td>{item?.regencyName}</td>
                <td>
                  <span
                    className={`badge badge-outline badge-sm rounded-md badge-${statusColors[item.status]} badge-md font-bold lowercase`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  {item?.activeUntil
                    ? new Date(item?.activeUntil).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                    : 'Expired'}
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Link to={`/wedding-organizers/${item.id}`} className="btn btn-ghost btn-sm">
                      Details
                    </Link>

                    <button onClick={() => handleDelete(item.id)} className="btn btn-outline btn-error btn-sm">
                      <DeleteSVG className="size-6" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={paging.totalPages}
        onPageChange={(page) => {
          setCurrentPage(page)
          updateFilter({ page })
        }}
      />
    </Container>
  )
}

export default WeddingOrganizers

const Filter = ({ filter, updateFilter }) => {
  const countNonEmptyFilters = (filter) =>
    Object.entries(filter).filter(([key, value]) => key !== 'page' && value !== '').length
  const filterCount = countNonEmptyFilters(filter)

  return (
    <div className="dropdown dropdown-end">
      <div className="indicator">
        {/* TODO: Count Filter */}
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
                weddingPackageId: '',
                weddingOrganizerId: '',
                startDate: '',
                endDate: '',
                page: '',
              })
            }
          >
            Clear All Filter
          </button>
        </div>
        <div className="divider my-2 opacity-75" />
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
              {Object.keys(statusColors).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </div>
  )
}

const FilterByStatus = ({ countUserStatus, updateFilter }) => {
  return (
    <div className="mx-auto flex max-w-fit items-center justify-center gap-3 rounded-xl bg-base-200 p-3">
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: '' })}>
        All
        <span className="badge badge-primary badge-md rounded-md">{countUserStatus.ALL}</span>
      </button>
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: 'ACTIVE' })}>
        Active
        <span className="badge badge-success badge-md rounded-md">{countUserStatus.ACTIVE}</span>
      </button>
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: 'INACTIVE' })}>
        Inactive
        <span className="badge badge-warning badge-md rounded-md">{countUserStatus.INACTIVE}</span>
      </button>
      <button className="btn btn-ghost" onClick={() => updateFilter({ status: 'DELETED' })}>
        Deleted
        <span className="badge badge-error badge-md rounded-md">{countUserStatus.DELETED}</span>
      </button>
    </div>
  )
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages < 1) return null
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
