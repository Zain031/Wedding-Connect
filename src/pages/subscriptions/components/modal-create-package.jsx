import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { createSubscriptionPrice } from '../../../api/subscriptions'

const subscriptionLengths = {
  A_MONTH: '1 Month',
  TWO_MONTHS: '2 Months',
  THREE_MONTHS: '3 Months',
  FOUR_MONTHS: '4 Months',
  FIVE_MONTHS: '5 Months',
  SIX_MONTHS: '6 Months',
  A_YEAR: '1 Year (12 Months)',
}
const ModalCreateSubsPackage = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    subscriptionLength: '',
  })
  console.log('🚀 ~ ModalCreateSubsPackage ~ formData:', formData)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCloseModal = () => {
    document.getElementById('create_subs_package_modal').close()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log('🚀 ~ handleChange ~ name:', name)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await createSubscriptionPrice(formData)
      if (!response.success) throw new Error(response.message)
      Swal.fire('Success', 'Package has been created successfully', 'success')
    } catch (error) {
      console.log('🚀 ~ submit ~ error:', error)
      Swal.fire('Error', error.message, 'error')
    } finally {
      setFormData({
        name: '',
        price: '',
        subscriptionLength: '',
      })
      setLoading(false)
      handleCloseModal()
      navigate('.', { replace: true })
    }
  }
  return (
    <dialog id="create_subs_package_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Create Subscription Package</h3>
        <p className="italic opacity-55">Fill the form below to create a new premium package.</p>
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

export default ModalCreateSubsPackage
