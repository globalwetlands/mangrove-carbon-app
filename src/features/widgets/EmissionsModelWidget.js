import React from 'react'

import { useSingleLocationData, useEmissionModel } from '../../utils/dataHooks'

import Spinner from '../../common/Spinner'
import EmissionsModelChart from './EmissionsModelChart'
import EmissionsModelDescription from './EmissionsModelDescription'
import StoredCarbonChart from './StoredCarbonChart'
import { emissionModelSeriesReducer, exportCsv } from '../../utils/dataUtils'
import { useDispatch, useSelector } from 'react-redux'
import { setForecastYears } from '../../redux/widgetSettingsSlice'

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

  const {
    seriesResults,
    seriesInputs,
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
    const mapData = (row) => {
      const { name, ...rest } = row
      let updatedRow = { year: name, ...rest }
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
          setInputParams={setInputParams}
          resetInputParams={resetInputParams}
          addSeries={addSeries}
          removeSeries={removeSeries}
          forecastYears={forecastYears}
          setForecastYears={(val) => dispatch(setForecastYears(val))}
          isLoaded={locationDataLoadingState === 'loaded'}
          exportCsv={exportEmissionResultsCsv}
        />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">
          <strong>Projected Emissions</strong> (
          <abbr title="Megatonnes of CO₂ equivalent">Mt CO₂e</abbr>)
        </h3>
        <EmissionsModelChart
          seriesInputs={seriesInputs}
          seriesResults={seriesResults}
          forecastStartingYear={forecastStartingYear}
          width={385}
          height={250}
        />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">
          <strong>Carbon Stored</strong> (
          <abbr title="Megatonnes of CO₂ equivalent">Mt CO₂e</abbr>)
        </h3>

        <StoredCarbonChart
          width={300}
          height={250}
          inputParams={seriesInputs[0]}
        />
      </div>
    </div>
  )
}

export default EmissionsModelWidget
