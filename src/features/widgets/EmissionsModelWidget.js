import React, { useEffect, useState, Fragment } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'

import { useSingleLocationData } from '../../utils/dataHooks'
import { m2ToHa } from '../../utils/utils'
import { emission_model } from '../../utils/emission_model'

import Spinner from '../../common/Spinner'
import EmissionModelChart from './EmissionsModelChart'
import StoredCarbonChart from './StoredCarbonChart'

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

  // initial area // A1
  const { area_m2 } = historicalDatapoints[0]

  const {
    // area_m2,
    // gain_m2,
    // loss_m2, // gross loss
    // net_change_m2,
    agb_tco2e, // above ground total CO2e tonnes
    bgb_tco2e, // below ground total CO2e tonnes
    toc_tco2e, // total C02e tonnes
    soc_tco2e,
  } = historicalDatapoints[1]

  const loss_m2 =
    historicalDatapoints[0]?.area_m2 - historicalDatapoints[1]?.area_m2

  const area_ha = m2ToHa(area_m2)
  const loss_ha = m2ToHa(loss_m2)

  // deforestation rate LOG
  // (log(area[1] / area[0]) / timeDiff) * -1
  const deforestationRate =
    (Math.log(
      historicalDatapoints[1]?.area_m2 / historicalDatapoints[0]?.area_m2
    ) /
      historicalTimeDiff) *
    -1
  const deforestationRatePercent = Math.exp(deforestationRate) - 1

  console.log(toc_tco2e)

  // Mg (Megagram) == Tonne
  // tco2e = tonnes CO2e total
  // C02 is 3.67 times heavier than C

  // Carbon storage
  // tonnes CO2e per hectare
  const carbonStoredPerHectare = toc_tco2e / area_ha

  const emissionsFactor = 0.8

  const Cmax = emissionsFactor * carbonStoredPerHectare

  // varies, no global value, using 6.49 found in table S4 supp materials
  // sequestrationRate unit: tonnes CO2e per year
  const sequestrationRate = 6.49

  // generate emission_model data for range of years
  const years = _.range(forecastYears)

  // output unit: tonnes CO2 emitted
  const results = years.map((year) =>
    emission_model({
      t: year,
      A1: area_ha, // ha
      d: deforestationRate,
      Cmax,
      s: sequestrationRate,
    })
  )

  return {
    results,
    historicalTimeDiff,
    area_ha,
    loss_ha,
    deforestationRate,
    deforestationRatePercent,
    emissionsFactor,
    sequestrationRate,
    agb_tco2e, // above ground total CO2e grams
    bgb_tco2e, // below ground total CO2e grams
    toc_tco2e, // total C02e
    soc_tco2e,
    carbonStoredPerHectare,
  }
}

const EmissionModelDescription = ({ emissionModelResult = {} }) => {
  const {
    historicalTimeDiff,
    loss_ha,
    area_ha,
    deforestationRatePercent,
    sequestrationRate,
    emissionsFactor,
    carbonStoredPerHectare,
  } = emissionModelResult

  const displayVal = (val, round = 10) =>
    _.isNaN(val) ? '_' : _.round(val, round).toLocaleString()

  return (
    <div className="Widgets--Description">
      <div>
        Mangrove {loss_ha < 0 ? 'gain' : 'loss'} of{' '}
        <strong>{displayVal(Math.abs(loss_ha), 0)} ha</strong> over{' '}
        {displayVal(historicalTimeDiff)} years.
      </div>
      <div>
        Mangrove Extent <strong>{displayVal(area_ha, 0)} ha</strong>.
      </div>
      <div>
        Deforestation rate of{' '}
        <strong>{displayVal(deforestationRatePercent * 100, 2)}% pa</strong>.
      </div>
      <div>
        Sequestration rate of{' '}
        <strong>{displayVal(sequestrationRate)} t CO₂e per year</strong>.
      </div>
      <div>
        Carbon Stored{' '}
        <strong>{displayVal(carbonStoredPerHectare, 2)} t CO₂e / ha</strong>.
      </div>
      <div>
        Emissions factor of <strong>{displayVal(emissionsFactor, 2)}</strong>.
      </div>
    </div>
  )
}

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

  return (
    <Fragment>
      {locationDataLoadingState !== 'loaded' && (
        <Spinner isSmall style={{ position: 'absolute', left: 10, top: 10 }} />
      )}

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Title">
          {selectedLocationData?.name} ({selectedLocationData?.iso})
        </h3>

        <EmissionModelDescription emissionModelResult={emissionModelResult} />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">Projected Emissions</h3>
        <EmissionModelChart
          emissionModelResult={emissionModelResult}
          width={385}
          height={200}
        />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">Carbon Stored</h3>
        <StoredCarbonChart
          title="Carbon Stored"
          width={300}
          height={200}
          emissionModelResult={emissionModelResult}
        />
      </div>
    </Fragment>
  )
}

export default EmissionsModelWidget
