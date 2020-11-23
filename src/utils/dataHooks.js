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
  const [inputParams, setInputParams] = useState({})
  const [initialInputParams, setInitialInputParams] = useState({})
  const [isModified, setIsModified] = useState(false)

  useEffect(() => {
    // update initialInputParams on initial load of locationData
    if (locationData) {
      const inputParams = parseLocationData({ locationData })
      setInitialInputParams(inputParams)
      setInputParams(inputParams)
      setIsModified(false)
    }
  }, [locationData])

  const resetInputParams = () => {
    // reset params to initialInputParams
    setInputParams(initialInputParams)
    setIsModified(false)
  }

  const setInputParamsHandler = (props) => {
    setInputParams(props)
    setIsModified(true)
  }

  const emissionModelResult = useMemo(() => {
    if (inputParams) {
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
    } else {
      return undefined
    }
  }, [forecastYears, inputParams])

  return {
    emissionModelResult,
    inputParams,
    setInputParams: setInputParamsHandler,
    resetInputParams,
    isModified,
  }
}
