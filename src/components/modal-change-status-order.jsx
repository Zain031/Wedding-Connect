import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { updateToFinished, updateToPaid, updateToRejected, updateToWaitingPayment } from '../api/trx-loaders'

const ModalChangeStatusOrder = ({ currentStatus, statuses, orderId }) => {
  const [status, setStatus] = useState(currentStatus)
  const [lodaing, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setStatus(currentStatus)
  }, [currentStatus])

  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      switch (status) {
        case 'WAITING_FOR_PAYMENT':
          await updateToWaitingPayment(orderId)
          break
        case 'PAID':
          await updateToPaid(orderId)
          break
        case 'REJECTED':
          await updateToRejected(orderId)
          break
        case 'FINISHED':
          await updateToFinished(orderId)
          break
        default:
          throw new Error('Invalid status')
      }
      Swal.fire('Success', 'Status has been updated', 'success')
    } catch (error) {
      console.log('🚀 ~ submit ~ error:', error)
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
      document.getElementById('change_status_order_modal').close()
      navigate('.', { replace: true })
    }
  }

  return (
    <dialog id="change_status_order_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Update Order Status</h3>
        <p className="text-sm">Press ESC key or click the button below to close</p>
        <div className="divider my-2" />
        <form onSubmit={submit} method="dialog">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Status</span>
            </div>
            <select
              className={`select select-${statuses[status]}`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option disabled value="">
                Select Status
              </option>
              {Object.keys(statuses).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-action">
            <button
              type="button"
              onClick={() => document.getElementById('change_status_order_modal').close()}
              className="btn"
            >
              Close
            </button>
            <button type="submit" className="btn btn-success" disabled={lodaing}>
              Update
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default ModalChangeStatusOrder
