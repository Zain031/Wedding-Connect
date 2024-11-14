import axios from 'axios'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Container from '../../../components/container'
import ModalChangeImage from '../../../components/modal-change-image'
import { limitChars } from '../../../lib/utils'

const apiUrl = import.meta.env.VITE_API_URL
const statusColors = {
  ACTIVE: 'success',
  INACTIVE: 'warning',
  DELETED: 'error',
}

export default function General({
  me,
  role,
  editing,
  setEditing,
  onSubmit,
  onCancel,
  onActivateAccount,
  formData,
  setFormData,
}) {
  console.log('🚀 ~ formData:', formData)
  return (
    <Container>
      <Header
        me={me}
        role={role}
        editing={editing}
        setEditing={setEditing}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onActivateAccount={onActivateAccount}
      />
      <div className="divider" />
      <Body me={me} editing={editing} onSubmit={onSubmit} formData={formData} setFormData={setFormData} />
    </Container>
  )
}

const Header = ({ me, editing, setEditing, onSubmit, onCancel, role }) => {
  const handleEdit = () => {
    setEditing(!editing)
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
      },
    })
    Toast.fire({
      icon: 'warning',
      title: 'You are in edit mode',
    })
  }
  return (
    <>
      <ModalChangeImage id={me?.id} />
      <div className="flex justify-between px-6">
        <div className="flex flex-1 items-center gap-5">
          <div className="avatar hover:cursor-pointer">
            <div
              className={`w-32 rounded-full ring ring-${me?.status ? 'success' : 'error'} ring-offset-2 ring-offset-base-100`}
            >
              <img
                src={`${apiUrl}/${me?.avatar?.url}`}
                alt="Avatar"
                className="hover:opacity-75"
                role="button"
                onClick={() => document.getElementById('change_image_modal').showModal()}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-2xl font-extrabold">
              {me?.name}
              <span className={`badge rounded-lg lowercase badge-${statusColors[me?.status]} `}>{me?.status}</span>
            </div>
            <div className="font-semibold italic text-primary">{me?.weddingPackageCount} Wedding Packages</div>
            <div className="flex items-center gap-2">
              <Rating rating={me?.rating} />
            </div>
            <div className="max-w-xl text-base opacity-50">{limitChars(me?.description, 145)}</div>
          </div>
        </div>

        <div className="flex gap-3">
          {role === 'ROLE_WO' && (
            <button className={`btn btn-warning ${editing ? 'hidden' : ''}`} onClick={handleEdit}>
              Edit
            </button>
          )}
          {editing && (
            <>
              <button onClick={onCancel} className="btn btn-error">
                Cancel
              </button>
              <button className="btn btn-success" onClick={onSubmit}>
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

const Body = ({ me, editing, formData, setFormData, onSubmit }) => {
  const [provinces, setProvinces] = useState([])
  const [regencies, setRegencies] = useState([])
  const [districts, setDistricts] = useState([])

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

  useEffect(() => {
    if (formData?.regency.id) {
      const fetchDistricts = async () => {
        const res = await axios.get(
          `https://muhamadafrizalf.github.io/api-wilayah-indonesia/api/districts/${formData?.regency.id}.json`,
        )
        setDistricts(res.data)
      }
      fetchDistricts()
    }
  }, [formData.regency])

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
      } else if (name === 'district') {
        return {
          ...prevFormData,
          district: { id: value, name: selectedOption.text, regency_id: formData.regency.id },
        }
      } else {
        return { ...prevFormData, [name]: value }
      }
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <Container className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">About Your Wedding</p>
          </div>
          <div className="flex-1">
            <textarea
              name="description"
              className="textarea textarea-bordered w-full max-w-xl"
              value={formData?.description}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">Name</p>
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="name"
              className="input input-bordered w-full max-w-xl"
              value={formData?.name}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">Email</p>
          </div>
          <div className="flex-1">
            <input
              type="email"
              className="input input-bordered w-full max-w-xl"
              defaultValue={me?.email}
              disabled={editing}
              readOnly
            />
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">WhatsApp Number</p>
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="phone"
              className="input input-bordered w-full max-w-xl"
              value={formData?.phone}
              readOnly={!editing}
            />
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">Province</p>
          </div>
          <div className="flex-1">
            <select
              name="province"
              className="select select-bordered w-full max-w-xl"
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
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">Regency</p>
          </div>
          <div className="flex-1">
            <select
              name="regency"
              className="select select-bordered w-full max-w-xl"
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
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">District</p>
          </div>
          <div className="flex-1">
            <select
              name="district"
              className="select select-bordered w-full max-w-xl"
              value={formData?.district.id}
              onChange={handleChange}
              disabled={!editing || !formData?.regency.id}
            >
              <option disabled value="">
                Select Regency
              </option>
              {districts?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">Address</p>
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="address"
              className="input input-bordered w-full max-w-xl"
              value={formData?.address}
              onChange={handleChange}
              readOnly={!editing}
            />
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">NPWP</p>
          </div>
          <div className="flex-1">
            <input
              type="text"
              className="input input-bordered w-full max-w-xl"
              defaultValue={me?.npwp}
              disabled={editing}
              readOnly
            />
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="w-full max-w-xs">
            <p className="text-lg">NIB</p>
          </div>
          <div className="flex-1">
            <input
              type="text"
              className="input input-bordered w-full max-w-xl"
              defaultValue={me?.nib}
              disabled={editing}
              readOnly
            />
          </div>
        </div>
      </Container>
    </form>
  )
}

const Rating = ({ rating }) => {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <input
          key={star}
          type="radio"
          name="rating-2"
          className="mask mask-star-2 bg-orange-400"
          checked={rating === star}
          readOnly
        />
      ))}
    </div>
  )
}
