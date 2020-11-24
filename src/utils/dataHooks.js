import { useEffect, useMemo, useState } from 'react'
import {
  loadLocationsData,
  loadSingleLocationData,
  calculateEmissionData,
  parseLocationData,
} from './dataUtils'

export const useLocationsData = ({ type = 'country' } = {}) => {
  const [data, setData] = useState([])
  useEffect(() => {
    loadLocationsData({ type }).then((data) => setData(data))
  }, [type])
  return data
}

export const useSingleLocationData = ({ locationID }) => {
  const [data, setData] = useState()
  const [loadingState, setLoadingState] = useState()

  useEffect(() => {
    if (locationID) {
      // reset data
      setData(undefined)
      setLoadingState('loading')

      loadSingleLocationData(locationID).then((data) => {
        setData(data)
        setLoadingState('loaded')
      })
    } else {
      setData(undefined)
      setLoadingState(undefined)
    }
  }, [locationID])
  return { data, loadingState }
}

export const useEmissionModel = ({ locationData, forecastYears = 50 }) => {
  const [initialInputParams, setInitialInputParams] = useState({})
  const [seriesInputs, setSeriesInputs] = useState([])

  useEffect(() => {
    // update initialInputParams on initial load of locationData
    if (locationData) {
      const inputParams = parseLocationData({ locationData })
      setInitialInputParams(inputParams)
      setSeriesInputs([inputParams])
    }
  }, [locationData])

  const resetInputParams = ({ index }) => {
    // reset params to initialInputParams
    setSeriesInputs((prev) => {
      let updatedSeries = [...prev]
      updatedSeries[index] = initialInputParams
      return updatedSeries
    })
  }

  const setInputParamsHandler = ({ index, inputParams }) => {
    setSeriesInputs((prev) => {
      let updatedSeries = [...prev]
      const existing = updatedSeries[index]
      updatedSeries[index] = { ...existing, ...inputParams }
      return updatedSeries
    })
  }

  const addSeries = () => {
    setSeriesInputs((prev) => {
      const updatedSeries = [...prev]
      updatedSeries.push(initialInputParams)
      return updatedSeries
    })
  }

  const removeSeries = ({ index }) => {
    if (index === 0) {
      return false
    }
    setSeriesInputs((prev) => {
      const updatedSeries = [...prev]
      updatedSeries.splice(index, 1)
      return updatedSeries
    })
  }

  const seriesResults = useMemo(() => {
    if (seriesInputs.length) {
      const results = seriesInputs.map((inputParams) => {
        const {
          current_area_ha,
          deforestationRate,
          emissionsFactor,
          carbonStoredPerHectare,
          sequestrationRate,
        } = inputParams

        return calculateEmissionData({
          current_area_ha,
          deforestationRate,
          emissionsFactor,
          carbonStoredPerHectare,
          sequestrationRate,
          forecastYears,
        })
      })
      return results
    } else {
      return []
    }
  }, [forecastYears, seriesInputs])

  return {
    seriesResults,
    seriesInputs,
    setInputParams: setInputParamsHandler,
    resetInputParams,
    addSeries,
    removeSeries,
  }
}
