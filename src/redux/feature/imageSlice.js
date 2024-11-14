import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'

// Async thunk to update image
export const updateImage = createAsyncThunk('image/updateImage', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`protected/products/${id}/images`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  } catch (error) {
    console.error('Error in updateImage:', error)
    return rejectWithValue(error.response?.data || 'An unknown error occurred')
  }
})

export const deleteImage = createAsyncThunk('image/updateImage', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`protected/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return response.data
  } catch (error) {
    console.error('Error in updateImage:', error)
    return rejectWithValue(error.response?.data || 'An unknown error occurred')
  }
})

// Image slice
const imageSlice = createSlice({
  name: 'image',
  initialState: { status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateImage.fulfilled, (state) => {
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(updateImage.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(deleteImage.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
  },
})

export default imageSlice.reducer
