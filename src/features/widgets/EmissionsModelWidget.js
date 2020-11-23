import React, { Fragment, useState } from 'react'

import { useSingleLocationData, useEmissionModel } from '../../utils/dataHooks'

import Spinner from '../../common/Spinner'
import EmissionsModelChart from './EmissionsModelChart'
import EmissionsModelDescription from './EmissionsModelDescription'
import StoredCarbonChart from './StoredCarbonChart'

const EmissionsModelWidget = ({ selectedLocationData }) => {
  const [additionalDataSeries, setAdditionalDataSeries] = useState([])
  const {
    data: locationData,
    loadingState: locationDataLoadingState,
  } = useSingleLocationData({
    locationID: selectedLocationData?.id,
  })

  const {
    emissionModelResult,
    inputParams,
    modifiedInputParams,
    setInputParams,
    resetInputParams,
    isModified,
  } = useEmissionModel({ locationData })

  const addSeries = () => {
    const newDataSeries = {}
    setAdditionalDataSeries((prev) => [...prev, newDataSeries])
  }

  return (
    <Fragment>
      {locationDataLoadingState !== 'loaded' && (
        <Spinner isSmall style={{ position: 'absolute', left: 10, top: 10 }} />
      )}

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Title">
          {selectedLocationData?.name} ({selectedLocationData?.iso})
        </h3>

        <EmissionsModelDescription
          inputParams={inputParams}
          modifiedInputParams={modifiedInputParams}
          setInputParams={setInputParams}
          resetInputParams={resetInputParams}
          isModified={isModified}
        />

        <button onClick={addSeries}>Add Series</button>
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">
          <strong>Projected Emissions</strong> (Mt CO₂e p.a.)
        </h3>
        <EmissionsModelChart
          inputParams={inputParams}
          emissionModelResult={emissionModelResult}
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
          inputParams={inputParams}
        />
      </div>
    </Fragment>
  )
}

export default EmissionsModelWidget
