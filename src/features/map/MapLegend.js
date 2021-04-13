import React from 'react'
import _ from 'lodash'

import { opacify } from '../../utils/colorUtils'
import './MapLegend.css'

const MapLegend = ({ mapColours }) => {
  const {
    colourKeyName,
    colourKeyUnit,
    colourStops,
    valueStops,
    opacity,
  } = mapColours

  return (
    <div className="Map--Overlays--Box MapLegend">
      <h4 className="MapLegend--Title">
        {colourKeyName}
        <br />
        <span className="MapLegend--Unit">({colourKeyUnit})</span>
      </h4>
      <div className="MapLegend--Display">
        {colourStops.map((colour, index) => {
          const value = valueStops?.[index]
          const nextValue = valueStops?.[index + 1]

          if (!_.isNumber(value) || !_.isNumber(nextValue)) {
            return null
          }

          const toFixed = (val) => val.toFixed(0)

          let valueString = `${toFixed(value)} - ${toFixed(nextValue)}`
          if (index === 0) {
            valueString = `< ${toFixed(nextValue)}`
          }
          if (index === colourStops.length - 1) {
            valueString = `> ${toFixed(value)}`
          }

          return (
            <div
              className="MapLegend--ColourStop"
              key={`MapLegend--ColourStop--${index}`}
            >
              <div
                className="MapLegend--ColourBox"
                style={{
                  background: opacify(colour, opacity),
                }}
              />
              <div className="MapLegend--Value">{valueString}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MapLegend
