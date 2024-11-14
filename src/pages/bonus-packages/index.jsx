import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import { SearchSVG } from '../../assets/svgs'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'
import { createBonusPackage, deleteBonusPackage, fetchBonusPackages } from '../../redux/feature/bonusPackageSlice'

function BonusPackages() {
  const apiUrl = import.meta.env.VITE_API_URL
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({ name: '', price: '', description: '' })
  const dispatch = useDispatch()
  const { packages } = useSelector((state) => state.package)
  console.log('🚀 ~ packages:', packages)

  useEffect(() => {
    dispatch(fetchBonusPackages())
  }, [dispatch])

  const handleAddBonusPackage = () => {
    const dialog = document.getElementById('my_modal_1')
    if (dialog) {
      dialog.showModal()
    }
  }

  const validateForm = () => {
    const newErrors = { name: '', price: '', description: '' }
    let isValid = true

    if (!name) {
      newErrors.name = 'Name is required'
      isValid = false
    }

    if (!description) {
      newErrors.description = 'Description is required'
      isValid = false
    }

    if (!price || isNaN(price) || price <= 0) {
      newErrors.price = 'Price must be a positive number'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const formData = {
      name,
      price,
      description,
    }

    try {
      await dispatch(createBonusPackage(formData)).unwrap()
      await dispatch(fetchBonusPackages()).unwrap()
      closeDialog()
      Swal.fire('Success!', 'New package added successfully.', 'success')
    } catch (e) {
      closeDialog()

      console.log(e.error, '++++>>')

      Swal.fire({
        title: 'Error',
        text: e.error,
        icon: 'warning',
      })
    }
  }

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
        await dispatch(deleteBonusPackage(id)).unwrap()
        await dispatch(fetchBonusPackages()).unwrap()
        Swal.fire('Deleted!', 'Package has been deleted successfully.', 'success')
      } catch (error) {
        console.error('Deleting Failed', error)
      }
    }
  }

  const closeDialog = () => {
    const dialog = document.getElementById('my_modal_1')
    if (dialog) {
      dialog.close()
    }
    resetForm()
  }

  const resetForm = () => {
    setName('')
    setPrice('')
    setDescription('')
    setErrors({ name: '', price: '', description: '' })
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Header title="Products" />
        <button onClick={handleAddBonusPackage} className="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Products
        </button>
      </div>
      <div className="divider" />

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box w-full max-w-3xl">
          <h3 className="py-3 text-lg font-bold">Add New Products</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Package Name"
              className="input input-bordered w-full"
              required
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              required
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}

            <input
              type="number"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="input input-bordered w-full"
              required
            />
            {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}

            <div className="modal-action">
              <button type="submit" className="rounded-md bg-primary px-10 py-2 font-bold text-white hover:bg-blue-600">
                Submit
              </button>
              <button
                type="button"
                className="rounded-md bg-error px-10 py-2 font-bold text-white hover:bg-red-600"
                onClick={closeDialog}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Table */}
      <div className="mt-5 overflow-x-auto rounded-xl bg-base-200 py-6 shadow-xl">
        <div className="mb-6 flex items-center justify-end gap-2 px-6">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="search..." />
            <SearchSVG />
          </label>
        </div>
        <table className="table">
          <thead className="bg-base-100 font-bold">
            <tr className="h-12 text-left uppercase">
              <th>No</th>
              <th>Image</th>
              <th>Package Name</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {packages.map((item, index) => (
              <tr key={item.id} className="hover:bg-base-100">
                <td>{index + 1}</td>
                <td>
                  <img src={`${apiUrl}/${item?.thumbnail?.url}`} className="h-20 w-20 rounded-full" alt="" />
                </td>
                <td className="font-semibold">{item.name}</td>
                <td className="font-semibold">
                  <span>
                    {item?.price
                      ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(item.price)
                      : 'N/A'}
                  </span>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Link to={`/bonus-packages/${item.id}`} className="btn btn-ghost btn-sm">
                      Details
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn btn-sm outline outline-1 outline-error"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 text-error hover:text-black"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  )
}

export default BonusPackages
