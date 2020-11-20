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
  const [modifiedInputParams, setModifiedInputParams] = useState({})

  const inputParams = useMemo(() => {
    if (locationData) {
      return parseLocationData({ locationData })
    } else {
      return undefined
    }
  }, [locationData])

  const emissionModelResult = useMemo(() => {
    if (inputParams) {
      const {
        initial_area_ha,
        deforestationRate,
        Cmax,
        sequestrationRate,
      } = inputParams

      return calculateEmissionData({
        initial_area_ha,
        deforestationRate,
        Cmax,
        sequestrationRate,
        forecastYears,
      })
    } else {
      return undefined
    }
  }, [inputParams, forecastYears])

  return {
    emissionModelResult,
    inputParams,
    modifiedInputParams,
    setModifiedInputParams,
  }
}
