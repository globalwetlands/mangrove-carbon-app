import React, { useMemo, useState } from 'react'
import { PieChart, Pie, Legend } from 'recharts'
import _ from 'lodash'

import { tToMt } from '../../utils/utils'
import { colors } from '../../utils/colorUtils'

const StoredCarbonChart = ({ width, height, emissionModelResult = {} }) => {
  const [activeIndex, setActiveIndex] = useState()
  const outerRadius = 0.45 * Math.min(width, height)
  const innerRadius = 0.3 * Math.min(width, height)
  const cx = width / 2
  const cy = height / 2

  const chartData = useMemo(() => {
    const palette = [colors.green['300'], colors.deepOrange['300']]
    const {
      agb_tco2e, // above ground total CO2e grams
      // bgb_tco2e, // below ground total CO2e grams
      soc_tco2e,
    } = emissionModelResult

    // agb_tco2e + soc_tco2e = toc_tco2e

    return [
      { name: 'AGB', value: tToMt(agb_tco2e), fill: palette[0] },
      {
        name: 'SOC',
        value: tToMt(soc_tco2e),
        fill: palette[1],
      },
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
        cx={cx - 76}
        cy={cy}
        paddingAngle={2}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        // label={({ name }) => {
        //   return `${name}`
        // }}
        // labelLine={false}
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

      <Legend
        verticalAlign="bottom"
        align="left"
        layout="vertical"
        width={75}
      />
    </PieChart>
  )
}

export default StoredCarbonChart
