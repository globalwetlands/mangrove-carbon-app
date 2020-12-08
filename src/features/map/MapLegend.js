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
    <div className="MapLegend">
      <h4 className="MapLegend--Title">
        {colourKeyName}
        <br />
        <span className="MapLegend--Unit">({colourKeyUnit})</span>
      </h4>
      <div className="MapLegend--Display">
        {colourStops.map((colour, index) => {
          const value = _.round(valueStops[index], 2)

          let valueString = `> ${value}`
          if (index === 0) {
            valueString = `<= ${_.round(valueStops[index + 1], 2)}`
          }

          return (
            <div className="MapLegend--ColourStop">
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
