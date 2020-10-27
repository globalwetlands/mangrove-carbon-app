import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import _ from 'lodash'

const EmissionModelChart = ({ emissionModelResult = {} }) => {
  const { results = [] } = emissionModelResult
  const data = results.map((value, index) => ({
    name: index + 1, // year
    value,
  }))

  const formatNumber = (num) => _.round(num).toLocaleString()

  return (
    <ResponsiveContainer width={'100%'} height={200}>
      <LineChart
        width={385}
        height={200}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="5 5" strokeOpacity={0.5} />
        <XAxis
          dataKey="name"
          // label="Years"
        />
        <YAxis tickFormatter={(c) => formatNumber(c)} type="number" />
        <Tooltip
          formatter={(val, name, props) => {
            return [formatNumber(val), name]
          }}
        />
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default EmissionModelChart
