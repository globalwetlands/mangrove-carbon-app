import React, { useEffect } from 'react'
import { useSingleLocationData } from '../../utils/dataHooks'

import EmissionsModelWidget from './EmissionsModelWidget'

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
    if (locationData) {
      console.log('⚡️: WidgetWrap -> locationData', locationData)
    }
  }, [locationData])

  return (
    <div className="Widgets--Wrap">
      <div className="Widgets--Container">
        <EmissionsModelWidget
          name={selectedLocationData?.name}
          iso={selectedLocationData?.iso}
          locationData={locationData}
        />
      </div>
    </div>
  )
}

export default WidgetWrap
