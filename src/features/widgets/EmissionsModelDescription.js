import React from 'react'
import _ from 'lodash'
import ResetIcon from 'react-feather/dist/icons/refresh-cw'
import RemoveIcon from 'react-feather/dist/icons/x'
import FileIcon from 'react-feather/dist/icons/file-text'

import NumberInput from './NumberInput'
import { dataColors } from '../../utils/colorUtils'

const TableRow = ({
  title,
  unit,
  unitTitle,
  name,
  seriesInputs = [],
  valueFormatter = (val) => val,
  handleChange,
}) => {
  return (
    <tr className="EmissionsModelWidget--Table--Row">
      <th className="EmissionsModelWidget--Table--Row--Header">
        <span className="EmissionsModelWidget--Table--Row--Header--Name">
          {title}
        </span>
        {!!unit && (
          <span className="EmissionsModelWidget--Table--Row--Header--Unit">
            {' '}
            (<abbr title={unitTitle}>{unit}</abbr>)
          </span>
        )}
      </th>
      {!seriesInputs.length && <ValueCellPlaceholder />}
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
    <td className="EmissionsModelWidget--Table--Row--ValueCell">
      <NumberInput
        name={name}
        value={value}
        onChange={({ name, value }) => handleChange({ name, value, index })}
      />
    </td>
  )
}
const ValueCellPlaceholder = () => (
  <td className="EmissionsModelWidget--Table--Row--ValueCell">
    <span className="EmissionsModelWidget--Table--Row--ValueCellPlaceholder">
      {' '}
    </span>
  </td>
)

const EmissionModelDescription = ({
  seriesInputs = {},
  setInputParams,
  resetInputParams,
  addSeries,
  removeSeries,
  forecastYears,
  setForecastYears,
  isLoaded,
  exportCsv,
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
            unitTitle="Hectares"
            name="current_area_ha"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val)}
          />
          <TableRow
            title="Deforestation rate"
            unit="p.a."
            unitTitle="Per annum"
            name="deforestationRate"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val * 100, 3)}
          />
          <TableRow
            title="Sequestration rate"
            unit="t CO₂e p.a."
            unitTitle="Metric Tonnes of CO₂ equivalent per annum"
            name="sequestrationRate"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
          />
          <TableRow
            title="Carbon stored"
            unit="t CO₂e / ha"
            unitTitle="Metric Tonnes of CO₂ equivalent per hectare"
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
            <td
              className="EmissionsModelWidget--Table--FooterCell"
              style={{ textAlign: 'left' }}
            >
              {isLoaded && (
                <button
                  className="button EmissionsModelWidget--Table--FooterButton"
                  onClick={() => addSeries()}
                >
                  + Add Series
                </button>
              )}
              {isLoaded && (
                <button
                  className="button EmissionsModelWidget--Table--FooterButton"
                  onClick={exportCsv}
                >
                  <FileIcon /> Export CSV
                </button>
              )}
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
                    title="Reset"
                  >
                    <ResetIcon />
                  </button>
                  {!!index > 0 && (
                    <button
                      className="button EmissionsModelWidget--Table--FooterButton"
                      onClick={() => removeSeries({ index })}
                      title="Remove"
                    >
                      <RemoveIcon />
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
