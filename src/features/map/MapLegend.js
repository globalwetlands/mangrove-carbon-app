import React from 'react'
import _ from 'lodash'

import './MapLegend.css'

const MapLegend = ({ mapColours }) => {
  const {
    colourKeyName,
    colourKeyUnit,
    min,
    max,
    colourMin,
    colourMax,
  } = mapColours

  return (
    <div className="MapLegend">
      <h4 className="MapLegend--Title">
        {colourKeyName}
        <br />
        <span className="MapLegend--Unit">({colourKeyUnit})</span>
      </h4>
      <div className="MapLegend--Display">
        <div
          className="MapLegend--ColourBox"
          style={{
            background: `linear-gradient(180deg, ${colourMax}, ${colourMin})`,
          }}
        />
        <div className="MapLegend--Values">
          <div className="MapLegend--Value">{_.round(max, 2)}</div>
          <div className="MapLegend--Value">{_.round(min, 2)}</div>
        </div>
      </div>
    </div>
  )
}

export default MapLegend
