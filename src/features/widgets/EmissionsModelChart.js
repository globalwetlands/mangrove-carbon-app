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
          // tickFormatter={(c) => 2016 + c}
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
          formatter={(val, name, props) => {
            return [formatNumber(val), name]
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
    </ResponsiveContainer>
  )
}

export default EmissionModelChart
