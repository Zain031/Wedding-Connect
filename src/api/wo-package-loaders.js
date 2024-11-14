import axiosInstance from './axios'

export const getAllPackages = async () => {
  const response = await axiosInstance.get(`/public/wedding-packages`)
  return response.data
}
