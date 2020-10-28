import { useEffect, useState } from 'react'
import { loadLocationsData, loadSingleLocationData } from './dataUtils'

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
