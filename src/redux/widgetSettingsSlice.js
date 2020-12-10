import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  forecastYears: 50,
}

const widgetSettingsSlice = createSlice({
  name: 'widgetSettings',
  initialState,
  reducers: {
    setForecastYears: (state, action) => {
      const value = action.payload
      state.forecastYears = value
    },
  },
})

export const { setForecastYears } = widgetSettingsSlice.actions

export default widgetSettingsSlice.reducer
