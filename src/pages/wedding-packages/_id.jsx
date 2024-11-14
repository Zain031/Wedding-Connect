import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import Container from '../../components/container'
import Loading from '../../components/loading'
import Header from '../../layouts/partials/header'
import { fetchBonusPackages } from '../../redux/feature/bonusPackageSlice'
import {
  deleteWeddingPackageImage,
  fetchWeddingPackageById,
  updateWeddingPackage,
  updateWeddingPackageImage,
} from '../../redux/feature/weddingPackageSlice'
const apiUrl = import.meta.env.VITE_API_URL

export default function WeddingPackageDetails() {
  const { id } = useParams()
  const { role } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const weddingPackage = useSelector((state) => state.weddingPackage.weddingPackageById)
  console.log('🚀 ~ WeddingPackageDetails ~ weddingPackage:', weddingPackage)

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [initialFormData] = useState({
    name: weddingPackage?.name,
    price: weddingPackage?.price,
    description: weddingPackage?.description,
    province: { id: weddingPackage?.provinceId, name: weddingPackage?.provinceName },
    regency: {
      id: weddingPackage?.regencyId,
      name: weddingPackage?.regencyName,
      province_id: weddingPackage?.provinceId,
    },
    bonusDetails:
      weddingPackage?.bonusDetails.map((detail) => ({
        productId: detail?.bonusPackage?.id,
        quantity: detail?.quantity,
      })) || [],
  })
  const [formData, setFormData] = useState(initialFormData)
  const [images, setImages] = useState(
    weddingPackage?.images.map((image) => ({
      id: image.id,
      preview: `${apiUrl}/${image.url}`,
    })),
  )
  console.log('🚀 ~ WeddingPackageDetails ~ images:', images)

  const handleCancel = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will lose your changes',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep editing',
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(initialFormData)
        setImages(weddingPackage?.images.map((image) => ({ id: image.id, preview: `${apiUrl}/${image.url}` })))
        setEditing(false)
      }
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = { id: id, ...formData }
      await dispatch(updateWeddingPackage(data)).unwrap()
      if (images.length > 0) {
        images.forEach(async (image) => {
          if (image instanceof File) {
            const formDataImage = new FormData()
            formDataImage.append('image', image)
            await dispatch(updateWeddingPackageImage({ id: id, image: formDataImage })).unwrap()
          }
        })
      }
      Swal.fire('Success!', 'Package updated successfully.', 'success')
      setEditing(false)
      navigate('.', { replace: true })
    } catch (error) {
      console.error(error)
      Swal.fire('Error!', error.error, 'error')
    }
  }
  useEffect(() => {
    dispatch(fetchWeddingPackageById(id)).then(() => setLoading(false))
    dispatch(fetchBonusPackages())
  }, [dispatch, id])

  useEffect(() => {
    if (weddingPackage) {
      setFormData({
        name: weddingPackage.name,
        price: weddingPackage.price,
        description: weddingPackage.description,
        province: { id: weddingPackage.provinceId, name: weddingPackage.provinceName },
        regency: {
          id: weddingPackage.regencyId,
          name: weddingPackage.regencyName,
          province_id: weddingPackage.provinceId,
        },
        bonusDetails: weddingPackage.bonusDetails.map((detail) => ({
          productId: detail?.bonusPackage?.id,
          quantity: detail?.quantity,
        })),
      })
      setImages(
        weddingPackage?.images.map((image) => ({
          id: image.id,
          preview: `${apiUrl}/${image.url}`,
        })),
      )
      setLoading(false) // Set loading to false once data is loaded
    }
  }, [weddingPackage])

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    )
  return (
    <Container>
      <Head editing={editing} onEditing={setEditing} onSubmit={handleSubmit} onCancel={handleCancel} role={role} />
      <div className="divider" />
      <div className="grid grid-cols-2 gap-4">
        <div className="">
          <FormEdit
            formData={formData}
            setFormData={setFormData}
            editing={editing}
            onEditing={setEditing}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
        <div className="p-6">
          <div className="card card-bordered card-compact w-full shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Product</h2>
              {formData.bonusDetails.length === 0 && <p className="text-sm italic opacity-55">No product added</p>}
              <ProductForm
                editing={editing}
                bonusDetails={formData.bonusDetails}
                setBonusDetails={(newBonusDetails) => setFormData({ ...formData, bonusDetails: newBonusDetails })}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Description*</span>
            </div>
            <textarea
              name="description"
              className="textarea textarea-bordered"
              value={formData?.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              readOnly={!editing}
              rows={10}
            />
          </label>
        </div>
      </div>

      <div className="card card-bordered card-compact mt-4 w-full bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">Images</h2>
          <p className="-mt-2 italic opacity-55">This section contains the images of a wedding package.</p>
          <FormImageDropZone
            onSubmit={handleSubmit}
            images={images}
            setImages={setImages}
            editing={editing}
            dispatch={dispatch}
          />
        </div>
      </div>
    </Container>
  )
}

