import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'

export const fetchStatistic = createAsyncThunk('statistics/fetchStatistics', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`protected/statistics`)
    return response.data
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch statistics')
  }
})

const StatisticsSlice = createSlice({
  name: 'statistics',
  initialState: {
    statistics: [],
    status: null,
    error: null,
  },

  extraReducers: (builder) => {
    builder.addCase(fetchStatistic.fulfilled, (state, action) => {
      state.statistics = action.payload.data || []
      state.status = 'succeeded'
    })
  },
})

export default StatisticsSlice.reducer
