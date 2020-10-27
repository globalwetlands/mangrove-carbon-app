import React, { useEffect, useState } from 'react'
import _ from 'lodash'

import { m2ToHa } from '../../utils/utils'
import { emission_model } from '../../utils/emission_model'

import EmissionModelChart from './EmissionsModelChart'

const EmissionModelDescription = ({ emissionModelResult }) => {
  return (
    <div className="Widgets--Description">
      <p>
        Text goes here describing the <strong>data</strong> we're using to{' '}
        <strong>calculate</strong> the figure below.
      </p>
    </div>
  )
}

function calculateEmissionData(
  locationData,
  historicalDate = '2016-01-01',
  historicalTimeDiff = 1, // years
  forecastYears = 50
) {
  const { mangrove_datum } = locationData

  const historicalDatapoint = mangrove_datum.find(
    ({ date }) => date === historicalDate
  )
  console.log(
    '⚡️: calculateEmissionData -> historicalDatapoint',
    historicalDatapoint
  )

  const {
    area_m2, // A1
    gain_m2,
    loss_m2, // gross loss
    net_change_m2,
    agb_tco2e, // above ground total CO2e grams
    bgb_tco2e, // below ground total CO2e grams
    toc_tco2e, // total C02e
  } = historicalDatapoint

  const area_ha = m2ToHa(area_m2)
  const loss_ha = m2ToHa(loss_m2)
  const deforestationRate = loss_ha / area_ha / historicalTimeDiff

  const emissionsFactor =
    //  (MgC02 per hectare)
    (agb_tco2e + bgb_tco2e) / area_ha
  // C02 is 2.67 times heavier than C

  const sequestrationRate = 12
  //    * varies, no global value,

  // generate emission_model data for range of years
  const years = _.range(forecastYears)

  const results = years.map((year) =>
    emission_model({
      t: year,
      A1: area_ha, // ha
      d: deforestationRate,
      Cmax: emissionsFactor,
      s: sequestrationRate,
    })
  )

  return {
    results,
    area_ha,
    loss_ha,
    deforestationRate,
    emissionsFactor,
    sequestrationRate,
  }
}

const EmissionsModelWidget = ({ name, iso, locationData }) => {
  const [emissionModelResult, setEmissionModelResult] = useState()

  useEffect(() => {
    if (locationData) {
      const emissionModelResult = calculateEmissionData(locationData)
      setEmissionModelResult(emissionModelResult)
    }
  }, [locationData])

  const Debug = ({ emissionModelResult }) => {
    if (!emissionModelResult) {
      return null
    }

    console.log('⚡️: Debug -> emissionModelResult', emissionModelResult)

    return (
      <pre style={{ overflow: 'scroll' }}>
        <code>
          {Object.entries(emissionModelResult).map(([key, value]) => {
            if (_.isArray(value)) {
              value = value.map((num) => _.round(num, 4)).join(', ')
              value = `[${value}]`
            } else {
              value = _.round(value, 4)
            }
            return (
              <div key={key}>
                {key}: {value}
              </div>
            )
          })}
        </code>
      </pre>
    )
  }

  return (
    <div>
      <h3 className="Widgets--Title">
        {name} ({iso})
      </h3>
      {/* {locationData && (
        <ul>
          <li>area_m2: {locationData.area_m2}</li>
        </ul>
      )} */}
      <EmissionModelDescription emissionModelResult={emissionModelResult} />

      <EmissionModelChart emissionModelResult={emissionModelResult} />

      {emissionModelResult && (
        <Debug emissionModelResult={emissionModelResult} />
      )}
    </div>
  )
}

export default EmissionsModelWidget
