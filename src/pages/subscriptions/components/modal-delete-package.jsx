import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { deleteSubscriptionPrice } from '../../../api/subscriptions'

const ModalDeleteSubsPackage = ({ item, onClose }) => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleCloseModal = () => {
    onClose
    document.getElementById('delete_subs_package_modal').close()
  }
  const submit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await deleteSubscriptionPrice(item.id)
      if (!response.success) throw new Error(response.message)
      Swal.fire('Success', 'Package has been deleted successfully', 'success')
    } catch (error) {
      console.log('🚀 ~ submit ~ error:', error)
      Swal.fire('Error', error.message, 'error')
    } finally {
      setLoading(false)
      handleCloseModal()
      navigate('.', { replace: true })
    }
    handleCloseModal()
  }
  return (
    <dialog id="delete_subs_package_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Delete Package</h3>
        <p className="py-4">
          Are you sure you want to delete <span className="badge badge-neutral font-bold">{item?.name}</span> package?
        </p>
        <form onSubmit={submit} method="dialog">
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-error" disabled={loading}>
              Delete
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default ModalDeleteSubsPackage
