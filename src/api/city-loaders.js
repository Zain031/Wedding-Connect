import axiosInstance from './axios'

export const cities = async () => {
  const response = await axiosInstance.get('/public/cities')
  return response.data
}
