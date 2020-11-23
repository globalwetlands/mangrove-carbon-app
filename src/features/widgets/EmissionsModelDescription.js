import React, { useMemo } from 'react'
import _ from 'lodash'

import NumberInput from './NumberInput'

const TableRow = ({
  title,
  unit,
  name,
  series = [],
  valueFormatter = (val) => val,
  handleChange,
}) => (
  <tr className="EmissionsModelWidget--Table--Row">
    <th>
      {title}
      {!!unit ? ` (${unit})` : ''}
    </th>
    {series.map((inputParams, index) => (
      <ValueCell
        name={name}
        value={valueFormatter(inputParams[name])}
        index={index}
        handleChange={handleChange}
      />
    ))}
  </tr>
)

const ValueCell = ({ name, value, index, handleChange }) => {
  return (
    <td
      className="EmissionsModelWidget--Table--Row--ValueCell"
      key={`ValueCell-${index}`}
    >
      <NumberInput
        name={name}
        value={value}
        onChange={({ name, value }) => handleChange({ name, value, index })}
      />
    </td>
  )
}

const EmissionModelDescription = ({
  inputParams = {},
  setInputParams,
  resetInputParams,
  isModified,
}) => {
  const handleChange = ({ name, value, index }) => {
    if (name === 'deforestationRate') {
      value /= 100
    }
    setInputParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const series = useMemo(() => {
    return [inputParams]
  }, [inputParams])

  return (
    <div className="Widgets--Description">
      <table className="EmissionsModelWidget--Table">
        <thead>
          <tr>
            <th></th>
            {series.map((val, index) => (
              <th
                className="EmissionsModelWidget--Table--SeriesHeader"
                key={`thead-${index}`}
              >
                Series {index + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <TableRow
            title="Mangrove extent"
            unit="ha"
            name="current_area_ha"
            series={series}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val)}
          />
          <TableRow
            title="Deforestation rate"
            unit="p.a."
            name="deforestationRate"
            series={series}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val * 100, 3)}
          />
          <TableRow
            title="Sequestration rate"
            unit="t CO₂e p.a."
            name="sequestrationRate"
            series={series}
            handleChange={handleChange}
          />
          <TableRow
            title="Carbon Stored"
            unit="t CO₂e / ha"
            name="carbonStoredPerHectare"
            series={series}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val, 2)}
          />
          <TableRow
            title="Emissions factor"
            name="emissionsFactor"
            series={series}
            handleChange={handleChange}
          />
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            {series.map((inputParams, index) => {
              return (
                <td
                  className="EmissionsModelWidget--Table--FooterCell"
                  key={`tfoot-${index}`}
                >
                  <button className="button" onClick={resetInputParams}>
                    Reset
                  </button>
                </td>
              )
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default EmissionModelDescription
