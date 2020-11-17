import React from 'react'

import EmissionsModelWidget from './EmissionsModelWidget'
import WidgetBox from './WidgetBox'

import './Widgets.css'

const WidgetWrap = ({ selectedLocationData, setSelectedLocationData }) => {
  if (!selectedLocationData) {
    return null
  }
  return (
    <div className="Widgets--Wrap">
      <WidgetBox onClose={() => setSelectedLocationData(null)}>
        <EmissionsModelWidget selectedLocationData={selectedLocationData} />
      </WidgetBox>
    </div>
  )
}

export default WidgetWrap
