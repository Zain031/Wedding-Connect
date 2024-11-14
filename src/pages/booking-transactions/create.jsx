import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import axiosInstance from '../../api/axios'
import Container from '../../components/container'
import Header from '../../layouts/partials/header'

const ProductAndPrice = ({ selectedPackage, totalAmount, packages, handleChange, formData }) => {
  return (
    <>
      <h2 className="card-title">Create Booking Transaction</h2>
      <p>Fill the form below to create a new transaction.</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Wedding Package*</span>
            </div>
            <select
              className="select select-bordered"
              name="weddingPackageId"
              value={formData.weddingPackageId}
              onChange={handleChange}
            >
              <option disabled value="">
                Select Package
              </option>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label htmlFor="" className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Price*</span>
            </div>
            <div className="join">
              <button className="btn btn-disabled join-item">IDR</button>
              <input
                type="text"
                className="input input-bordered join-item w-full"
                value={selectedPackage.basePrice || ''}
                readOnly
              />
            </div>
          </label>
        </div>
        <div>
          <label htmlFor="" className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Total Amount*</span>
            </div>
            <div className="join">
              <button className="btn btn-disabled join-item">IDR</button>
              <input type="text" className="input input-bordered join-item w-full" value={totalAmount || ''} readOnly />
            </div>
          </label>
        </div>
        <div>
          <label htmlFor="" className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Wedding Date*</span>
            </div>
            <input
              type="date"
              className="input input-bordered"
              name="weddingDate"
              value={formData.weddingDate}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
    </>
  )
}

const CustomerInformation = ({ handleChange, formData }) => {
  return (
    <>
      <h2 className="card-title">Customer Information</h2>
      <p>Fill the form below to create a new transaction.</p>

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
              <span className="label-text font-bold">Email*</span>
            </div>
            <input
              type="email"
              className="input input-bordered"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="" className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Phone*</span>
            </div>
            <input
              type="text"
              className="input input-bordered"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="" className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Address</span>
            </div>
            <input
              type="text"
              className="input input-bordered"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
    </>
  )
}

const PaymentInformation = () => {
  return <div>Payment Information</div>
}

const CreateTransaction = () => {
  const { data: packages } = useLoaderData()
  const [selectedPackage, setSelectedPackage] = useState({})
  const [step, setStep] = useState(0)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    weddingDate: '',
    weddingPackageId: '',
  })

  console.log(selectedPackage)

  const steps = ['Product and Price', 'Customer Information', 'Payment Information']

  const totalAmount =
    selectedPackage?.basePrice +
    selectedPackage?.bonusDetails?.reduce((sum, detail) => sum + detail.quantity * detail.bonusPackage.price, 0)

  const handleNext = () => {
    setStep(step + 1)
  }
  const handlePrev = () => {
    setStep(step - 1)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))

    if (name === 'weddingPackageId') {
      const selectedPackage = packages.find((p) => p.id === value)
      setSelectedPackage(selectedPackage)
    }
  }

  const submit = async (e) => {
    e.preventDefault()

    const data = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
      weddingDate: new Date(formData.weddingDate).toISOString(),
      weddingPackageId: formData.weddingPackageId,
      orderDetails: selectedPackage.bonusDetails.map((detail) => ({
        bonusPackageId: detail.bonusPackage.id,
        quantity: detail.quantity,
      })),
    }

    console.log(data)

    try {
      const response = await axiosInstance.post('/public/orders', data)
      console.log(response)
    } catch (error) {
      console.log(error, '=========================================>')
    }
  }

  return (
    <Container>
      <Header title="Create Booking Transaction" />
      <div className="divider" />

      <ul className="steps w-full">
        {steps.map((s, i) => (
          <li key={i} className={`step ${i <= step ? 'step-secondary' : ''}`}>
            {s}
          </li>
        ))}
      </ul>
      <div className="divider" />

      <div className="card bg-base-200 shadow-xl">
        <form onSubmit={submit} className="space-y-4">
          <div className="card-body">
            {step === 0 && (
              <ProductAndPrice
                packages={packages}
                selectedPackage={selectedPackage}
                setSelectedPackage={setSelectedPackage}
                totalAmount={totalAmount}
                handleChange={handleChange}
                formData={formData}
              />
            )}
            {step === 1 && <CustomerInformation formData={formData} handleChange={handleChange} />}
            {step === 2 && <PaymentInformation />}

            <div className="card-actions items-center justify-end mt-5">
              {step > 0 && (
                <div role="button" className="btn btn-primary" onClick={handlePrev}>
                  Prev
                </div>
              )}
              {step < steps.length - 1 && (
                <div role="button" className="btn btn-primary" onClick={handleNext}>
                  Next
                </div>
              )}
              {step === steps.length - 1 && (
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Container>
  )
}

export default CreateTransaction
