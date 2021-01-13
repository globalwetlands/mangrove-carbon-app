import React, { useMemo } from 'react'
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
import { emissionModelSeriesReducer } from '../../utils/dataUtils'
import { useSelector } from 'react-redux'

const EmissionsModelChart = ({
  seriesResults = [],
  forecastStartingYear,
  width = 385,
  height = 225,
}) => {
  const emissionsChartYAxis = useSelector(
    (state) => state.widgetSettings.emissionsChartYAxis
  )
  const carbonPrice = useSelector((state) => state.widgetSettings.carbonPrice)

  const conversionRate = useMemo(() => {
    let rate = 1
    if (emissionsChartYAxis === 'price') {
      rate = carbonPrice / 1000
    }
    return rate
  }, [emissionsChartYAxis, carbonPrice])

  const metricSuffix = {
    price: {
      select: 'USD',
      yAxis: 'b',
      yAxisSmallValue: 'm',
    },
    mtco2e: {
      select: 'Mt CO₂e',
      yAxis: ' Mt',
    },
  }

  const data = emissionModelSeriesReducer({
    seriesResults,
    forecastStartingYear,
    conversionRate,
  })

  const formatNumber = (num) => _.round(tToMt(num), 2).toLocaleString()
  const formatYAxis = (num) => {
    if (num < 1000000 && metricSuffix[emissionsChartYAxis].yAxisSmallValue) {
      // if value less than 0.01b
      let suffix = metricSuffix[emissionsChartYAxis].yAxisSmallValue
      return `${formatNumber(num * 1000)}${suffix}`
    } else {
      let suffix = metricSuffix[emissionsChartYAxis].yAxis
      return `${formatNumber(num)}${suffix}`
    }
  }
  const formatYear = (c) => c
  const formatTooltipLabel = (val) => `${formatYear(val)} emissions`
  const formatTooltipValue = (val) => {
    if (val < 1000000 && metricSuffix[emissionsChartYAxis].yAxisSmallValue) {
      // if value less than 0.01b
      let suffix = metricSuffix[emissionsChartYAxis].yAxisSmallValue
      return `${formatNumber(val * 1000)}${suffix}`
    } else {
      let suffix = metricSuffix[emissionsChartYAxis].yAxis
      return `${formatNumber(val)}${suffix}`
    }
  }

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
        domain={[forecastStartingYear - 1, 'dataMax']}
        tickFormatter={formatYear}
        interval="preserveStartEnd"
        type="number"
      >
        <Label value="Year" position="bottom" />
      </XAxis>
      <YAxis
        orientation="right"
        axisLine={false}
        tickFormatter={(c) => formatYAxis(c)}
        type="number"
        tickLine={false}
        tickMargin={5}
      />
      <Tooltip
        labelFormatter={(val, name, props) => {
          return formatTooltipLabel(val)
        }}
        formatter={(val, name, props) => {
          return [formatTooltipValue(val), null]
        }}
      />
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

export default EmissionsModelChart
