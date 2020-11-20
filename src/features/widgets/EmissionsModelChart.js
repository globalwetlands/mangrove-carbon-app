import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Label,
} from 'recharts'
import _ from 'lodash'

import { tToMt } from '../../utils/utils'

const EmissionModelChart = ({
  inputParams = {},
  emissionModelResult = [],
  width = 385,
  height = 200,
}) => {
  const data = emissionModelResult.map((value, index) => ({
    name: index + 1, // year
    value,
  }))

  const formatNumber = (num) => _.round(tToMt(num), 2).toLocaleString()
  const formatYear = (c) => 2016 + c
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
        bottom: 5,
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
      />
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
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        strokeWidth={2}
        activeDot={{ r: 8 }}
        dot={false}
      />
    </LineChart>
  )
}

export default EmissionModelChart
