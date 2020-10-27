import React, { useEffect, useState } from 'react'
import { loadLocationsData, loadSingleLocationData } from './dataUtils'

export const useLocationsData = () => {
  const [data, setData] = useState()
  useEffect(() => {
    loadLocationsData().then((data) => setData(data))
  }, [])
  return data
}

export const useSingleLocationData = ({ locationID }) => {
  const [data, setData] = useState()
  const [loadingState, setLoadingState] = useState()
  useEffect(() => {
    console.log(locationID)
    if (locationID) {
      // reset data
      setData(undefined)
      setLoadingState('loading')

      loadSingleLocationData(locationID).then((data) => setData(data))
      setLoadingState('loaded')
    } else {
      setData(undefined)
      setLoadingState(undefined)
    }
  }, [locationID])
  return { data, loadingState }
}
