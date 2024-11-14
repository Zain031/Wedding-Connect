import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Swal from 'sweetalert2'
import { createSubscription } from '../api/subscriptions'

const ModalOrderPremiumPlan = ({ item, onClose }) => {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0]
      setImage({
        file: file,
        preview: URL.createObjectURL(file),
      })
    },
  })

  const handleCloseModal = () => {
    onClose
    setImage(null)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (!image.file) {
        throw new Error('Please select an image')
      }

      const formData = new FormData()
      formData.append('subscriptionPriceId', item.id)
      formData.append('paymentImage', image.file)

      const response = await createSubscription(formData)

      if (!response.success) {
        throw new Error(response.message)
      }
      Swal.fire('Success', 'Payment proof has been sent successfully, please wait for approval', 'success')
    } catch (error) {
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
      document.getElementById('order_premium_plan_modal').close()
    }
  }

  const thumbnail = image ? (
    <div className="flex h-full w-full items-center justify-center">
      <div className="indicator">
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation()
            setImage(null)
          }}
          className="badge indicator-item badge-secondary indicator-center indicator-bottom"
        >
          Remove
        </span>
        <img src={image.preview} alt="" className="h-full w-full object-cover" />
      </div>
    </div>
  ) : (
    <p className="text-center text-sm text-gray-500">
      Drag and drop an image <br /> or click to upload
    </p>
  )

  return (
    <dialog id="order_premium_plan_modal" className="modal">
      <div className="modal-box w-11/12 max-w-xl">
        <form method="dialog">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" onClick={handleCloseModal}>
            ✕
          </button>
        </form>
        <h3 className="text-lg font-bold">Order Premium Plan</h3>
        <span className="badge badge-primary badge-lg rounded-md">{item?.name} Package</span>
        <div className="divider" />
        <div className="flex items-start justify-between">
          <ul className="steps steps-vertical">
            <li className="step step-primary">Choose plan</li>
            <li className="step step-primary">Purchase</li>
            <li className="step step-secondary">Send Payment Proof Here</li>
          </ul>

          <form onSubmit={submit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Payment Proof</span>
              </label>
              <div
                {...getRootProps({ className: 'dropzone' })}
                className="input input-bordered flex h-96 max-h-96 w-56 items-center justify-center rounded-lg border-2 border-dashed p-3 hover:cursor-pointer hover:bg-base-200"
              >
                <input {...getInputProps()} /> {thumbnail}
              </div>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary" disabled={loading || !image}>
                {loading ? 'Processing...' : 'Order Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default ModalOrderPremiumPlan
