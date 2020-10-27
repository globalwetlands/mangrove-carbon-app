import React, { useEffect, useState } from 'react'
import _ from 'lodash'

import { m2ToHa } from '../../utils/utils'
import { emission_model } from '../../utils/emission_model'

function calculateEmissionData(
  locationData,
  historicalDate = '2016-01-01',
  historicalTimeDiff = 1 // years
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

  const result = emission_model({
    t: 50, // years
    A1: area_ha, // ha
    d: deforestationRate,
    Cmax: emissionsFactor,
    s: sequestrationRate,
  })

  return {
    result,
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

    return (
      <ul>
        {Object.entries(emissionModelResult).map(([key, value]) => (
          <li key={key}>
            {key}: {_.round(value, 4)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div>
      <h3>
        {name} ({iso})
      </h3>
      {/* {locationData && (
        <ul>
          <li>area_m2: {locationData.area_m2}</li>
        </ul>
      )} */}
      {emissionModelResult && (
        <Debug emissionModelResult={emissionModelResult} />
      )}
    </div>
  )
}

export default EmissionsModelWidget
