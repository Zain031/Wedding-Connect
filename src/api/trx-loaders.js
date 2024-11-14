import axiosInstance from './axios'

export const getAllOrders = async ({ request }) => {
  const url = new URL(request.url)
  const response = await axiosInstance.get(`/protected/orders`, {
    params: {
      keyword: url.searchParams.get('keyword'),
      page: url.searchParams.get('page') || 1,
      size: url.searchParams.get('size') || 15,
      status: url.searchParams.get('status'),
      weddingPackageId: url.searchParams.get('weddingPackageId'),
      weddingOrganizerId: url.searchParams.get('weddingOrganizerId'),
      startDate: url.searchParams.get('startDate'),
      endDate: url.searchParams.get('endDate'),
    },
  })
  return response.data
}

export const getOrderById = async ({ params }) => {
  const response = await axiosInstance.get(`/protected/orders/${params.id}`)
  return response.data
}

export const updateToWaitingPayment = async (id) => {
  const response = await axiosInstance.put(`/protected/orders/${id}/accept`)
  return response.data
}

export const updateToPaid = async (id) => {
  const response = await axiosInstance.put(`/protected/orders/${id}/confirm`)
  return response.data
}

export const updateToRejected = async (id) => {
  const response = await axiosInstance.put(`/protected/orders/${id}/reject`)
  return response.data
}

export const updateToFinished = async (id) => {
  const response = await axiosInstance.put(`/protected/orders/${id}/finish`)
  return response.data
}
