import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    token: 'Bearer ' + localStorage.getItem('token'),
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (error.response && error.response.status === 401) return Promise.reject(error)
    return Promise.reject(error.response.data)
  },
)
export default axiosInstance
