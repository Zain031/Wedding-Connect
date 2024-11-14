import { useSelector } from 'react-redux'
import { useLoaderData } from 'react-router-dom'
import Container from '../../components/container'
import ModalChangeStatusOrder from '../../components/modal-change-status-order'
import ModalPreviewImage from '../../components/modal-preview-image'
import Header from '../../layouts/partials/header'

const apiUrl = import.meta.env.VITE_API_URL
const statusColors = {
  PENDING: 'warning',
  REJECTED: 'error',
  WAITING_FOR_PAYMENT: 'info',
  CHECKING_PAYMENT: 'info',
  PAID: 'success',
  CANCELED: 'error',
  FINISHED: 'success',
}
const TransactionDetails = () => {
  const order = useLoaderData().data
  return (
    <Container>
      <Header title="Booking Transaction Details" />
      <p className="text-sm font-light italic">This section contains the details of the transaction.</p>
      <div className="divider" />

      <div className="flex items-start justify-center gap-6">
        <DetailTransactionsCard order={order} />
        <PackageInformation order={order} />
      </div>
    </Container>
  )
}

const DetailTransactionsCard = ({ order }) => {
  return (
    <div className="flex w-full flex-col">
      <CustomerInformationCollapse order={order} />
      <PaymentInformationCollapse order={order} />
    </div>
  )
}

const PackageInformation = ({ order }) => {
  return (
    <div className="card w-full max-w-sm">
      <div className="card-body">
        <h2 className="card-title font-extrabold capitalize">{order?.weddingPackage.name}</h2>
        <div className="rating rating-sm">
          {[1, 2, 3, 4, 5].map((star) => (
            <input
              key={star}
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              checked={order?.weddingPackage.rating === star}
              readOnly
            />
          ))}
        </div>
        <figure className="my-3">
          <img
            src={
              order?.weddingPackage?.thumbnail?.url
                ? `${apiUrl}/${order?.weddingPackage.thumbnail.url}`
                : `https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp`
            }
            alt="Wedding Package Thumbnail"
            className="h-44 w-full rounded-2xl object-cover"
          />
        </figure>
        <p className="text-2xl font-extrabold text-primary">
          {order?.basePrice?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 })}
        </p>
        <div className="divider my-1" />
        <h3 className="text-lg font-extrabold capitalize">Additional Services</h3>
        <ul className="menu w-full p-0">
          <li>
            <ul>
              {order?.orderDetails.map((detail) => (
                <li key={detail?.id}>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle size-14">
                        <img src={`${apiUrl}/${detail?.bonusPackage.thumbnail.url}`} alt="Bonus Package Thumbnail" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{detail?.bonusPackage.name}</div>
                      <div className="text-sm text-primary line-through opacity-75">
                        {detail?.bonusPackage.price.toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        </ul>
        <div className="divider my-1" />
        <h3 className="text-lg font-extrabold capitalize">Wedding Organizer</h3>
        <div className="input input-bordered flex w-full items-center justify-start rounded-2xl py-10">
          <div className="avatar">
            <div className="mask mask-squircle size-16">
              <img src={`${apiUrl}/${order?.weddingOrganizer.avatar.url}`} />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-base font-bold capitalize">{order?.weddingOrganizer?.name}</p>
            <p className="text-sm font-semibold opacity-50">{`${order?.weddingOrganizer.weddingPackageCount} Packages`}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const CustomerInformationCollapse = ({ order }) => {
  return (
    <div className="collapse collapse-arrow bg-base-100">
      <input type="checkbox" defaultChecked />
      <div className="collapse-title text-xl font-bold">
        <h2>Customer Information</h2>
        <div className="divider my-1" />
      </div>
      <div className="collapse-content">
        <div className="grid grid-cols-2 gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
            <input type="text" className="grow" value={order?.customer?.name} readOnly />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>

            <input type="text" className="grow" value={order?.customer?.email} readOnly />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                clipRule="evenodd"
              />
            </svg>

            <input type="text" className="grow" value={order?.customer?.phone} readOnly />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
              <path
                fillRule="evenodd"
                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                clipRule="evenodd"
              />
            </svg>

            <input type="text" className="grow" value={order?.customer?.address} readOnly />
          </label>
        </div>
      </div>
    </div>
  )
}

const PaymentInformationCollapse = ({ order }) => {
  const { role } = useSelector((state) => state.auth)
  const totalPrice = order?.totalPrice?.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  })
  const transactionDate = new Date(order?.transactionDate).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const lastUpdated = new Date(order?.updatedAt).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const weddingDate = new Date(order?.weddingDate).toLocaleString('id-ID', { dateStyle: 'medium' })

  return (
    <>
      <ModalChangeStatusOrder orderId={order?.id} currentStatus={order?.status} statuses={statusColors} />
      <div className="collapse collapse-arrow bg-base-100">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title text-xl font-bold">
          <h2>Payment Information</h2>
          <div className="divider my-1" />
        </div>
        <div className="collapse-content">
          <div className="grid grid-cols-2 content-start justify-items-stretch">
            <div className="mx-auto">
              <figure
                className="flex flex-col items-center justify-center"
                role="button"
                onClick={order?.paymentImage ? () => document.getElementById('preview_image_modal').showModal() : null}
              >
                <div className="indicator">
                  <span className="badge indicator-item badge-neutral indicator-center indicator-top rounded-md font-bold">
                    ‼️ Payment Proof ‼️
                  </span>
                  <img
                    src={`${apiUrl}/${order?.paymentImage?.url}`}
                    alt=""
                    className="h-96 w-60 rounded-2xl bg-base-300 object-fill hover:opacity-80"
                  />
                </div>
                <ModalPreviewImage image={`${apiUrl}/${order?.paymentImage?.url}`} />
              </figure>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between">
                <p className="">Status</p>
                <p className={`badge badge-${statusColors[order?.status]} badge-lg rounded-md font-bold`}>
                  {order?.status}
                </p>
              </div>
              <div className="divider my-1" />
              <div className="flex justify-between">
                <p className="">Booking Code</p>
                <p className="badge badge-info badge-lg rounded-md font-bold">{order?.bookCode}</p>
              </div>
              <div className="divider my-1" />
              <div className="flex justify-between">
                <p className="">Reviewed</p>
                <p className={`badge badge-${order?.reviewed ? 'success' : 'warning'} badge-lg rounded-md font-bold`}>
                  {order?.reviewed ? 'Reviewed' : 'Not Yet'}
                </p>
              </div>
              <div className="divider my-1" />
              <div className="flex justify-between">
                <p className="">Wedding Date</p>
                <p className="font-bold">{weddingDate}</p>
              </div>
              <div className="divider my-1" />
              <div className="flex justify-between">
                <p className="">Transaction Date</p>
                <p className="font-bold">{transactionDate}</p>
              </div>
              <div className="divider my-1" />
              <div className="flex justify-between">
                <p className="">Last Updated</p>
                <p className="font-bold">{lastUpdated}</p>
              </div>
              <div className="divider my-1" />
              <div className="flex justify-between">
                <p className="">Total Price</p>
                <p className="font-bold">{totalPrice}</p>
              </div>
              {role === 'ROLE_WO' && (
                <div className="flex flex-1 items-end justify-end">
                  <button
                    className="btn btn-primary btn-block rounded-2xl"
                    onClick={() => document.getElementById('change_status_order_modal').showModal()}
                  >
                    Update Status Transaction
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TransactionDetails
