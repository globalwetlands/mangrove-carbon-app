import { useEffect, useMemo, useState } from 'react'
import {
  loadLocationsData,
  loadSingleLocationData,
  calculateEmissionData,
  parseLocationData,
} from './dataUtils'

import {
  updateLocationSeriesInputs,
  removeLocationSeries,
  addLocationSeriesInputs,
  createLocationSeriesInputs,
} from '../redux/widgetSettingsSlice'
import { useDispatch, useSelector } from 'react-redux'

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

export const useEmissionModel = ({
  locationData,
  forecastYears = 50,
  forecastStartingYear = 2017,
}) => {
  const [initialInputParams, setInitialInputParams] = useState({})

  const locationID = useMemo(() => {
    return locationData?.id
  }, [locationData])

  const seriesInputs = useSelector(
    (state) => state.widgetSettings.seriesInputs?.[locationID]
  )

  const dispatch = useDispatch()

  useEffect(() => {
    // update initialInputParams on first load of locationData
    if (locationData) {
      const inputParams = parseLocationData({ locationData })
      setInitialInputParams(inputParams)
      dispatch(createLocationSeriesInputs({ locationID, inputParams }))
    } else {
      setInitialInputParams({})
    }
  }, [dispatch, locationData, locationID])

  const resetInputParams = ({ index }) => {
    // reset params to initialInputParams
    dispatch(
      updateLocationSeriesInputs({
        locationID,
        seriesIndex: index,
        inputParams: initialInputParams,
      })
    )
  }

  const setInputParams = ({ index, inputParams }) => {
    dispatch(
      updateLocationSeriesInputs({
        locationID,
        seriesIndex: index,
        inputParams,
      })
    )
  }

  const addSeries = () => {
    dispatch(
      addLocationSeriesInputs({
        locationID,
        inputParams: initialInputParams,
      })
    )
  }

  const removeSeries = ({ index }) => {
    dispatch(
      removeLocationSeries({
        locationID,
        seriesIndex: index,
      })
    )
  }

  const seriesResults = useMemo(() => {
    if (seriesInputs?.length) {
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
    setInputParams,
    resetInputParams,
    addSeries,
    removeSeries,
    forecastStartingYear,
  }
}
