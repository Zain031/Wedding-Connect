import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { login } from '../../redux/feature/authSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorPassword, setErrorPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const validateInputs = () => {
    let isValid = true
    setErrorPassword('')
    setErrorEmail('')

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      setErrorEmail('Email cannot be blank')
      isValid = false
    } else if (!emailPattern.test(email)) {
      setErrorEmail('Invalid email format')
      isValid = false
    }

    if (!password.trim()) {
      setErrorPassword('Password cannot be blank')
      isValid = false
    } else if (password.length < 6) {
      setErrorPassword('Password must be at least 6 characters long')
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateInputs()) return

    try {
      const authData = { email, password }
      await dispatch(login(authData)).unwrap()

      Swal.fire({
        icon: 'success',
        title: 'Signed in successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      })

      navigate('/')
    } catch (err) {
      if (err.error === 'Account is inactive') {
        Swal.fire({
          title: err.error,
          text: 'wait until your account is active',
          icon: 'warning',
        })
      }

      setErrorPassword(err.error)
    }
  }

  return (
    <div className="flex h-screen w-full bg-white">
      <div className="mb-64 mt-40 flex items-center px-8 text-center md:px-12 lg:w-1/2 lg:text-left">
        <div>
          <h2 className="py-4 text-5xl font-semibold text-gray-800">
            Join <span className="font-extrabold text-blue-700">Enigwed</span> and Take Your Wedding Business to the{' '}
            <span className="text-blue-700 underline">Next Level!</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            As a trusted wedding planner at Enigwed, you can offer unique packages to couples ready to start their
            journey.
          </p>

          <div className="xs:p-0 mx-auto mt-10 rounded-lg bg-white bg-opacity-80 p-4 shadow-md outline outline-1 outline-gray-300 md:w-3/4">
            <h1 className="mb-5 text-center text-2xl font-bold">Login</h1>
            <form className="px-5 py-7" onSubmit={handleSubmit}>
              <input
                type="text"
                className="mb-2 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
              {errorEmail && <p className="mb-4 text-center text-sm text-red-600">{errorEmail}</p>}

              <input
                type="password"
                className="mb-2 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
              />
              {errorPassword && <p className="mb-4 text-center text-sm text-red-600">{errorPassword}</p>}

              <button className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600">
                <span className="mr-2">Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="inline-block h-4 w-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              <p className="mt-5">
                Don’t have an account?
                <Link to="/register" className="text-blue-500 hover:underline">
                  {' '}
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <div
        className="relative hidden items-center justify-center lg:flex lg:w-1/2"
        style={{
          clipPath: 'polygon(10% 0, 100% 0%, 100% 100%, 0 100%)',
          backgroundImage:
            'url(https://img.freepik.com/free-psd/3d-female-character-holding-tablet-pointing-pie-chart_23-2148938905.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30" />
      </div>
    </div>
  )
}

export default Login
