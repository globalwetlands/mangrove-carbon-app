import _ from 'lodash'
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  forecastYears: 50,
  emissionsChartYAxis: 'mtco2e',
  carbonPrice: 5,
  seriesInputs: {
    // [countryId]: [...array of series objects, each containing inputParams]
  },
}

const widgetSettingsSlice = createSlice({
  name: 'widgetSettings',
  initialState,
  reducers: {
    setForecastYears: (state, action) => {
      const value = action.payload
      state.forecastYears = value
    },
    resetForecastYears: (state) => {
      state.forecastYears = initialState.forecastYears
    },
    setEmissionsChartYAxis: (state, action) => {
      const options = ['mtco2e', 'price']
      const value = action.payload
      if (options.includes(value)) {
        state.emissionsChartYAxis = value
      }
    },
    setCarbonPrice: (state, action) => {
      const value = action.payload
      const isValid = _.inRange(value, 0, 999)
      if (isValid) {
        state.carbonPrice = value
      }
    },
    createLocationSeriesInputs: (state, action) => {
      const { locationID, inputParams } = action.payload

      if (!locationID || !inputParams) {
        return state
      }

      //  add series at index 0 if it doesn't exist
      if (!state.seriesInputs?.[locationID]?.[0]) {
        let seriesInputs = _.cloneDeep(state.seriesInputs)
        _.set(seriesInputs, `[${locationID}][0]`, inputParams)
        state.seriesInputs = seriesInputs
      }
    },
    updateLocationSeriesInputs: (state, action) => {
      const { locationID, seriesIndex, inputParams } = action.payload

      if (!locationID || !_.isNumber(seriesIndex) || !inputParams) {
        return state
      }

      let seriesInputs = _.cloneDeep(state.seriesInputs)

      // Check if existing inputParams
      const existingInputParams =
        seriesInputs?.[locationID]?.[seriesIndex] || {}

      // update series inputs
      _.set(seriesInputs, `[${locationID}][${seriesIndex}]`, {
        ...existingInputParams,
        ...inputParams,
      })
      state.seriesInputs = seriesInputs
    },
    addLocationSeriesInputs: (state, action) => {
      const { locationID, inputParams } = action.payload

      if (!locationID || !inputParams) {
        return state
      }

      state.seriesInputs[locationID].push(inputParams)
    },
    removeLocationSeries: (state, action) => {
      const { seriesIndex, locationID } = action.payload
      if (seriesIndex === 0) {
        return false
      }

      // filter out seriesInputs by provided seriesIndex
      state.seriesInputs[locationID] = state.seriesInputs[locationID].filter(
        (item, i) => i !== seriesIndex
      )
    },
  },
})

export const {
  setForecastYears,
  resetForecastYears,
  updateLocationSeriesInputs,
  removeLocationSeries,
  addLocationSeriesInputs,
  createLocationSeriesInputs,
  setEmissionsChartYAxis,
  setCarbonPrice,
} = widgetSettingsSlice.actions

export default widgetSettingsSlice.reducer
