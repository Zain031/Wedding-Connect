import axiosInstance from './axios'

export const getSubscriptions = async ({ request = {} }) => {
  const url = new URL(request.url)
  const response = await axiosInstance.get('/protected/subscriptions', {
    params: {
      page: url.searchParams.get('page') || 1,
      size: url.searchParams.get('size') || 10,
      keyword: url.searchParams.get('keyword') || '',
      status: url.searchParams.get('status') || '',
      startDate: url.searchParams.get('startDate') || '',
      endDate: url.searchParams.get('endDate') || '',
    },
  })
  return response.data
}

export const confirmSubscriptionPayment = async (id) => {
  const response = await axiosInstance.put(`/protected/subscriptions/${id}`)
  return response.data
}

export const activeSubscriptions = async ({ request } = {}) => {
  const response = await axiosInstance.get('/protected/subscriptions/active', {
    params: {
      page: 1,
      size: 20,
      weddingOrganizerId: request?.params?.woId || '',
    },
  })
  return response.data
}

export const getSubscriptionById = async ({ params }) => {
  const response = await axiosInstance.get(`/protected/subscriptions/${params.id}`)
  return response.data
}

export const createSubscription = async (formData) => {
  const response = await axiosInstance.post('/protected/subscriptions', formData)
  return response.data
}

export const getSubscriptionPrices = async () => {
  const response = await axiosInstance.get('/protected/subscriptions/prices')
  return response.data
}

export const createSubscriptionPrice = async (data) => {
  const response = await axiosInstance.post('/protected/subscriptions/prices', data)
  return response.data
}

export const updateSubscriptionPrice = async (data) => {
  const response = await axiosInstance.put(`/protected/subscriptions/prices`, data)
  return response.data
}

export const deleteSubscriptionPrice = async (id) => {
  const response = await axiosInstance.delete(`/protected/subscriptions/prices/${id}`)
  return response.data
}
