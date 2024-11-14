import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { createBankAccount } from '../api/bank-accounts'
import { banks } from '../lib/banks'

const ModalAddBankAccount = ({ onAccountAdded }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    bankCode: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  })

  const handleCloseModal = () => {
    document.getElementById('add_bank_account_modal').close()
  }

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target
    const bankName = type === 'select-one' ? selectedOptions[0].text.split(' - ')[1] : ''
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      bankName: type === 'select-one' ? bankName : prevData.bankName,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await createBankAccount(formData)
      if (!res.success) throw new Error(res.message)
      if (onAccountAdded) {
        onAccountAdded()
      }
      Swal.fire('Success', 'Bank Account has been created successfully', 'success')
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
    <dialog id="add_bank_account_modal" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Add Bank Account</h3>
        <p className="italic opacity-55">Please fill in the form below.</p>
        <div className="divider my-1" />
        <form>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Bank Name*</span>
            </div>
            <select
              className="select select-bordered"
              name="bankCode"
              value={formData.bankCode}
              onChange={handleChange}
            >
              <option disabled value="">
                Select Bank
              </option>
              {banks.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.code} - {bank.name}
                </option>
              ))}
            </select>
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Account Number*</span>
            </div>
            <input
              type="text"
              placeholder="Account Number"
              className="input input-bordered"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
            />
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Account Name*</span>
            </div>
            <input
              type="text"
              placeholder="Account Name"
              className="input input-bordered"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
            />
          </label>
          <div className="modal-action">
            <button type="button" className="btn" onClick={handleCloseModal}>
              Close
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={submit}
              disabled={
                !loading || !formData.bankCode || !formData.bankName || !formData.accountNumber || !formData.accountName
              }
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}

export default ModalAddBankAccount
