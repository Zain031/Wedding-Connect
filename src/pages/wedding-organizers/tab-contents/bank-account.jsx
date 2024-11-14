import { useEffect, useState } from 'react'
import { getBankAccounts } from '../../../api/bank-accounts'
import { AlertSVG } from '../../../assets/svgs'
import Container from '../../../components/container'
import ModalAddBankAccount from '../../../components/modal-add-bank-account'

export default function BankAccount({ role, woBankAccounts }) {
  const [bankAccounts, setBankAccounts] = useState(woBankAccounts || [])

  const fetchBankAccounts = async () => {
    try {
      const response = await getBankAccounts()
      setBankAccounts(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchBankAccounts()
  }, [])
  return (
    <Container>
      <Header role={role} />
      <div className="divider my-1" />
      {bankAccounts.length === 0 ? (
        <BankAccountAlert role={role} />
      ) : (
        <div className="flex w-full gap-4">
          {bankAccounts.map((item) => (
            <BankAccountCard key={item.id} item={item} />
          ))}
        </div>
      )}
      <ModalAddBankAccount onAccountAdded={fetchBankAccounts} />
    </Container>
  )
}

const Header = ({ role }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Bank Account</h2>
        <p className="text-sm italic opacity-55">This section contains the details of your bank account.</p>
      </div>
      {role === 'ROLE_WO' && (
        <button
          className="btn btn-primary"
          onClick={() => document.getElementById('add_bank_account_modal').showModal()}
        >
          Add Bank Account
        </button>
      )}
    </div>
  )
}

const BankAccountAlert = ({ role }) => {
  return (
    <div role="alert" className="alert alert-warning">
      <AlertSVG />
      <span className="text-sm font-bold">
        {role === 'ROLE_WO'
          ? 'You have not added any bank account yet.'
          : 'This wedding organizer has not added any bank account yet.'}
      </span>
    </div>
  )
}

const BankAccountCard = ({ item }) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{item?.bankName}</h2>
        <p>Account Number: {item?.accountNumber}</p>
        <p>Account Name: {item?.accountName}</p>
      </div>
    </div>
  )
}
