import React from 'react'
import { useDispatch } from 'react-redux'
import ResetIcon from 'react-feather/dist/icons/refresh-cw'
import RemoveIcon from 'react-feather/dist/icons/x'
import FileIcon from 'react-feather/dist/icons/file-text'

import NumberInput from './NumberInput'
import { dataColors } from '../../utils/colorUtils'
import InfoPopup from '../../common/InfoPopup'
import Abbr from '../../common/Abbr'
import { resetForecastYears } from '../../redux/widgetSettingsSlice'
import './EmissionsModelDescription.css'

const TableRow = ({
  title,
  unit,
  unitTitle,
  name,
  seriesInputs = [],
  userModifiedKeys,
  valueFormatter = (val) => val,
  formatSeriesValuesByKey = {},
  handleChange,
  min,
  max,
  infoPopupContent,
  infoPopupTitle,
}) => {
  const isModified = userModifiedKeys.includes(name)

  if (Object.keys(formatSeriesValuesByKey).includes(name)) {
    valueFormatter = formatSeriesValuesByKey[name]
  }
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
      {seriesInputs.map((inputParams, index) => {
        return (
          <ValueCell
            key={`${name}-${index}`}
            name={name}
            isModified={index === 0 && isModified}
            value={valueFormatter(inputParams[name])}
            index={index}
            handleChange={handleChange}
            min={min}
            max={max}
          />
        )
      })}
    </tr>
  )
}

const ValueCell = ({
  name,
  value,
  index,
  handleChange,
  min,
  max,
  isModified,
}) => {
  return (
    <td
      className="EmissionsModelWidget--Table--Row--ValueCell"
      data-ismodified={isModified}
    >
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

const EmissionsModelDescription = ({
  seriesInputs = {},
  formatSeriesValuesByKey,
  userModifiedKeys,
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
  const dispatch = useDispatch()
  const handleChange = ({ name, value, index }) => {
    setInputParams({ index, inputParams: { [name]: value } })
  }
  const handleResetSeries = ({ index }) => {
    resetInputParams({ index })
    if (index === 0) {
      dispatch(resetForecastYears())
    }
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
            userModifiedKeys={userModifiedKeys}
            handleChange={handleChange}
            formatSeriesValuesByKey={formatSeriesValuesByKey}
            infoPopupTitle="Mangrove extent"
            infoPopupContent="Area covered by mangroves measured in hectares."
          />
          <TableRow
            title="Deforestation rate"
            unit="% p.a."
            unitTitle="% per annum"
            name="deforestationRatePercent"
            seriesInputs={seriesInputs}
            userModifiedKeys={userModifiedKeys}
            handleChange={handleChange}
            formatSeriesValuesByKey={formatSeriesValuesByKey}
            infoPopupTitle="Deforestation rate"
            infoPopupContent="Rate at which mangroves are cleared per annum measured in %"
          />
          <TableRow
            title="Sequestration rate"
            unit="t CO₂e p.a."
            unitTitle="Metric Tonnes of CO₂ equivalent per annum"
            name="sequestrationRate"
            seriesInputs={seriesInputs}
            userModifiedKeys={userModifiedKeys}
            formatSeriesValuesByKey={formatSeriesValuesByKey}
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
            userModifiedKeys={userModifiedKeys}
            handleChange={handleChange}
            formatSeriesValuesByKey={formatSeriesValuesByKey}
            infoPopupTitle="Carbon stored"
            infoPopupContent="The amount of carbon stored per hectare of mangroves that can be emitted, measured in metric tonnes of CO₂e per hectare."
          />
          {/* <TableRow
            title="Emissions factor"
            name="emissionsFactor"
            seriesInputs={seriesInputs}
            userModifiedKeys={userModifiedKeys}
            handleChange={handleChange}
            formatSeriesValuesByKey={formatSeriesValuesByKey}
          /> */}
          <TableRow
            title="Forecast Years"
            name="forecastYears"
            seriesInputs={[{ forecastYears }]}
            userModifiedKeys={userModifiedKeys}
            handleChange={({ name, value }) => setForecastYears(value)}
            formatSeriesValuesByKey={formatSeriesValuesByKey}
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
              userModifiedKeys={userModifiedKeys}
              handleChange={({ name, value }) => setCarbonPrice(value)}
              formatSeriesValuesByKey={formatSeriesValuesByKey}
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
                    onClick={() => handleResetSeries({ index })}
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

export default EmissionsModelDescription
