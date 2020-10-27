import React, { useEffect, useState } from 'react'
import { loadLocationsData } from './dataUtils'

export const useLocationsData = () => {
  const [data, setData] = useState()
  useEffect(() => {
    loadLocationsData().then((data) => setData(data))
  }, [])
  return data
}
