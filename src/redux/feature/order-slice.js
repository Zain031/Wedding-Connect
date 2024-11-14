import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`protected/orders`)
    return response.data
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch orders')
  }
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: {},
    status: null,
    error: null,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.orders = action.payload || []
      state.status = 'succeeded'
    })
  },
})

export default ordersSlice.reducer
