import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'

export const fetchWeddingPackages = createAsyncThunk(
  'weddingPackages/fetchWeddingPackages',
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/protected/wedding-packages', { params })
      return response.data
    } catch (e) {
      return rejectWithValue(e || 'Failed to fetch wedding packages')
    }
  },
)

export const fetchWeddingPackageById = createAsyncThunk(
  'weddingPackages/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/public/wedding-packages/${id}`)
      return response.data
    } catch (e) {
      return rejectWithValue(e || 'Failed to fetch wedding package by ID')
    }
  },
)

export const createWeddingPackage = createAsyncThunk(
  'weddingPackages/createWeddingPackage',
  async (weddingPackage, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/protected/wedding-packages`, weddingPackage)
      return response.data
    } catch (e) {
      return rejectWithValue(e || 'Failed to create wedding package')
    }
  },
)

export const updateWeddingPackage = createAsyncThunk(
  'weddingPackages/updateWeddingPackage',
  async (weddingPackage, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/protected/wedding-packages`, weddingPackage)
      return response.data
    } catch (e) {
      return rejectWithValue(e || 'Failed to update wedding package')
    }
  },
)

export const deleteWeddingPackage = createAsyncThunk(
  'weddingPackages/deleteWeddingPackage',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/protected/wedding-packages/${id}`)
      return response.data
    } catch (e) {
      console.log(e)
      return rejectWithValue(e || 'Failed to delete wedding package')
    }
  },
)

export const updateWeddingPackageImage = createAsyncThunk(
  'weddingPackages/updateWeddingPackageImage',
  async ({ id, image }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/protected/wedding-packages/${id}/images`, image)
      return response.data
    } catch (e) {
      return rejectWithValue(e || 'Failed to update wedding package image')
    }
  },
)

export const deleteWeddingPackageImage = createAsyncThunk(
  'weddingPackages/deleteWeddingPackageImage',
  async ({ id, imageId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/protected/wedding-packages/${id}/images/${imageId}`)
      return response.data
    } catch (e) {
      return rejectWithValue(e || 'Failed to delete wedding package image')
    }
  },
)

const WeddingPackageSlice = createSlice({
  name: 'weddingPackage',
  initialState: {
    weddingPackages: [],
    weddingPackageById: null,
    status: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWeddingPackages.fulfilled, (state, action) => {
        state.weddingPackages = action.payload.data || []
        state.paging = action.payload.paging 
        state.status = 'succeeded'
      })
      .addCase(fetchWeddingPackages.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(fetchWeddingPackageById.fulfilled, (state, action) => {
        const packageWeddingById = action.payload.data
        state.weddingPackageById = packageWeddingById
        state.status = 'succeeded'
      })
      .addCase(createWeddingPackage.fulfilled, (state, action) => {
        state.weddingPackages.push(action.payload)
        state.status = 'succeeded'
      })
      .addCase(updateWeddingPackage.fulfilled, (state, action) => {
        const index = state.weddingPackages.findIndex((pkg) => pkg.id === action.payload.id)
        if (index !== -1) {
          state.weddingPackages[index] = action.payload
        }
        state.status = 'succeeded'
      })
      .addCase(updateWeddingPackageImage.fulfilled, (state, action) => {
        const index = state.weddingPackages.findIndex((pkg) => pkg.id === action.payload.id)
        if (index !== -1) {
          state.weddingPackages[index] = action.payload
        }
        state.status = 'succeeded'
      })
      .addCase(deleteWeddingPackageImage.fulfilled, (state, action) => {
        const index = state.weddingPackages.findIndex((pkg) => pkg.id === action.payload.id)
        if (index !== -1) {
          state.weddingPackages[index] = action.payload
        }
        state.status = 'succeeded'
      })
      .addCase(deleteWeddingPackage.fulfilled, (state, action) => {
        state.weddingPackages = state.weddingPackages.filter((pkg) => pkg.id !== action.payload.id)
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

export default WeddingPackageSlice.reducer
