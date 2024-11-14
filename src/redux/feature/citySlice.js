import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
export const fetchProvinces = createAsyncThunk('City/fetchAllProvinces', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('https://muhamadafrizalf.github.io/api-wilayah-indonesia/api/provinces.json')
    console.log(response.data, 'Fetched all provinces')
    return response.data
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch provinces')
  }
})

export const fetchRegencies = createAsyncThunk('City/fetchRegenciesById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://muhamadafrizalf.github.io/api-wilayah-indonesia/api/regencies/${id}.json`)
    console.log(response.data, `Fetched regencies with ID: ${id}`)
    return { id, data: response.data }
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch regencies by ID')
  }
})

export const fetchDistricts = createAsyncThunk('City/fetchDistrictsById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://muhamadafrizalf.github.io/api-wilayah-indonesia/api/districts/${id}.json`)
    console.log(response.data, `Fetched districts with ID: ${id}`)
    return { id, data: response.data }
  } catch (e) {
    return rejectWithValue(e.response?.data || 'Failed to fetch districts by ID')
  }
})

const CitySlice = createSlice({
  name: 'City',
  initialState: {
    provinces: [],
    regencyDetails: {},
    districtsDetails: {},
    status: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProvinces.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchProvinces.fulfilled, (state, action) => {
        state.provinces = action.payload || []
        console.log(state.provinces, 'Fetched provinces successfully')
        state.status = 'succeeded'
      })
      .addCase(fetchRegencies.fulfilled, (state, action) => {
        const { id, data } = action.payload
        state.regencyDetails[id] = data
        console.log(data, 'Fetched regencies successfully')
        state.status = 'succeeded'
      })
      .addCase(fetchDistricts.fulfilled, (state, action) => {
        const { id, data } = action.payload
        state.districtsDetails[id] = data
        console.log(data, 'Fetched districts successfully')
        state.status = 'succeeded'
      })
      .addCase(fetchProvinces.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
      .addCase(fetchRegencies.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
      .addCase(fetchDistricts.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
  },
})

export default CitySlice.reducer
