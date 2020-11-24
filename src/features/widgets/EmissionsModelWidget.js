import React from 'react'

import { useSingleLocationData, useEmissionModel } from '../../utils/dataHooks'

import Spinner from '../../common/Spinner'
import EmissionsModelChart from './EmissionsModelChart'
import EmissionsModelDescription from './EmissionsModelDescription'
import StoredCarbonChart from './StoredCarbonChart'

const EmissionsModelWidget = ({ selectedLocationData }) => {
  const {
    data: locationData,
    loadingState: locationDataLoadingState,
  } = useSingleLocationData({
    locationID: selectedLocationData?.id,
  })

  const {
    seriesResults,
    seriesInputs,
    setInputParams,
    resetInputParams,
    addSeries,
    removeSeries,
  } = useEmissionModel({ locationData })

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
        />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">
          <strong>Projected Emissions</strong> (Mt CO₂e p.a.)
        </h3>
        <EmissionsModelChart
          seriesInputs={seriesInputs}
          seriesResults={seriesResults}
          width={385}
          height={225}
        />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">
          <strong>Carbon Stored</strong> (Mt CO₂e)
        </h3>

        <StoredCarbonChart
          title="Carbon Stored"
          width={300}
          height={225}
          inputParams={seriesInputs[0]}
        />
      </div>
    </div>
  )
}

export default EmissionsModelWidget
