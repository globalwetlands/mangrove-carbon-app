import React, { useEffect, useState, Fragment } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'

import { useSingleLocationData } from '../../utils/dataHooks'
import { m2ToHa } from '../../utils/utils'
import { emission_model } from '../../utils/emission_model'

import Spinner from '../../common/Spinner'
import EmissionModelChart from './EmissionsModelChart'

const EmissionModelDescription = ({ emissionModelResult = {} }) => {
  const {
    historicalTimeDiff,
    loss_ha,
    deforestationRate,
    sequestrationRate,
    emissionsFactor,
  } = emissionModelResult
  const displayVal = (val, round = 10) =>
    _.isNaN(val) ? '_' : _.round(val, round)
  const toPercent = (val) => val * 100
  return (
    <div className="Widgets--Description">
      <div>
        Mangrove {loss_ha < 0 ? 'gain' : 'loss'} of{' '}
        <strong>{displayVal(Math.abs(loss_ha), 0)} ha</strong> over{' '}
        {displayVal(historicalTimeDiff)} years.
      </div>
      <div>
        Deforestation rate of{' '}
        <strong>{displayVal(toPercent(deforestationRate), 2)}% pa</strong>.
      </div>
      <div>
        Sequestration rate of <strong>{displayVal(sequestrationRate)}</strong>.
      </div>
      <div>
        Emissions factor of <strong>{displayVal(emissionsFactor, 2)}</strong>.
      </div>
    </div>
  )
}

function calculateEmissionData(
  locationData,
  historicalDates = ['1996-01-01', '2016-01-01'],
  forecastYears = 50
) {
  const historicalTimeDiff = dayjs(historicalDates[1]).diff(
    dayjs(historicalDates[0]),
    'year'
  )

  const { mangrove_datum } = locationData

  const historicalDatapoints = [
    mangrove_datum.find(({ date }) => date === historicalDates[0]),
    mangrove_datum.find(({ date }) => date === historicalDates[1]),
  ]
  console.log(
    '⚡️: calculateEmissionData -> historicalDatapoint',
    historicalDatapoints
  )
  // initial area // A1
  const { area_m2 } = historicalDatapoints[0]

  const {
    // area_m2,
    // gain_m2,
    // loss_m2, // gross loss
    // net_change_m2,
    agb_tco2e, // above ground total CO2e grams
    bgb_tco2e, // below ground total CO2e grams
    // toc_tco2e, // total C02e
    // soc_tco2e,
  } = historicalDatapoints[1]

  const loss_m2 =
    historicalDatapoints[0]?.area_m2 - historicalDatapoints[1]?.area_m2

  const area_ha = m2ToHa(area_m2)
  const loss_ha = m2ToHa(loss_m2)
  const deforestationRate = loss_ha / area_ha / historicalTimeDiff

  // Mg (Megagram) == Tonne
  // tco2e = metric tonnes CO2e per hectare
  const emissionsFactor = (agb_tco2e + bgb_tco2e) / area_ha //  (MgC02 per hectare)
  // C02 is 2.67 times heavier than C

  const sequestrationRate = 6.49 //    * varies, no global value, using 6.49 found in table S4 supp materials

  // generate emission_model data for range of years
  const years = _.range(forecastYears)

  // output unit: Mg CO2 emitted
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
    historicalTimeDiff,
    area_ha,
    loss_ha,
    deforestationRate,
    emissionsFactor,
    sequestrationRate,
  }
}

// const Debug = ({ emissionModelResult = {} }) => {
//   console.log('⚡️: Debug -> emissionModelResult', emissionModelResult)

//   return (
//     <pre style={{ overflow: 'scroll', height: 200 }}>
//       <code>
//         {Object.entries(emissionModelResult).map(([key, value]) => {
//           if (_.isArray(value)) {
//             value = value.map((num) => _.round(num, 4)).join(', ')
//             value = `[${value}]`
//           } else {
//             value = _.round(value, 4)
//           }
//           return (
//             <div key={key}>
//               {key}: {value}
//             </div>
//           )
//         })}
//         {`\nemissionsFactor = (agb_tco2e + bgb_tco2e) / area_ha`}
//         {`\n\nemission_model({
//           t: year,
//           A1: area_ha,
//           d: deforestationRate,
//           Cmax: emissionsFactor,
//           s: sequestrationRate,
//         })`}
//       </code>
//     </pre>
//   )
// }

const EmissionsModelWidget = ({ selectedLocationData }) => {
  const {
    data: locationData,
    loadingState: locationDataLoadingState,
  } = useSingleLocationData({
    locationID: selectedLocationData?.id,
  })

  const [emissionModelResult, setEmissionModelResult] = useState()

  useEffect(() => {
    if (locationData) {
      const emissionModelResult = calculateEmissionData(locationData)
      setEmissionModelResult(emissionModelResult)
    } else {
      setEmissionModelResult(undefined)
    }
  }, [locationData])

  console.log(locationDataLoadingState)

  return (
    <Fragment>
      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Title">
          {selectedLocationData?.name} ({selectedLocationData?.iso})
          {locationDataLoadingState !== 'loaded' && (
            <Spinner
              isSmall
              style={{ position: 'absolute', left: 10, top: 10 }}
            />
          )}
        </h3>

        <EmissionModelDescription emissionModelResult={emissionModelResult} />
      </div>

      <div className="Widgets--Box--Column">
        <EmissionModelChart emissionModelResult={emissionModelResult} />
      </div>
      {/* <Debug emissionModelResult={emissionModelResult} /> */}
    </Fragment>
  )
}

export default EmissionsModelWidget
