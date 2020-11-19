import _ from 'lodash'
import dayjs from 'dayjs'

import { m2ToHa } from './utils'
import { emission_model } from './emission_model'

export const loadLocationsData = async ({
  type = 'country', // country, aoi, wdpa
}) => {
  const dataUrl = `/geojson/${type}_locations.json`
  console.log('Loading locations data')
  // await delay(1000)
  const data = fetch(dataUrl).then((res) => res.json())
  return data
}

export const loadSingleLocationData = async (locationID) => {
  console.log(`Loading location ${locationID} data`)
  const dataUrl = `/locations_data/${locationID}.json`
  const data = fetch(dataUrl).then((res) => res.json())
  // await delay(1000)
  return data
}

export function calculateEmissionData(
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
