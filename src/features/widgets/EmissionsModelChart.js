import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from 'recharts'
import _ from 'lodash'

import { tToMt } from '../../utils/utils'
import { dataColors } from '../../utils/colorUtils'

const emissionModelSeriesReducer = (acc, results, seriesIndex) => {
  const parsedResults = results.map((value, yearIndex) => ({
    name: yearIndex, // year
    [`series_${seriesIndex}`]: value,
  }))

  acc = parsedResults.map((results) => {
    let match = acc.find(({ name }) => name === results.name) || {}
    match = { ...match, ...results }
    return match
  })

  return acc
}

const EmissionModelChart = ({
  seriesResults = [],
  forecastStartingYear,
  width = 385,
  height = 225,
}) => {
  const data = seriesResults.reduce(emissionModelSeriesReducer, [])

  const formatNumber = (num) => _.round(tToMt(num), 2).toLocaleString()
  const formatYear = (c) => forecastStartingYear + c
  const formatTooltipLabel = (val) => `${formatYear(val)} emissions`
  const formatTooltipValue = (val) => `${formatNumber(val)} Mt CO₂e`

  return (
    <LineChart
      width={width}
      height={height}
      data={data}
      margin={{
        top: 5,
        right: 40,
        left: 0,
        bottom: 25,
      }}
    >
      <CartesianGrid
        strokeDasharray="5 5"
        strokeOpacity={0.5}
        vertical={false}
      />
      <XAxis
        dataKey="name"
        // label="Years"
        axisLine={false}
        tickMargin={5}
        tickCount={10}
        tickFormatter={formatYear}
        interval="preserveStartEnd"
        domain={[0, 'dataMax']}
        type="number"
      >
        <Label value="Year" position="bottom" />
      </XAxis>
      <YAxis
        orientation="right"
        axisLine={false}
        tickFormatter={(c) => formatNumber(c)}
        type="number"
        tickLine={false}
        tickMargin={5}
      >
        {/* <Label
          value="Mg CO2 emitted"
          angle={-90}
          offset={-2}
          position="insideBottomLeft"
        /> */}
      </YAxis>
      <Tooltip
        labelFormatter={(val, name, props) => {
          return formatTooltipLabel(val)
        }}
        formatter={(val, name, props) => {
          return [formatTooltipValue(val), null]
        }}
      />
      {/* <Legend /> */}
      {seriesResults.map((val, seriesIndex) => (
        <Line
          key={`series_${seriesIndex}`}
          dataKey={`series_${seriesIndex}`}
          type="monotone"
          stroke={dataColors[seriesIndex]}
          strokeWidth={2}
          activeDot={{ r: 8 }}
          dot={false}
        />
      ))}
    </LineChart>
  )
}

export default EmissionModelChart
