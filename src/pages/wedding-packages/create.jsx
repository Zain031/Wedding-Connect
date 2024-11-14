import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'
import { createWeddingPackage, updateWeddingPackageImage } from '../../redux/feature/weddingPackageSlice'

export default function CreateWeddingPackage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    province: { id: '', name: '' },
    regency: {
      id: '',
      name: '',
      province_id: '',
    },
    bonusDetails: [],
  })
  const [images, setImages] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.province.id || !formData.regency.id || !formData.price || !formData.description)
      return

    try {
      const response = await dispatch(createWeddingPackage(formData)).unwrap()
      console.log('🚀 ~ handleSubmit ~ response:', response)
      if (response.success) {
        if (images.length > 0) {
          try {
            images.forEach(async (image) => {
              const formDataImage = new FormData()
              formDataImage.append('image', image)
              await dispatch(updateWeddingPackageImage({ id: response.data.id, image: formDataImage })).unwrap()
            })
          } catch (error) {
            console.error(error)
            return Swal.fire('Error!', error.error, 'error')
          }
        }
      }
      Swal.fire('Success!', 'Package updated successfully.', 'success')
      navigate(`/wedding-packages`, { replace: true })
    } catch (error) {
      console.error(error)
      Swal.fire('Error!', error.error, 'error')
    }
  }
  return (
    <Container>
      <Head onSubmit={handleSubmit} formData={formData} />
      <div className="divider" />
      <div className="mb-4 grid grid-cols-2 content-center">
        <div className="">
          <FormEdit formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
        </div>
        <div className="p-6">
          <div className="card card-compact w-full shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Product</h2>
              <p className="-mt-2 italic opacity-55">This section contains the details of a product.</p>
              <ProductForm
                bonusDetails={formData.bonusDetails}
                setBonusDetails={(newBonusDetails) => setFormData({ ...formData, bonusDetails: newBonusDetails })}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 mt-4">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Description*</span>
            </div>
            <textarea
              name="description"
              className="textarea textarea-bordered"
              value={formData?.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={10}
            />
          </label>
        </div>
      </div>

      <div className="card card-bordered card-compact w-full bg-base-200 shadow">
        <div className="card-body">
          <h2 className="card-title">Add Images </h2>
          <p className="-mt-2 italic opacity-55">This section contains the images of a wedding package.</p>
          <FormImageDropZone onSubmit={handleSubmit} images={images} setImages={setImages} />
        </div>
      </div>
    </Container>
  )
}

const Head = ({ onSubmit, formData }) => {
  const processing =
    !formData.name || !formData.province.id || !formData.regency.id || !formData.price || !formData.description
  return (
    <div className="flex items-center justify-between">
      <div>
        <Header title="Create New Wedding Package" />
        <p className="text-sm italic opacity-55">This section contains the details of a wedding package.</p>
      </div>
      <button className="btn btn-success" onClick={onSubmit} disabled={processing}>
        Save
      </button>
    </div>
  )
}

const FormEdit = ({ formData, setFormData, onSubmit }) => {
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
          disabled={!formData?.province.id}
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

const ProductForm = ({ bonusDetails, setBonusDetails }) => {
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
              />
            </label>
            <button className="btn btn-circle btn-error btn-xs -ml-4" onClick={() => removeBonusDetail(index)}>
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
        className={`btn btn-outline btn-primary mt-5`}
        onClick={addBonusDetail}
        disabled={allProductsSelected}
      >
        Add Product
      </button>
    </div>
  )
}

const FormImageDropZone = ({ handleSubmit, images, setImages }) => {
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

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const removedImage = prevImages[index]
      URL.revokeObjectURL(removedImage.preview)
      return prevImages.filter((_, i) => i !== index)
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <div {...getRootProps({ style })} className="mb-4 border-base-300 bg-base-100 hover:bg-base-300">
          <input {...getInputProps()} />
          <p>Drag n drop some images here, or click to select images</p>
        </div>
        <aside className="columns-1 gap-4 md:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <div key={index} className="break-inside mb-4">
              <div className="indicator h-auto w-full">
                <button
                  type="button"
                  className="btn btn-circle btn-error indicator-item no-animation btn-sm"
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
