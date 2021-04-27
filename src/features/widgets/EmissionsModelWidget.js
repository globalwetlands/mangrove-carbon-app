import React from 'react'
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import { useSingleLocationData, useEmissionModel } from '../../utils/dataHooks'

import Spinner from '../../common/Spinner'
import EmissionsModelChart from './EmissionsModelChart'
import EmissionsModelDescription from './EmissionsModelDescription'
import SelectInput from './SelectInput'
import InfoPopup from '../../common/InfoPopup'
import { emissionModelSeriesReducer, exportCsv } from '../../utils/dataUtils'
import {
  setCarbonPrice,
  setEmissionsChartYAxis,
  setForecastYears,
} from '../../redux/widgetSettingsSlice'

const EmissionsModelWidget = ({
  selectedLocationData,
  exportCsvResultsFilenamePrefix = 'MangroveCarbon_forecast_',
}) => {
  const {
    data: locationData,
    loadingState: locationDataLoadingState,
  } = useSingleLocationData({
    locationID: selectedLocationData?.id,
  })

  const dispatch = useDispatch()

  const forecastYears = useSelector(
    (state) => state.widgetSettings.forecastYears
  )
  const emissionsChartYAxis = useSelector(
    (state) => state.widgetSettings.emissionsChartYAxis
  )
  const carbonPrice = useSelector((state) => state.widgetSettings.carbonPrice)

  const {
    seriesResults,
    seriesInputs = [],
    formatSeriesValuesByKey,
    userModifiedKeys,
    setInputParams,
    resetInputParams,
    addSeries,
    removeSeries,
    forecastStartingYear,
  } = useEmissionModel({ locationData, forecastYears })

  const exportEmissionResultsCsv = () => {
    const data = emissionModelSeriesReducer({
      seriesResults,
      forecastStartingYear,
    })

    const formatSeriesName = (value, key) => {
      const re = /series_(\d+)/g
      const result = re.exec(key)
      let index = parseInt(result[1])
      const prettyName = `Series ${index + 1} (t CO2e)`
      const snakeName = `series_${index + 1}_tco2e`
      return snakeName
    }

    const mapData = (row) => {
      const { name, ...rest } = row

      // Change series_0 -> series_1
      const seriesResults = _.mapKeys(rest, formatSeriesName)
      const updatedRow = { year: name, ...seriesResults }
      return updatedRow
    }

    const dataMapped = data.map(mapData)
    const filename = `${exportCsvResultsFilenamePrefix}${new Date()}.csv`
    exportCsv({ data: dataMapped, filename })
  }

  return (
    <div className="Widgets--Box--Inner">
      {locationDataLoadingState !== 'loaded' && (
        <Spinner isSmall style={{ position: 'absolute', left: 10, top: 10 }} />
      )}

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Title">
          {selectedLocationData?.name} ({selectedLocationData?.iso})
        </h3>

        <EmissionsModelDescription
          seriesInputs={seriesInputs}
          userModifiedKeys={userModifiedKeys}
          formatSeriesValuesByKey={formatSeriesValuesByKey}
          setInputParams={setInputParams}
          resetInputParams={resetInputParams}
          addSeries={addSeries}
          removeSeries={removeSeries}
          forecastYears={forecastYears}
          setForecastYears={(val) => dispatch(setForecastYears(val))}
          carbonPrice={carbonPrice}
          showCarbonPrice={emissionsChartYAxis === 'price'}
          setCarbonPrice={(val) => dispatch(setCarbonPrice(val))}
          isLoaded={locationDataLoadingState === 'loaded'}
          exportCsv={exportEmissionResultsCsv}
        />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">
          <strong>
            Projected Emissions{' '}
            <InfoPopup
              title={'Projected Emissions'}
              content={
                emissionsChartYAxis === 'price'
                  ? 'Estimated projected emissions per annum measured in USD'
                  : 'Cumulative projected emissions measured in megatonnes of CO₂e'
              }
            />
          </strong>
          <EmissionsMetricSelect />
        </h3>
        <EmissionsModelChart
          seriesInputs={seriesInputs}
          seriesResults={seriesResults}
          forecastStartingYear={forecastStartingYear}
          width={385}
          height={250}
        />
      </div>
    </div>
  )
}

const EmissionsMetricSelect = () => {
  const dispatch = useDispatch()

  const emissionsChartYAxis = useSelector(
    (state) => state.widgetSettings.emissionsChartYAxis
  )

  const handleChange = (val) => {
    dispatch(setEmissionsChartYAxis(val))
  }
  const options = [
    {
      name: 'Mt CO₂e',
      value: 'mtco2e',
    },
    {
      name: 'Price (USD)',
      value: 'price',
    },
  ]

  return (
    <SelectInput
      options={options}
      onChange={handleChange}
      selectedValue={emissionsChartYAxis}
    />
  )
}

export default EmissionsModelWidget
