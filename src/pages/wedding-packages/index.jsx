import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'

import { weddingOrganizers } from '../../api/wo-loaders'
import { AddSVG, DeleteSVG, FilterSVG, SearchSVG } from '../../assets/svgs'
import { deleteWeddingPackage, fetchWeddingPackages } from '../../redux/feature/weddingPackageSlice'

const apiUrl = import.meta.env.VITE_API_URL
export default function WeddingPackages() {
  const dispatch = useDispatch()
  const { role } = useSelector((state) => state.auth)
  const { weddingPackages, paging } = useSelector((state) => state.weddingPackage)
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(paging?.page || 1)
  const [filter, setFilter] = useState({
    keyword: searchParams.get('keyword') || '',
    page: searchParams.get('page') || '',
    weddingOrganizerId: searchParams.get('weddingOrganizerId') || '',
    provinceId: searchParams.get('province') || '',
    regencyId: searchParams.get('regency') || '',
    districtId: searchParams.get('district') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  })

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    })

    if (result.isConfirmed) {
      try {
        await dispatch(deleteWeddingPackage(id)).unwrap()
        Swal.fire('Deleted!', 'Package has been deleted successfully.', 'success')
        dispatch(fetchWeddingPackages())
      } catch (error) {
        console.error('Deleting Failed', error)
      }
    }
  }

  const updateFilter = (newFilter) => {
    setFilter((prevFilter) => ({ ...prevFilter, ...newFilter }))
  }

  useEffect(() => {
    const { keyword, page, weddingOrganizerId, provinceId, regencyId, districtId, minPrice, maxPrice } = filter
    const params = {}

    if (keyword) params.keyword = keyword
    if (page) params.page = page
    if (weddingOrganizerId) params.weddingOrganizerId = weddingOrganizerId
    if (provinceId) params.provinceId = provinceId
    if (regencyId) params.regencyId = regencyId
    if (districtId) params.districtId = districtId
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice

    setSearchParams(params)
  }, [filter, setSearchParams])

  useEffect(() => {
    dispatch(fetchWeddingPackages(searchParams))
  }, [dispatch, searchParams])

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Header title="Wedding Packages" />
        {role === 'ROLE_WO' && (
          <Link to="/wedding-packages/create" className="btn btn-primary">
            <AddSVG />
            New Wedding Package
          </Link>
        )}
      </div>
      <div className="divider" />

      <div className="mt-5 overflow-x-visible rounded-xl bg-base-200 py-6 shadow-xl">
        <div className="mb-6 flex items-center justify-end gap-2 px-6">
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
          <Filter filter={filter} updateFilter={updateFilter} role={role} />
        </div>
        <table className="table table-zebra">
          <thead className="bg-base-100">
            <tr>
              <th className="w-5 text-center">No</th>
              <th>Package Name</th>
              <th>Regency</th>
              <th>Price</th>
              <th>Ordered Count</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {weddingPackages && weddingPackages.length > 0 ? (
              weddingPackages.map((item, index) => (
                <tr key={item?.id} className="bg-base-100">
                  <td className="text-end">{(currentPage - 1) * paging.size + index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img src={`${apiUrl}/${item?.thumbnail?.url}`} alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{item?.name}</div>
                        <div className="text-sm opacity-50"></div>
                      </div>
                    </div>
                  </td>
                  <td>{item?.regencyName}</td>
                  <td>
                    {Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(item?.price)}
                  </td>
                  <td>{item?.orderCount}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/wedding-packages/${item.id}`} className="btn btn-ghost btn-sm">
                        Details
                      </Link>
                      {role === 'ROLE_WO' && (
                        <button onClick={() => handleDelete(item.id)} className="btn btn-outline btn-error btn-sm">
                          <DeleteSVG className="size-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
                  No wedding packages available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={paging?.totalPages}
        onPageChange={(page) => {
          setCurrentPage(page)
          updateFilter({ page })
        }}
      />
    </Container>
  )
}

const Filter = ({ filter, updateFilter, role }) => {
  const [filteredWo, setFilteredWo] = useState([])
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fetchWeddingOrganizers = async () => {
      try {
        const params = { page: 1, size: 50 }
        searchParams.forEach((value, key) => (params[key] = value))
        const { data } = await weddingOrganizers({
          request: { url: `${window.location.origin}?${new URLSearchParams(params).toString()}` },
        })
        setFilteredWo(data.filter((wo) => wo.weddingPackageCount > 0))
      } catch (error) {
        console.error(error)
      }
    }

    fetchWeddingOrganizers()
  }, [searchParams])

  const countNonEmptyFilters = (filter) =>
    Object.entries(filter).filter(([key, value]) => key !== 'page' && value !== '').length
  const filterCount = countNonEmptyFilters(filter)

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
      <div tabIndex={0} className="menu dropdown-content z-[1] mt-1 w-[17rem] rounded-box bg-base-100 p-3 shadow">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Filter</h3>
          <button
            className="btn btn-error btn-xs"
            onClick={() =>
              updateFilter({
                keyword: '',
                weddingOrganizerId: '',
                provinceId: '',
                regencyId: '',
                districtId: '',
                minPrice: '',
                maxPrice: '',
                page: '',
              })
            }
          >
            Clear All Filter
          </button>
        </div>
        <div className="divider my-2 opacity-75" />
        {role === 'ROLE_ADMIN' && (
          <div className="mb-3">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text-alt">Wedding Organizers</span>
              </div>
              <select
                className="select select-bordered select-sm"
                value={filter.weddingOrganizerId}
                onChange={(e) => updateFilter({ weddingOrganizerId: e.target.value })}
              >
                <option disabled value={''}>
                  Pick one
                </option>
                {filteredWo.map((wo) => (
                  <option key={wo.id} value={wo.id}>
                    {wo.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Slider  */}
        {/* <div className="mb-3">
          <label htmlFor="minPrice" className="form-control w-full">
            <div className="label">
              <span className="label-text-alt">Min Price</span>
            </div>
            <input type="range" min={0} max="100" value="25" className="range" step="25" />
            <div className="flex w-full justify-between px-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </label>
        </div>

        <div className="mb-3">
          <label htmlFor="maxPrice" className="form-control w-full">
            <div className="label">
              <span className="label-text-alt">Max Price</span>
            </div>
            <input type="range" min={0} max="100" value="25" className="range" step="25" />
            <div className="flex w-full justify-between px-2 text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </label>
        </div> */}
      </div>
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
