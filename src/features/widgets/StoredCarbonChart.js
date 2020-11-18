import React, { useMemo, useState } from 'react'
import { PieChart, Pie } from 'recharts'
import _ from 'lodash'

import { tToMt } from '../../utils/utils'

const StoredCarbonChart = ({ width, height, emissionModelResult = {} }) => {
  const [activeIndex, setActiveIndex] = useState()
  const outerRadius = 0.45 * Math.min(width, height)
  const innerRadius = 0.35 * Math.min(width, height)
  const cx = width / 2
  const cy = height / 2

  const chartData = useMemo(() => {
    const {
      agb_tco2e, // above ground total CO2e grams
      bgb_tco2e, // below ground total CO2e grams
      soc_tco2e,
    } = emissionModelResult

    return [
      { name: 'agb_tco2e', value: agb_tco2e / 1000, fill: 'orange' },
      { name: 'bgb_tco2e', value: bgb_tco2e / 1000, fill: 'coral' },
      // { name: 'toc_tco2e', value: toc_tco2e, fill: 'orange' },
      { name: 'soc_tco2e', value: soc_tco2e / 1000, fill: 'lightsalmon' },
    ]
  }, [emissionModelResult])

  const totalValue = _.round(
    tToMt(emissionModelResult?.toc_tco2e || 0),
    1
  ).toLocaleString()

  return (
    <PieChart width={width} height={height}>
      <Pie
        activeIndex={activeIndex}
        onMouseEnter={(data, index) => setActiveIndex(index)}
        data={chartData}
        dataKey="value"
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        // label
      />
      <text x={cx} y={cy - 20} textAnchor="middle">
        <tspan x={cx} dy="0">
          Total
        </tspan>

        <tspan x={cx} dy="1.2em" fontSize={25}>
          {totalValue}
        </tspan>
        <tspan x={cx} dy="1.7em">
          Mt CO₂e
        </tspan>
      </text>
    </PieChart>
  )
}

export default StoredCarbonChart
