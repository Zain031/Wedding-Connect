import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'
import { fetchBonusPackageById, updateBonusPackage } from '../../redux/feature/bonusPackageSlice'
import { updateImage } from '../../redux/feature/imageSlice'

const BonusPackageById = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null) // Added state for preview
  const [errors, setErrors] = useState({})
  const packageDetails = useSelector((state) => state.package.packageById)

  const [editData, setEditData] = useState({
    name: '',
    price: '',
    description: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchBonusPackageById(id)).unwrap()
      setLoading(false)
    }
    fetchData()
  }, [dispatch, id])

  useEffect(() => {
    if (packageDetails) {
      setEditData({
        name: packageDetails.name || '',
        price: packageDetails.price || '',
        description: packageDetails.description || '',
      })
    }
  }, [packageDetails])

  const handleEdit = () => document.getElementById('edit_modal').showModal()

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData({ ...editData, [name]: value })
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }))
  }

  const validateFields = () => {
    const newErrors = {}
    if (!editData.name) newErrors.name = 'Name is required'
    if (!editData.price) newErrors.price = 'Price is required'
    else if (editData.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (!editData.description) newErrors.description = 'Description is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdateDetails = async (e) => {
    e.preventDefault()
    if (!validateFields()) return

    try {
      await dispatch(updateBonusPackage({ ...editData, id })).unwrap()
      Swal.fire('Success!', 'Package details updated successfully', 'success')
      document.getElementById('edit_modal').close()
      await dispatch(fetchBonusPackageById(id)).unwrap()
    } catch (error) {
      console.log(error)
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      const previewUrl = URL.createObjectURL(file) // Generate preview URL
      setPreviewImage(previewUrl) // Set preview image state
    }
  }

  const handleImageUpload = async () => {
    if (selectedImage) {
      const formData = new FormData()
      formData.append('image', selectedImage)

      try {
        await dispatch(updateImage({ id: id, data: formData })).unwrap()
        Swal.fire('Success!', 'Image updated successfully', 'success')
        dispatch(fetchBonusPackageById(id))
      } catch (error) {
        Swal.fire('Error!', error?.message || 'Failed to update image', 'error')
      }
    } else {
      Swal.fire('Warning!', 'Please select an image first', 'warning')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <Container>
      <div className="px-4 sm:px-10">
        <Header title="Product" />
        <div className="mt-8 gap-8 lg:grid-cols-2">
          <div className="bg-base">
            <div className="grid gap-4">
              <div className="mb-2 rounded-md p-4">
                <div className="rounded-md bg-base-200 p-4">
                  <label className="block text-xl font-semibold">
                    Package Name <br />{' '}
                  </label>
                  <span>{packageDetails?.name || 'N/A'} </span>
                </div>

                <div className="my-1 rounded-md bg-base-200 p-4">
                  <label className="block text-xl font-semibold">
                    Price <br />
                  </label>
                  <span>
                    {packageDetails?.price
                      ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(packageDetails.price)
                      : 'N/A'}
                  </span>
                </div>

                <div className="rounded-md bg-base-200 p-4">
                  <label className="block text-xl font-semibold">
                    Description <br />
                  </label>
                  <span>{packageDetails?.description || 'N/A'}</span>
                </div>

                <div className="flex justify-end">
                  <button
                    className="mt-6 gap-2 rounded bg-success px-10 py-2 font-bold text-white hover:bg-green-700"
                    onClick={handleEdit}
                  >
                    Edit product Details
                  </button>
                </div>
              </div>

              <hr />

              <div className="pl-4">
                {/* Image preview */}
                {previewImage && <img src={previewImage} alt="Image preview" className="mb-4 h-40 w-40" />}

                <input type="file" onChange={handleImageChange} />
                <button
                  onClick={handleImageUpload}
                  className="mt-2 rounded bg-primary px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  Add Image
                </button>
              </div>
              <hr />
              <Link to="/bonus-packages" className="flex justify-end text-lg hover:underline">
                <p className="hovar:underline text-blue-600">Back</p>
              </Link>
            </div>
          </div>

          <dialog id="edit_modal" className="modal">
            <form className="modal-box w-full sm:w-2/3 lg:w-1/2" onSubmit={handleUpdateDetails}>
              <h3 className="text-lg font-bold">Edit Bonus Package</h3>
              <input
                required
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="input input-bordered mt-4 w-full"
                placeholder="Package Name"
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}

              <input
                required
                type="number"
                name="price"
                value={editData.price}
                onChange={handleChange}
                className="input input-bordered mt-4 w-full"
                placeholder="Price"
              />
              {errors.price && <p className="text-red-500">{errors.price}</p>}

              <textarea
                name="description"
                required
                value={editData.description}
                onChange={handleChange}
                className="textarea textarea-bordered mt-4 w-full"
                placeholder="Description"
              />
              {errors.description && <p className="text-red-500">{errors.description}</p>}
              <div className="modal-action">
                <button className="btn" type="button" onClick={() => document.getElementById('edit_modal').close()}>
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit">
                  Save
                </button>
              </div>
            </form>
          </dialog>
        </div>
      </div>
    </Container>
  )
}

export default BonusPackageById
