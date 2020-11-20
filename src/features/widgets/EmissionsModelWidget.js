import React, { Fragment } from 'react'
import _ from 'lodash'

import { useSingleLocationData, useEmissionModel } from '../../utils/dataHooks'

import Spinner from '../../common/Spinner'
import EmissionModelChart from './EmissionsModelChart'
import StoredCarbonChart from './StoredCarbonChart'
import NumberInput from './NumberInput'

const EmissionModelDescription = ({
  emissionModelResult = {},
  inputParams = {},
  modifiedInputParams = {},
  setModifiedInputParams,
}) => {
  const {
    historicalTimeDiff,
    loss_ha,
    deforestationRatePercent,
    sequestrationRate,
    emissionsFactor,
    carbonStoredPerHectare,
  } = inputParams

  const displayVal = (val, round = 10) =>
    _.isNaN(val) ? '_' : _.round(val, round).toLocaleString()

  const handleChange = (e) => {
    let { name, value } = e.target
    setModifiedInputParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="Widgets--Description">
      <div>
        Mangrove {loss_ha < 0 ? 'gain' : 'loss'} of{' '}
        <strong>{displayVal(Math.abs(loss_ha), 0)} ha</strong> over{' '}
        {displayVal(historicalTimeDiff)} years.
      </div>
      <div>
        Deforestation rate of{' '}
        <NumberInput
          name={'deforestationRatePercent'}
          value={deforestationRatePercent}
          unit="% pa"
          onChange={handleChange}
        />
        .
      </div>
      <div>
        Sequestration rate of{' '}
        <NumberInput
          name={'sequestrationRate'}
          value={sequestrationRate}
          unit="t CO₂e per year"
          onChange={handleChange}
        />
        .
      </div>
      <div>
        Carbon Stored{' '}
        <strong>{displayVal(carbonStoredPerHectare, 2)} t CO₂e / ha</strong>.
      </div>
      <div>
        Emissions factor of <strong>{displayVal(emissionsFactor, 2)}</strong>.
      </div>
    </div>
  )
}

const EmissionsModelWidget = ({ selectedLocationData }) => {
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
    setModifiedInputParams,
  } = useEmissionModel({ locationData })

  return (
    <Fragment>
      {locationDataLoadingState !== 'loaded' && (
        <Spinner isSmall style={{ position: 'absolute', left: 10, top: 10 }} />
      )}

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Title">
          {selectedLocationData?.name} ({selectedLocationData?.iso})
        </h3>

        <EmissionModelDescription
          emissionModelResult={emissionModelResult}
          inputParams={inputParams}
          modifiedInputParams={modifiedInputParams}
          setModifiedInputParams={setModifiedInputParams}
        />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">Projected Emissions</h3>
        <EmissionModelChart
          inputParams={inputParams}
          emissionModelResult={emissionModelResult}
          width={385}
          height={200}
        />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">Carbon Stored</h3>

        <StoredCarbonChart
          title="Carbon Stored"
          width={300}
          height={200}
          inputParams={inputParams}
        />
      </div>
    </Fragment>
  )
}

export default EmissionsModelWidget
