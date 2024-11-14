import axiosInstance from './axios'
export const getBankAccounts = async () => {
  const response = await axiosInstance.get('/protected/bank-accounts')
  return response.data
}

export const createBankAccount = async (data) => {
  const response = await axiosInstance.post('/protected/bank-accounts', data)
  return response.data
}
