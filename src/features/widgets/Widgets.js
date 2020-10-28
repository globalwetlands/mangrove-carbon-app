import React from 'react'

import EmissionsModelWidget from './EmissionsModelWidget'

import './Widgets.css'

const WidgetWrap = ({ selectedLocationData }) => {
  if (!selectedLocationData) {
    return null
  }

  return (
    <div className="Widgets--Wrap">
      <div className="Widgets--Box">
        <EmissionsModelWidget selectedLocationData={selectedLocationData} />
      </div>
    </div>
  )
}

export default WidgetWrap
