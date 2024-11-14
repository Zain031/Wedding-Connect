import axiosInstance from './axios'

// export const weddingOrganizers = async ({ request }) => {
//   const url = new URL(request.url)
//   const response = await axiosInstance.get(`/protected/wedding-organizers`, {
//     params: {
//       keyword: url.searchParams.get('keyword'),
//       page: url.searchParams.get('page'),
//       size: url.searchParams.get('size'),
//       status: url.searchParams.get('status'),
//       provinceId: url.searchParams.get('province'),
//       regencyId: url.searchParams.get('regency'),
//       districtId: url.searchParams.get('district'),
//     },
//   })
//   return response.data
// }

export const weddingOrganizers = async ({ request } = {}) => {
  const url = request ? new URL(request.url) : new URL(window.location.href)
  const response = await axiosInstance.get('/protected/wedding-organizers', {
    params: {
      keyword: url.searchParams.get('keyword') || '',
      page: url.searchParams.get('page') || 1,
      size: url.searchParams.get('size') || 10,
      status: url.searchParams.get('status') || '',
      provinceId: url.searchParams.get('provinceId') || '',
      regencyId: url.searchParams.get('regencyId') || '',
      districtId: url.searchParams.get('districtId') || '',
    },
  })
  return response.data
}

export const weddingOrganizerById = async ({ params }) => {
  const response = await axiosInstance.get(`/protected/wedding-organizers/${params.id}`)
  return response.data
}

export const updateWeddingOrganizer = async (data) => {
  const response = await axiosInstance.put(`/protected/wedding-organizers`, data)
  return response.data
}

export const updateWeddingOrganizerImage = async ({ id, imageData }) => {
  const response = await axiosInstance.put(`/protected/wedding-organizers/${id}/images`, imageData)
  return response.data
}

export const activateWeddingOrganizer = async (id) => {
  const response = await axiosInstance.put(`/protected/wedding-organizers/${id}/activate`)
  return response.data
}

export const deleteWeddingOrganizer = async (id) => {
  const response = await axiosInstance.delete(`/protected/wedding-organizers/${id}`)
  return response.data
}