const Head = ({ editing, onEditing, onSubmit, onCancel, role }) => {
  const toggleEditMode = () => {
    onEditing((prevEditing) => {
      const newEditing = !prevEditing
      if (newEditing) {
        Swal.fire({
          icon: 'warning',
          title: 'You are in edit mode',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        })
      }
      return newEditing
    })
  }
  return (
    <div className="flex items-center justify-between">
      <div>
        <Header title="Wedding Package Details" />
        <p className="text-sm italic opacity-55">This section contains the details of a wedding package.</p>
      </div>
      <div className="flex gap-3">
        {role === 'ROLE_WO' && (
          <button className={`${editing ? 'hidden' : ''} btn btn-warning px-10`} onClick={toggleEditMode}>
            Edit
          </button>
        )}
        {editing && (
          <>
            <button onClick={onCancel} className="btn">
              Cancel
            </button>
            <button className="btn btn-success" onClick={onSubmit}>
              Save
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const FormEdit = ({ formData, setFormData, editing, onSubmit }) => {
  const [provinces, setProvinces] = useState([])
  const [regencies, setRegencies] = useState([])

  const handleChange = (e) => {
    const { name, value, options } = e.target
    const selectedOption = options ? options[e.target.selectedIndex] : null

    setFormData((prevFormData) => {
      if (name === 'province') {
        return {
          ...prevFormData,
          [name]: { id: value, name: selectedOption.text },
          regency: { id: '', name: '', province_id: value },
          district: { id: '', name: '', regency_id: '' },
        }
      } else if (name === 'regency') {
        return {
          ...prevFormData,
          [name]: { id: value, name: selectedOption.text, province_id: formData.province.id },
          district: { id: '', name: '', regency_id: value },
        }
      } else {
        return { ...prevFormData, [name]: value }
      }
    })
  }

  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await axios.get('https://muhamadafrizalf.github.io/api-wilayah-indonesia/api/provinces.json')
      setProvinces(res.data)
    }
    fetchProvinces()
  }, [])

  useEffect(() => {
    const fetchRegencies = async () => {
      const res = await axios.get(
        `https://muhamadafrizalf.github.io/api-wilayah-indonesia/api/regencies/${formData?.province.id}.json`,
      )
      setRegencies(res.data)
    }
    fetchRegencies()
  }, [formData.province])
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Name*</span>
        </div>
        <input
          type="text"
          name="name"
          className="input input-bordered"
          value={formData?.name}
          onChange={handleChange}
          readOnly={!editing}
        />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Price*</span>
        </div>
        <input
          type="number"
          name="price"
          className="input input-bordered"
          value={formData?.price}
          onChange={handleChange}
          readOnly={!editing}
        />
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Province*</span>
        </div>
        <select
          name="province"
          className="select select-bordered"
          value={formData?.province.id}
          onChange={handleChange}
          disabled={!editing}
        >
          <option disabled value="">
            Select Province
          </option>
          {provinces?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Regency*</span>
        </div>
        <select
          name="regency"
          className="select select-bordered"
          value={formData?.regency.id}
          onChange={handleChange}
          disabled={!editing || !formData?.province.id}
        >
          <option disabled value="">
            Select Regency
          </option>
          {regencies?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </label>
    </form>
  )
}

const ProductForm = ({ bonusDetails, setBonusDetails, editing }) => {
  const products = useSelector((state) => state.package.packages)

  const handleProductChange = (index, field, value) => {
    const updatedBonusDetails = [...bonusDetails]
    updatedBonusDetails[index][field] = field === 'quantity' ? Number(value) : value
    setBonusDetails(updatedBonusDetails)
  }

  const addBonusDetail = () => {
    setBonusDetails([...bonusDetails, { productId: '', quantity: 1 }])
  }

  const removeBonusDetail = (index) => {
    const updatedBonusDetails = bonusDetails.filter((_, i) => i !== index)
    setBonusDetails(updatedBonusDetails)
  }

  const selectedProductIds = bonusDetails.map((detail) => detail.productId)
  const allProductsSelected = selectedProductIds.length >= products.length

  return (
    <div>
      <form className="space-y-4">
        {bonusDetails.map((detail, index) => (
          <div className="flex items-center space-x-3" key={index}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Product Name*</span>
              </div>
              <select
                name="productId"
                className="select select-bordered"
                value={detail.productId}
                onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                disabled={!editing}
              >
                <option disabled value="">
                  Select a product
                </option>
                {products
                  .filter((product) => !selectedProductIds.includes(product.id) || product.id === detail.productId)
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="form-control w-20">
              <div className="label">
                <span className="label-text">Qty*</span>
              </div>
              <input
                type="number"
                className="input input-bordered"
                value={detail.quantity}
                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                disabled={!editing}
              />
            </label>
            <button
              className={`${!editing ? 'hidden' : ''} btn btn-circle btn-error btn-xs -ml-2`}
              onClick={() => removeBonusDetail(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </form>
      <button
        type="button"
        className={`${!editing ? 'hidden' : ''} btn btn-outline btn-primary mt-5`}
        onClick={addBonusDetail}
        disabled={allProductsSelected}
      >
        Add Product
      </button>
    </div>
  )
}

const FormImageDropZone = ({ handleSubmit, images, setImages, editing, dispatch }) => {
  const { id } = useParams()
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setImages((prevImages) => [
        ...prevImages,
        ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
      ])
    },
  })

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  )

  const handleRemoveImage = async (index) => {
    const image = images[index]
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
        await dispatch(deleteWeddingPackageImage({ id: id, imageId: image.id }))
        setImages((prevImages) => prevImages.filter((_, i) => i !== index))
      } catch (error) {
        Swal.fire(error.message, error.error, 'error')
      } finally {
        URL.revokeObjectURL(image.preview)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <section>
        {editing && (
          <div {...getRootProps({ style })} className="mb-4 border-base-300 bg-base-100 hover:bg-base-300">
            <input {...getInputProps()} disabled={!editing} />
            <p>Drag n drop some images here, or click to select images</p>
          </div>
        )}

        <aside className="mt-4 columns-1 gap-4 md:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <div key={index} className="break-inside mb-4">
              <div className="indicator h-auto w-full">
                <button
                  type="button"
                  className={`${!editing ? 'hidden' : ''} btn btn-circle btn-error indicator-item no-animation btn-sm`}
                  onClick={() => handleRemoveImage(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
                <img src={image.preview} alt={'image'} className="h-auto w-full rounded-lg" />
              </div>
            </div>
          ))}
        </aside>
      </section>
    </form>
  )
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderStyle: 'dashed',
  outline: 'none',
  transition: 'border .24s ease-in-out',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}
