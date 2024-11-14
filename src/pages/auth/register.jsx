import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import Swal from 'sweetalert2'
import { register } from '../../redux/feature/authSlice'
import { fetchDistricts, fetchProvinces, fetchRegencies } from '../../redux/feature/citySlice'
import { SuccessRegister } from '../../utils/alert-utils'

const Register = () => {
  const { provinces, regencyDetails, districtsDetails } = useSelector((state) => state.city)
  const [provinceId, setProvinceId] = useState('')
  const [regencyId, setRegencyId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nib, setNib] = useState('')
  const [npwp, setNpwp] = useState('')
  const [npwpOrigin, setNpwpOrigin] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [errors, setErrors] = useState({})
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateInputs = () => {
    let newErrors = {}
    if (!name.trim()) newErrors.name = 'Name cannot be blank'
    if (!address.trim()) newErrors.address = 'Address cannot be blank'
    if (!npwp.trim()) newErrors.npwp = 'NPWP cannot be blank'
    else if (npwp.length >= 15 && npwp.length <= 17) newErrors.npwp = 'NPWP must be 15 or 16 characters'
    if (!nib.trim()) newErrors.nib = 'NIB cannot be blank'
    else if (nib.length !== 13) newErrors.nib = 'NIB must be exactly 13 characters'
    if (!phone.trim()) newErrors.phone = 'Phone cannot be blank'
    if (!email.trim()) newErrors.email = 'Email cannot be blank'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email should be in a valid format'
    if (!password) newErrors.password = 'Password cannot be blank'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password cannot be blank'
    else if (confirmPassword !== password) newErrors.confirmPassword = 'Confirm Password must match Password'
    if (additionalInfo.length > 1000) newErrors.additionalInfo = 'Additional Information cannot exceed 1000 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProvinceChange = (e) => {
    const selectedProvinceId = e.target.value
    setProvinceId(selectedProvinceId)
    setRegencyId('')
    dispatch(fetchRegencies(selectedProvinceId))
  }

  const handleRegencyChange = (e) => {
    const selectedRegencyId = e.target.value
    setRegencyId(selectedRegencyId)
    setDistrictId('')
    dispatch(fetchDistricts(selectedRegencyId))
  }

  const unformatNpwp = (value) => {
    return value.replace(/[.\-]/g, '')
  }

  const formatNpwp = (value) => {
    const cleanValue = unformatNpwp(value)

    return cleanValue.replace(/(\d{2})(\d{3})(\d{3})(\d{1})(\d{3})(\d{3})/, '$1.$2.$3.$4-$5.$6').slice(0, 30)
  }

  const handleNpwpChange = (e) => {
    const inputValue = e.target.value
    const formattedNpwp = formatNpwp(inputValue)
    const originNpwp = unformatNpwp(formattedNpwp)

    setNpwp(formattedNpwp)
    setNpwpOrigin(originNpwp)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateInputs()) return

    const authData = {
      name,
      description: additionalInfo,
      address,
      npwp: npwpOrigin,
      nib,
      phone,
      email,
      password,
      confirmPassword,
      province: {
        id: provinceId,
        name: provinces.find((province) => province.id === provinceId)?.name || '',
      },
      regency: {
        id: regencyId,
        province_id: provinceId,
        name: regencyDetails[provinceId]?.find((regency) => regency.id === regencyId)?.name || '',
      },
      district: {
        id: districtId,
        regency_id: regencyId,
        name: districtsDetails[regencyId]?.find((district) => district.id === districtId)?.name || '',
      },
    }

    try {
      await dispatch(register(authData)).unwrap()
      SuccessRegister()
      navigate('/login')
    } catch (err) {
      setErrors(err.error)
      console.log(err)

      Swal.fire({
        icon: 'info',
        text: err.error,
      })
    }
  }

  useEffect(() => {
    dispatch(fetchProvinces())
  }, [dispatch])

  return (
    <div
      className="flex min-h-screen flex-col justify-center bg-cover bg-center sm:py-12"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1696777406868-5258913ef41d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`, // Add the background image URL
      }}
    >
      <div className="xs:p-0 mx-auto rounded-lg bg-white bg-opacity-80 p-10 md:w-[879px]">
        <h1 className="mb-5 text-center text-2xl font-bold">Register</h1>
        <div className="w-full divide-y divide-gray-200 rounded-lg bg-white shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6 px-10 py-10">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <input
                  type="text"
                  className="w-full rounded-lg border px-3 py-3 text-sm focus:outline-none"
                  placeholder="Nama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  className="w-full rounded-lg border px-3 py-3 text-sm focus:outline-none"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <p className="text-[12px] font-extralight">NPWP must be 15 or 16 characters</p>
                <input
                  type="text"
                  className="w-full rounded-lg border px-3 py-3 text-sm focus:outline-none"
                  placeholder="NPWP "
                  value={npwp}
                  onChange={handleNpwpChange}
                  required
                  maxLength={17}
                />
                {errors.npwp && <p className="text-xs text-red-500">{errors.npwp}</p>}
              </div>

              <div>
                <p className="text-[12px] font-extralight">NIB must be exactly 13 characters</p>

                <input
                  type="text"
                  className="w-full rounded-lg border px-3 py-3 text-sm focus:outline-none"
                  placeholder="NIB "
                  value={nib}
                  onChange={(e) => setNib(e.target.value)}
                  required
                  maxLength={13}
                />
                {errors.nib && <p className="text-xs text-red-500">{errors.nib}</p>}
              </div>

              <div>
                <input
                  type="password"
                  className="w-full rounded-lg border px-3 py-3 text-sm focus:outline-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  className="w-full rounded-lg border px-3 py-3 text-sm focus:outline-none"
                  placeholder="No Handphone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <input
                  type="password"
                  className="w-full rounded-lg border px-3 py-3 text-sm focus:outline-none"
                  placeholder="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>

              <div className="form-control">
                <select
                  name="province"
                  className="select select-bordered"
                  value={provinceId}
                  onChange={handleProvinceChange}
                >
                  <option value="">Select Province</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <select
                  name="regency"
                  className="select select-bordered"
                  value={regencyId}
                  onChange={handleRegencyChange}
                  disabled={!provinceId}
                >
                  <option value="">Select Regency</option>
                  {regencyDetails[provinceId]?.map((regency) => (
                    <option key={regency.id} value={regency.id}>
                      {regency.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <select
                  name="district"
                  className="select select-bordered"
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  disabled={!regencyId}
                >
                  <option value="">Select District</option>
                  {districtsDetails[regencyId]?.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <input
                type="text"
                className="w-full rounded-lg border px-3 py-3 text-sm focus:outline-none"
                placeholder="Alamat"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
            </div>

            <div>
              <textarea
                className="h-40 w-full rounded-md border-2 border-slate-200 px-3 py-3 text-sm focus:outline-none"
                placeholder="Deskripsi"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                required
              ></textarea>
              {errors.additionalInfo && <p className="text-xs text-red-500">{errors.additionalInfo}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-blue-500 py-3 text-center text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-blue-600 hover:shadow-xl focus:bg-blue-700 focus:shadow-lg focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <span className="mr-2">Register</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="inline-block h-5 w-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <Link to="/login" className="flex justify-end text-blue-500">
              <p className="jucstify-end flex hover:underline">Back</p>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
