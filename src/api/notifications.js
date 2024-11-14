import axiosInstance from './axios'

export const getNotifications = async () => {
  const response = await axiosInstance.get('/protected/notifications')
  return response.data
}

export const markNotificationAsRead = async (id) => {
  const response = await axiosInstance.put(`/protected/notifications/${id}`)
  return response.data
}
