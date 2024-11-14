import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../api/axios'

// Fetch all packages
export const fetchBonusPackages = createAsyncThunk('package/fetchPackages', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`protected/products`)

    return response.data
  } catch (e) {
    return rejectWithValue(e || 'Failed to fetch packages')
  }
})
// Fetch package by ID
export const fetchBonusPackageById = createAsyncThunk('package/fetchPackageById', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/protected/products/${id}`)

    return response.data
  } catch (e) {
    return rejectWithValue(e || 'Failed to fetch package by ID')
  }
})

// Create a new package
export const createBonusPackage = createAsyncThunk('package/createPackage', async (packages, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(`/protected/products`, packages)
    return response
  } catch (e) {
      console.log(e);

    return rejectWithValue(e )
  }
})

// Update a package
export const updateBonusPackage = createAsyncThunk('package/updatePackage', async (packages, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put(`/protected/products`, packages)
    return response.data
  } catch (e) {
    return rejectWithValue(e || 'Failed to update package')
  }
})

// Update package image
export const updateBonusPackageImage = createAsyncThunk(
  'package/updatePackageImage',
  async (packages, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/protected/products`, packages)
      return response.data
    } catch (e) {
      return rejectWithValue(e || 'Failed to update package image')
    }
  },
)

// Delete a package
export const deleteImageBonusPackage = createAsyncThunk(
  'package/deletePackage',
  async ({ id, imageId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/protected/bonus-packages/${id}/images/${imageId}`)
      return response.data
    } catch (e) {
      return rejectWithValue(e.response?.data || 'Failed to delete package')
    }
  },
)

// Delete package image
export const deleteBonusPackage = createAsyncThunk('package/deleteImagePackage', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/protected/products/${id}`)
    return response.data
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to delete package image')
  }
})

const PackageSlice = createSlice({
  name: 'package',
  initialState: {
    packages: [],
    packageById: null,
    status: null,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBonusPackages.fulfilled, (state, action) => {
        state.packages = action.payload.data || []
        state.status = 'succeeded'
      })

      .addCase(fetchBonusPackageById.fulfilled, (state, action) => {
        const packageById = action.payload.data
        state.packageById = packageById
        state.status = 'succeeded'
      })

      .addCase(createBonusPackage.fulfilled, (state, action) => {
        state.packages.push(action.payload)
        state.status = 'succeeded'
      })

      .addCase(updateBonusPackage.fulfilled, (state, action) => {
        state.packageById = action.payload
      })

      .addCase(deleteBonusPackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter((pkg) => pkg.id !== action.payload.id)
        state.status = 'succeeded'
      })
      .addCase(deleteImageBonusPackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter((pkg) => pkg.id !== action.payload.id)
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

export default PackageSlice.reducer
