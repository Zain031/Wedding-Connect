import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { updateSubscriptionPrice } from '../../../api/subscriptions'

const subscriptionLengths = {
  A_MONTH: '1 Month',
  TWO_MONTHS: '2 Months',
  THREE_MONTHS: '3 Months',
  FOUR_MONTHS: '4 Months',
  FIVE_MONTHS: '5 Months',
  SIX_MONTHS: '6 Months',
}
const ModalEditSubsPackage = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    price: item.price,
    popular: item.popular,
    subscriptionLength: item.subscriptionLength,
  })
  console.log('🚀 ~ ModalEditSubsPackage ~ formData:', formData)

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setFormData({
      name: item.name,
      price: item.price,
      popular: item.popular,
      subscriptionLength: item.subscriptionLength,
    })
  }, [item])

  const handleCloseModal = () => {
    document.getElementById('edit_subs_package_modal').close()
    onClose
  }
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: type === 'checkbox' ? checked : value }))
  }
  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await updateSubscriptionPrice({ ...formData, id: item.id })
      if (!response.success) throw new Error(response.message)
      Swal.fire('Success', 'Package has been updated successfully', 'success')
    } catch (error) {
      console.log('🚀 ~ submit ~ error:', error)
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
      handleCloseModal()
      navigate('.', { replace: true })
    }
  }
  return (
    <dialog id="edit_subs_package_modal" className="modal">
      <div className="modal-box">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Edit Package</h3>
          <span className="badge badge-primary badge-outline badge-lg font-bold">{item.name}</span>
        </div>
        <p className="italic opacity-55">Please fill in the form below to edit.</p>
        <div className="divider my-1" />
        <form onSubmit={submit} method="dialog">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="" className="form-control w-full">
                <div className="label">
                  <span className="label-text font-bold">Name*</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label htmlFor="" className="form-control w-full">
                <div className="label">
                  <span className="label-text font-bold">Price*</span>
                </div>
                <input
                  type="number"
                  className="input input-bordered"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="col-span-2">
              <label htmlFor="" className="form-control w-full">
                <div className="label">
                  <span className="label-text font-bold">Subscription Length*</span>
                </div>
                <select
                  className="select select-bordered"
                  name="subscriptionLength"
                  value={formData.subscriptionLength}
                  onChange={handleChange}
                >
                  <option disabled value="">
                    Select Subscription Length
                  </option>
                  {Object.entries(subscriptionLengths).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="col-span-2">
              <div className="form-control w-52">
                <label className="label cursor-pointer">
                  <span className="label-text">Populer</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-accent"
                    name="popular"
                    onChange={handleChange}
                    checked={formData.popular || false}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !formData.name || !formData.price}>
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default ModalEditSubsPackage
