import React from 'react'

import EmissionsModelWidget from './EmissionsModelWidget'

import './Widgets.css'

const WidgetWrap = ({ selectedLocationData }) => {
  if (!selectedLocationData) {
    return null
  }

  return (
    <div className="Widgets--Wrap">
      <EmissionsModelWidget selectedLocationData={selectedLocationData} />
    </div>
  )
}

export default WidgetWrap
