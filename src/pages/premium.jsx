import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLoaderData } from 'react-router-dom'
import { AddSVG, CheckCircle, EditSVG } from '../assets/svgs'
import DeleteSVG from '../assets/svgs/delete-svg'
import Container from '../components/container'
import ModalOrderPremiumPlan from '../components/modal-order-premium-plan'
import Header from '../layouts/partials/header'
import ModalCreateSubsPackage from './subscriptions/components/modal-create-package'
import ModalDeleteSubsPackage from './subscriptions/components/modal-delete-package'
import ModalEditSubsPackage from './subscriptions/components/modal-edit-package'

export default function Premium() {
  const { role } = useSelector((state) => state.auth)
  const { data: items } = useLoaderData()
  console.log('🚀 ~ Premium ~ items:', items)
  const [selectedItem, setSelectedItem] = useState(items[0])

  const handleOpenModalBuy = (item) => {
    setSelectedItem(item)
    document.getElementById('order_premium_plan_modal').showModal()
  }

  const handleOpenModalEdit = (item) => {
    setSelectedItem(item)
    document.getElementById('edit_subs_package_modal').showModal()
  }

  const handleOpenModalDelete = (item) => {
    setSelectedItem(item)
    document.getElementById('delete_subs_package_modal').showModal()
  }

  return (
    <Container>
      <div className="flex items-center justify-between">
        <div>
          <Header title={role === 'ROLE_WO' ? 'Premium Plan' : 'Manage Packages'} />
          <p className="text-sm italic opacity-55">
            {role === 'ROLE_WO'
              ? 'Get more features and support by subscribing to our premium plan.'
              : 'This section contains the list of packages you can manage.'}
          </p>
        </div>
        {role === 'ROLE_ADMIN' && (
          <div>
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById('create_subs_package_modal').showModal()}
            >
              <AddSVG />
              Add New Package
            </button>
          </div>
        )}
      </div>
      <div className="my divider" />
      <div className="grid grid-cols-3 gap-0">
        {items.map((item) => (
          <PremiumCard
            key={item.id}
            item={item}
            role={role}
            onOpenModalBuy={handleOpenModalBuy}
            onOpenModalEdit={handleOpenModalEdit}
            onOpenModalDelete={handleOpenModalDelete}
          />
        ))}
      </div>
      <ModalOrderPremiumPlan item={selectedItem} onClose={() => setSelectedItem(null)} />
      {role === 'ROLE_ADMIN' && (
        <>
          <ModalCreateSubsPackage />
          <ModalEditSubsPackage item={selectedItem} onClose={() => setSelectedItem(null)} />
          <ModalDeleteSubsPackage item={selectedItem} onClose={() => setSelectedItem(null)} />
        </>
      )}
    </Container>
  )
}

const PremiumCard = ({ item, role, onOpenModalBuy, onOpenModalEdit, onOpenModalDelete }) => {
  return (
    <div className="card card-bordered card-compact rounded-none border-2 bg-base-100 shadow">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <p>{item.name}</p>
          {item?.popular && (
            <span className="badge badge-primary">
              <svg className="mr-1 size-4 fill-yellow-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.8382 11.1263L21.609 13.5616C21.2313 17.5742 21.0425 19.5805 19.8599 20.7902C18.6773 22 16.9048 22 13.3599 22H10.6401C7.09517 22 5.32271 22 4.14009 20.7902C2.95748 19.5805 2.76865 17.5742 2.391 13.5616L2.16181 11.1263C1.9818 9.2137 1.8918 8.25739 2.21899 7.86207C2.39598 7.64823 2.63666 7.5172 2.89399 7.4946C3.36968 7.45282 3.96708 8.1329 5.16187 9.49307C5.77977 10.1965 6.08872 10.5482 6.43337 10.6027C6.62434 10.6328 6.81892 10.6018 6.99526 10.5131C7.31351 10.3529 7.5257 9.91812 7.95007 9.04852L10.1869 4.46486C10.9888 2.82162 11.3898 2 12 2C12.6102 2 13.0112 2.82162 13.8131 4.46485L16.0499 9.04851C16.4743 9.91812 16.6865 10.3529 17.0047 10.5131C17.1811 10.6018 17.3757 10.6328 17.5666 10.6027C17.9113 10.5482 18.2202 10.1965 18.8381 9.49307C20.0329 8.1329 20.6303 7.45282 21.106 7.4946C21.3633 7.5172 21.604 7.64823 21.781 7.86207C22.1082 8.25739 22.0182 9.2137 21.8382 11.1263ZM8.25 18C8.25 17.5858 8.58579 17.25 9 17.25H15C15.4142 17.25 15.75 17.5858 15.75 18C15.75 18.4142 15.4142 18.75 15 18.75H9C8.58579 18.75 8.25 18.4142 8.25 18Z"
                />
              </svg>
              Popular
            </span>
          )}
        </div>
        <h2 className="card-title text-2xl">
          {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
        </h2>
        <ul className="menu p-0">
          <li>
            <div>
              <CheckCircle />
              {item.description}
            </div>
          </li>
          <Benefits />
        </ul>
        <div className="card-actions mt-5">
          {role === 'ROLE_WO' && (
            <button
              className={`btn btn-primary btn-block ${!item?.popular && 'btn-outline'}`}
              onClick={() => onOpenModalBuy(item)}
            >
              Subscribe Now
            </button>
          )}
          {role === 'ROLE_ADMIN' && (
            <div className="flex w-full items-center justify-end gap-2">
              <button className="btn btn-outline btn-warning btn-sm" onClick={() => onOpenModalEdit(item)}>
                <EditSVG className="-mr-1 size-5" />
                Edit
              </button>
              <button className="btn btn-outline btn-error btn-sm" onClick={() => onOpenModalDelete(item)}>
                <DeleteSVG className="-mr-1 size-5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Benefits = () => {
  return (
    <>
      <li>
        <div>
          <CheckCircle /> Jangkau audiens yang lebih luas.
        </div>
      </li>
      <li>
        <div>
          <CheckCircle /> Tingkatkan visibilitas Anda.
        </div>
      </li>
      <li>
        <div>
          <CheckCircle /> Dapatkan ulasan dan testimoni.
        </div>
      </li>
      <li>
        <div>
          <CheckCircle /> Akses analitik iklan.
        </div>
      </li>
      <li>
        <div>
          <CheckCircle /> Kelola profil dan penawaran dengan mudah.
        </div>
      </li>
    </>
  )
}
