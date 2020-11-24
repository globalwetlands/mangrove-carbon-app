import React from 'react'
import _ from 'lodash'

import NumberInput from './NumberInput'
import { dataColors } from '../../utils/colorUtils'

const TableRow = ({
  title,
  unit,
  name,
  seriesInputs = [],
  valueFormatter = (val) => val,
  handleChange,
}) => {
  return (
    <tr className="EmissionsModelWidget--Table--Row">
      <th className="EmissionsModelWidget--Table--Row--Header">
        {title}
        {!!unit ? ` (${unit})` : ''}
      </th>
      {seriesInputs.map((inputParams, index) => (
        <ValueCell
          key={`${name}-${index}`}
          name={name}
          value={valueFormatter(inputParams[name])}
          index={index}
          handleChange={handleChange}
        />
      ))}
    </tr>
  )
}

const ValueCell = ({ name, value, index, handleChange }) => {
  return (
    <td
      className="EmissionsModelWidget--Table--Row--ValueCell"
      key={`ValueCell-${name}-${index}`}
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
  seriesInputs = {},
  setInputParams,
  resetInputParams,
  addSeries,
  removeSeries,
  forecastYears,
  setForecastYears,
}) => {
  const handleChange = ({ name, value, index }) => {
    if (name === 'deforestationRate') {
      value /= 100
    }
    setInputParams({ index, inputParams: { [name]: value } })
  }
  return (
    <div className="Widgets--Description">
      <table className="EmissionsModelWidget--Table">
        <thead>
          <tr>
            <th></th>
            {seriesInputs.length > 1 &&
              seriesInputs.map((val, index) => (
                <th
                  className="EmissionsModelWidget--Table--SeriesHeader"
                  key={`thead-${index}`}
                  style={{
                    color: dataColors[index],
                  }}
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
            seriesInputs={seriesInputs}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val)}
          />
          <TableRow
            title="Deforestation rate"
            unit="p.a."
            name="deforestationRate"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val * 100, 3)}
          />
          <TableRow
            title="Sequestration rate"
            unit="t CO₂e p.a."
            name="sequestrationRate"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
          />
          <TableRow
            title="Carbon Stored"
            unit="t CO₂e / ha"
            name="carbonStoredPerHectare"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val, 2)}
          />
          <TableRow
            title="Emissions factor"
            name="emissionsFactor"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
          />
          <TableRow
            title="Forecast Years"
            name="forecastYears"
            seriesInputs={[{ forecastYears }]}
            handleChange={({ name, value }) => setForecastYears(value)}
            valueFormatter={(val) => Math.abs(val)}
          />
        </tbody>
        <tfoot>
          <tr>
            <td>
              <button
                className="button EmissionsModelWidget--Table--FooterButton"
                onClick={() => addSeries()}
              >
                + Add Series
              </button>
            </td>
            {seriesInputs.map((inputParams, index) => {
              return (
                <td
                  className="EmissionsModelWidget--Table--FooterCell"
                  key={`tfoot-${index}`}
                >
                  <button
                    className="button EmissionsModelWidget--Table--FooterButton"
                    onClick={() => resetInputParams({ index })}
                  >
                    Reset
                  </button>
                  {!!index > 0 && (
                    <button
                      className="button EmissionsModelWidget--Table--FooterButton"
                      onClick={() => removeSeries({ index })}
                    >
                      Delete
                    </button>
                  )}
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
