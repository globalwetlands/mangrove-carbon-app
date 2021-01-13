import React from 'react'
import _ from 'lodash'
import ResetIcon from 'react-feather/dist/icons/refresh-cw'
import RemoveIcon from 'react-feather/dist/icons/x'
import FileIcon from 'react-feather/dist/icons/file-text'

import NumberInput from './NumberInput'
import { dataColors } from '../../utils/colorUtils'
import InfoPopup from '../../common/InfoPopup'
import Abbr from '../../common/Abbr'
import './EmissionsModelDescription.css'

const TableRow = ({
  title,
  unit,
  unitTitle,
  name,
  seriesInputs = [],
  valueFormatter = (val) => val,
  handleChange,
  min,
  max,
  infoPopupContent,
  infoPopupTitle,
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
            (<Abbr title={unitTitle}>{unit}</Abbr>)
          </span>
        )}
        {infoPopupContent && (
          <InfoPopup content={infoPopupContent} title={infoPopupTitle} />
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
          min={min}
          max={max}
        />
      ))}
    </tr>
  )
}

const ValueCell = ({ name, value, index, handleChange, min, max }) => {
  return (
    <td className="EmissionsModelWidget--Table--Row--ValueCell">
      <NumberInput
        name={name}
        value={value}
        onChange={({ name, value }) => handleChange({ name, value, index })}
        min={min}
        max={max}
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
  carbonPrice,
  setCarbonPrice,
  showCarbonPrice,
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
            infoPopupTitle="Mangrove extent"
            infoPopupContent="Area covered by mangroves measured in hectares."
          />
          <TableRow
            title="Deforestation rate"
            unit="p.a."
            unitTitle="Per annum"
            name="deforestationRate"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val * 100, 3)}
            infoPopupTitle="Deforestation rate"
            infoPopupContent="Rate at which mangroves are cleared per annum measured in %"
          />
          <TableRow
            title="Sequestration rate"
            unit="t CO₂e p.a."
            unitTitle="Metric Tonnes of CO₂ equivalent per annum"
            name="sequestrationRate"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
            infoPopupTitle="Sequestration rate"
            infoPopupContent="Rate at which carbon is sequestered per annum measured in metric tonnes of CO₂e per annum."
          />
          <TableRow
            title="Carbon stored"
            unit="t CO₂e / ha"
            unitTitle="Metric Tonnes of CO₂ equivalent per hectare"
            name="carbonStoredPerHectare"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
            valueFormatter={(val) => _.round(val, 2)}
            infoPopupTitle="Carbon stored"
            infoPopupContent="The amount of carbon stored per hectare of mangroves measured in metric tonnes of CO₂e per hectare."
          />
          {/* <TableRow
            title="Emissions factor"
            name="emissionsFactor"
            seriesInputs={seriesInputs}
            handleChange={handleChange}
          /> */}
          <TableRow
            title="Forecast Years"
            name="forecastYears"
            seriesInputs={[{ forecastYears }]}
            handleChange={({ name, value }) => setForecastYears(value)}
            valueFormatter={(val) => Math.abs(val)}
            infoPopupTitle="Forecast Years"
            infoPopupContent="The number of years you would like to see projections for."
          />
          {showCarbonPrice && (
            <TableRow
              title="Carbon Price"
              name="carbonPrice"
              unit="USD / t"
              unitTitle="US Dollars per metric tonne of CO₂ equivalent"
              seriesInputs={[{ carbonPrice }]}
              handleChange={({ name, value }) => setCarbonPrice(value)}
              valueFormatter={(val) => Math.abs(val)}
              min={0}
              max={999}
              infoPopupTitle="Carbon Price"
              infoPopupContent="The cost per tonne of carbon in USD."
            />
          )}
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
