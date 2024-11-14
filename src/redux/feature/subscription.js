import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'

export const fetchSubscriptions = createAsyncThunk('subscription/fetchSubscription', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`protected/subscriptions`)

    return response.data
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch subscription')
  }
})

const SubscriptionsSlice = createSlice({
  name: 'subscription',
  initialState: {
    subscriptions: [],
    status: null,
    error: null,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchSubscriptions.fulfilled, (state, action) => {
      state.subscriptions = action.payload.data || []
      state.status = 'succeeded'
    })
  },
})

export default SubscriptionsSlice.reducer
