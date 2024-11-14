import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2'
import { SearchSVG } from '../../assets/svgs'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'
import { limitChars } from '../../lib/utils'
import { createCity, deleteCity, fetchCity, updateCity } from '../../redux/feature/citySlice'

function Cities() {
  const [formData, setFormData] = useState({
    image: null,
    name: '',
    description: '',
  })
  const { cities } = useSelector((state) => state.city)
  const [editMode, setEditMode] = useState(false)
  const [cityId, setCityId] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCity())
  }, [dispatch])

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
        await dispatch(deleteCity(id)).unwrap()

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'City has been deleted',
          showConfirmButton: false,
          timer: 1500,
        })

        dispatch(fetchCity())
      } catch (error) {
        console.error('Deleting Failed', error)
      }
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }))
  }

  const handleAddCity = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append(
      'city',
      JSON.stringify({
        name: formData.name,
        description: formData.description,
      }),
    )

    if (formData.image) {
      data.append('thumbnail', formData.image)
    }

    try {
      await dispatch(createCity(data)).unwrap()
      closeModal()
      dispatch(fetchCity())

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer
          toast.onmouseleave = Swal.resumeTimer
        },
      })
      Toast.fire({
        icon: 'success',
        title: 'City has been created ',
      })

      setFormData({ image: null, name: '', description: '' })
    } catch (e) {
      console.error('Error When Saving:', e)
    }
  }

  const handleEdit = (city) => {
    setEditMode(true)
    setCityId(city.id)
    setFormData({
      name: city.name,
      description: city.description,
      image: city.thumbnail.url,
    })
    document.getElementById('my_modal_4').showModal()
  }

  const handleUpdateCity = async (e) => {
    e.preventDefault()
    const data = new FormData()
    data.append(
      'city',
      JSON.stringify({
        id: cityId,
        name: formData.name,
        description: formData.description,
      }),
    )

    if (formData.image) {
      data.append('thumbnail', formData.image)
    }

    try {
      await dispatch(updateCity(data)).unwrap()
      Swal.fire('Success!', 'City has been updated successfully.', 'success')
      closeModal()
      dispatch(fetchCity())
    } catch (e) {
      console.error('Error When Updating:', e)
    }
  }

  const closeModal = () => {
    document.getElementById('my_modal_4').close()
    setEditMode(false)
    setFormData({ image: null, name: '', description: '' })
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <Header title="Cities" />
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditMode(false)
            document.getElementById('my_modal_4').showModal()
          }}
        >
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
          Add city
        </button>
      </div>
      <div className="divider" />

      <dialog id="my_modal_4" className="modal">
        <div className="rounded-ms modal-box w-11/12 max-w-5xl">
          <div className="bg-base flex flex-col justify-center rounded-md">
            <div className="xs:p-0 mx-auto p-4 md:w-full">
              <form onSubmit={editMode ? handleUpdateCity : handleAddCity}>
                <div className="flex w-full gap-10">
                  <div className="w-1/2">
                    <label className="block pb-1 text-sm font-semibold">City Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      name="name"
                      onChange={handleChange}
                      required
                      className="mb-5 mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="block pb-1 text-sm font-semibold"> Image</label>
                    <input
                      required={!editMode}
                      accept="image/*"
                      name="image"
                      onChange={handleChange}
                      type="file"
                      className="mb-5 mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <label className="block pb-1 text-sm font-semibold">Description</label>
                <textarea
                  type="text"
                  name="description"
                  value={formData.description}
                  required
                  onChange={handleChange}
                  className="mb-5 mt-1 h-52 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                />
                <button type="submit" className="rounded-md bg-blue-500 px-3 py-2 text-white">
                  {editMode ? 'Update' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
          <div className="modal-action">
            <button onClick={closeModal} className="rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600">
              Close
            </button>
          </div>
        </div>
      </dialog>

      <div className="mt-5 overflow-x-auto rounded-xl bg-base-200 p-6">
        <div className="mb-4 flex items-center justify-end gap-2">
          <label className="input input-bordered flex items-center gap-2">
            <input type="text" className="grow" placeholder="search..." />
            <SearchSVG />
          </label>
        </div>

        <table className="table">
          <thead className="bg-base-100 font-bold">
            <tr className="text-left uppercase h-12">
              <th>No</th>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cities.map((city, index) => (
              <tr key={city.id} className="hover:bg-base-100">
                <td>{index + 1}</td>
                <td className="font-semibold">{city.name}</td>
                <td className="max-w-xs">{limitChars(city.description, 100)}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(city)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                        />
                      </svg>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(city.id)} className="btn btn-error btn-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
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

export default Cities
