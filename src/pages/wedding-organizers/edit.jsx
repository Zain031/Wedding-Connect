import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { updateWeddingOrganizer, updateWeddingOrganizerImage } from '../../api/wo-loaders'
import { ArrowLeftSVG, CloseSVG } from '../../assets/svgs'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'

function EditWeddingOrganizer() {
  const { wo, cities } = useLoaderData()
  const apiUrl = import.meta.env.VITE_API_URL

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: wo?.name,
    phone: wo?.phone,
    address: wo?.address,
    description: wo?.description,
    city: wo?.city.id,
    image: wo?.avatar ? { preview: `${apiUrl}/${wo?.avatar.url}` } : null,
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setFormData((prevData) => ({
        ...prevData,
        image: Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      }))
    },
  })

  const thumbnail = formData.image ? (
    <div className="text-center">
      <img src={formData.image.preview} alt="Preview" className="h-full max-h-64 w-full object-cover" />
      <button
        type="button"
        className="btn btn-error btn-sm mt-2"
        onClick={(e) => {
          e.stopPropagation()
          setFormData({ ...formData, image: null })
        }}
      >
        <CloseSVG /> Remove
      </button>
    </div>
  ) : (
    <p className="text-center text-sm text-gray-500"> Drag and drop an image or click to upload </p>
  )

  useEffect(() => {
    return () => {
      if (formData.image && formData.image.preview) {
        URL.revokeObjectURL(formData.image.preview)
      }
    }
  }, [formData.image])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (formData.image && formData.image instanceof File) {
      const formImage = new FormData()
      formImage.append('avatar', formData.image)
      try {
        await updateWeddingOrganizerImage({ id: wo.id, imageData: formImage })
      } catch (error) {
        Swal.fire(error.message, error.error, 'error')
        return
      }
    }

    const updatedData = {
      id: wo?.id,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      description: formData.description,
      cityId: formData.city,
    }

    try {
      await updateWeddingOrganizer(updatedData)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Wedding organizer has been updated',
        showConfirmButton: false,
        timer: 1500,
      })
      navigate(`/wedding-organizers/${wo?.id}`, { replace: true })
    } catch (error) {
      Swal.fire(error.message, error.error, 'error')
    }
  }

  return (
    <Container>
      <div className="flex items-center space-x-4">
        <Link to="/wedding-organizers" className="btn btn-ghost">
          <ArrowLeftSVG />
        </Link>
        <Header title={`Edit: ${wo?.name}`} />
      </div>
      <div className="divider"></div>
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
          <form onSubmit={submit} className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                {/* Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                {/* Phone */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className="input input-bordered"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {/* Address */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Address</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    className="input input-bordered"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                {/* Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    placeholder="About your wedding organizer"
                    rows="5"
                    className="textarea textarea-bordered"
                    onChange={handleChange}
                    value={formData.description}
                  ></textarea>
                </div>
              </div>

              <div className="w-1/2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">City</span>
                  </label>
                  <select name="city" className="select select-bordered" value={formData.city} onChange={handleChange}>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <div className="form-control">
                  <label htmlFor="" className="label">
                    <span className="label-text">Image</span>
                  </label>
                  <div
                    {...getRootProps({ className: 'dropzone' })}
                    className="input input-bordered flex h-80 max-h-80 items-center justify-center rounded-lg border-2 border-dashed p-3 hover:cursor-pointer hover:bg-base-200"
                  >
                    <input {...getInputProps()} />
                    {thumbnail}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-actions justify-end">
              <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-wide">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  )
}

export default EditWeddingOrganizer
