import React, { useEffect } from 'react'
import { useSingleLocationData } from '../../data/dataHooks'

import './Widgets.css'

const WidgetWrap = ({ selectedLocationData }) => {
  if (!selectedLocationData) {
    return null
  }

  const {
    data: locationData,
    loadingState: locationDataLoadingState,
  } = useSingleLocationData({
    locationID: selectedLocationData?.id,
  })

  useEffect(() => {
    console.log(locationData)
  }, [locationData])

  return (
    <div className="Widgets--Wrap">
      <div className="Widgets--Container">
        <div>
          <h3>
            {selectedLocationData.name} ({selectedLocationData.iso})
          </h3>
          <ul>
            <li>area_m2: {selectedLocationData.area_m2}</li>
            <li>perimeter_m: {selectedLocationData.perimeter_m}</li>
            <li>coast_length_m: {selectedLocationData.coast_length_m}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WidgetWrap
