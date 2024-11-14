import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'

// Fetch all packages
export const fetchBankAccount = createAsyncThunk('package/fetchBankAccount', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`protected/bank-accounts`)
    return response.data
  } catch (e) {
    return rejectWithValue(e || 'Failed to fetch bank account')
  }
})

const BankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState: {
    bank: [],
    status: null,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBankAccount.fulfilled, (state, action) => {
        state.bank = action.payload.data || []
        state.status = 'succeeded'
      })

      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload
          state.status = 'failed'
        },
      )
  },
})

export default BankAccountSlice.reducer
