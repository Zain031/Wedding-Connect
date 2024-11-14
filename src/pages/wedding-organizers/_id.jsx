import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLoaderData, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { activateWeddingOrganizer, updateWeddingOrganizer } from '../../api/wo-loaders'
import { AlertSVG } from '../../assets/svgs'
import Container from '../../components/container'
import ModalActivateAccount from '../../components/modal-activate-account'
import BankAccount from './tab-contents/bank-account'
import General from './tab-contents/general'
import Invoice from './tab-contents/invoice'
import Subscription from './tab-contents/subscription'

export default function Profiles() {
  const { role } = useSelector((state) => state.auth)
  const { data: me } = useLoaderData()
  console.log('🚀 ~ Profiles ~ me:', me)
  const [initialFormData] = useState({
    name: me?.name,
    phone: me?.phone,
    address: me?.address,
    description: me?.description,
    province: { id: me?.provinceId, name: me?.provinceName },
    regency: { id: me?.regencyId, name: me?.regencyName, province_id: me?.provinceId },
    district: { id: me?.districtId, name: me?.districtName, regency_id: me?.regencyId },
  })
  const [formData, setFormData] = useState(initialFormData)

  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const navigate = useNavigate()

  const handleCloseActivateAccountModal = () => {
    document.getElementById('activate_account_modal').close()
  }

  const handleCancel = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You will lose your changes',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
      cancelButtonText: 'No, keep editing',
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData(initialFormData)
        setEditing(false)
      }
    })
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const validatedData = {
        id: me?.id,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        province: formData.province,
        regency: formData.regency,
        district: formData.district,
      }

      const response = await updateWeddingOrganizer(validatedData)
      console.log('🚀 ~ submit ~ response:', response)
      if (!response.success) throw new Error(response.error)
      Swal.fire('Success!', 'Profile has been updated', 'success')
    } catch (error) {
      Swal.fire(error.message, error.error, 'error')
    } finally {
      setEditing(false)
      navigate('.', { replace: true })
    }
  }

  const handleActivateAccount = async (e) => {
    e.preventDefault()
    try {
      const response = await activateWeddingOrganizer(me.id)

      if (response.success) {
        Swal.fire('Success!', 'Account has been activated successfully.', 'success')
      } else {
        Swal.fire('Error!', 'Failed to activate account.', 'error')
        throw Error(response.error)
      }
    } catch (error) {
      throw new Error(error)
    } finally {
      handleCloseActivateAccountModal()
      navigate('.', { replace: true })
    }
  }

  return (
    <Container>
      {me?.status === 'INACTIVE' && (
        <div role="alert" className="alert alert-warning">
          <AlertSVG />
          <span>This wo is waiting for approval. Do you want to accept it?</span>
          <div>
            <button
              className="btn btn-success btn-sm"
              onClick={() => document.getElementById('activate_account_modal').showModal()}
            >
              Accept
            </button>
            <ModalActivateAccount
              name={me?.name}
              id={me?.id}
              onActivate={handleActivateAccount}
              onClose={handleCloseActivateAccountModal}
            />
          </div>
        </div>
      )}

      <div role="tablist" className="tabs-boxed tabs max-w-2xl">
        <button
          role="tab"
          className={`tab ${activeTab === 'general' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('general')}
        >
          General
        </button>
        <a
          role="tab"
          className={`tab ${activeTab === 'bank-account' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('bank-account')}
        >
          Bank Account
        </a>
        <a
          role="tab"
          className={`tab ${activeTab === 'subscription' ? 'tab-active' : ''}`}
          onClick={() => handleTabChange('subscription')}
        >
          Subscription
        </a>
        {role === 'ROLE_WO' && (
          <a
            role="tab"
            className={`tab ${activeTab === 'invoice' ? 'tab-active' : ''}`}
            onClick={() => handleTabChange('invoice')}
          >
            Invoice
          </a>
        )}
      </div>

      <TabContent id="general" activeTab={activeTab}>
        <General
          me={me}
          role={role}
          editing={editing}
          setEditing={setEditing}
          onSubmit={submit}
          onCancel={handleCancel}
          onActivateAccount={handleActivateAccount}
          formData={formData}
          setFormData={setFormData}
        />
      </TabContent>
      <TabContent id="bank-account" activeTab={activeTab}>
        <BankAccount role={role} woBankAccounts={me?.bankAccounts} />
      </TabContent>
      <TabContent id="subscription" activeTab={activeTab}>
        <Subscription wo={me} role={role} woId={me?.id} />
      </TabContent>
      <TabContent id="invoice" activeTab={activeTab}>
        <Invoice />
      </TabContent>
    </Container>
  )
}

const TabContent = ({ id, activeTab, children }) => {
  return id === activeTab ? <div>{children}</div> : null
}
