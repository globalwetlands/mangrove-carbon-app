import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import _ from 'lodash'

import { m2ToHa } from '../../utils/utils'
import { emission_model } from '../../utils/emission_model'

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

const EmissionModelChart = () => {
  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ]
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="pv"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  )
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
      <pre style={{ width: '100%', overflow: 'scroll' }}>
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
      <EmissionModelChart emissionModelResult={emissionModelResult} />
    </div>
  )
}

export default EmissionsModelWidget
