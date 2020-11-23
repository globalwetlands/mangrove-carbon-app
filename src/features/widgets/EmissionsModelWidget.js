import React, { Fragment } from 'react'
import _ from 'lodash'

import { useSingleLocationData, useEmissionModel } from '../../utils/dataHooks'

import Spinner from '../../common/Spinner'
import EmissionModelChart from './EmissionsModelChart'
import StoredCarbonChart from './StoredCarbonChart'
import NumberInput from './NumberInput'

const EmissionModelDescription = ({
  inputParams = {},
  setInputParams,
  resetInputParams,
  isModified,
}) => {
  const {
    deforestationRate,
    sequestrationRate,
    emissionsFactor,
    carbonStoredPerHectare,
    current_area_ha,
  } = inputParams

  const handleChange = ({ name, value }) => {
    if (name === 'deforestationRate') {
      value /= 100
    }
    setInputParams((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="Widgets--Description">
      <div>
        Mangrove extent:{' '}
        <NumberInput
          name={'current_area_ha'}
          value={_.round(current_area_ha)}
          unit="ha"
          onChange={handleChange}
        />
        .
      </div>
      {/* <div>
        Mangrove {loss_ha < 0 ? 'gain' : 'loss'} of{' '}
        <strong>{displayVal(Math.abs(loss_ha), 0)} ha</strong> over{' '}
        {displayVal(historicalTimeDiff)} years.
      </div> */}
      <div>
        Deforestation rate of{' '}
        <NumberInput
          name={'deforestationRate'}
          value={_.round(deforestationRate * 100, 3)}
          unit=" pa"
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
        <NumberInput
          name={'carbonStoredPerHectare'}
          value={_.round(carbonStoredPerHectare, 2)}
          unit=" t CO₂e / ha"
          onChange={handleChange}
        />
        .
      </div>
      <div>
        Emissions factor of{' '}
        <NumberInput
          name={'emissionsFactor'}
          value={emissionsFactor}
          onChange={handleChange}
        />
        .
      </div>
      {isModified && (
        <button className="button" onClick={resetInputParams}>
          Reset Inputs
        </button>
      )}
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
    setInputParams,
    resetInputParams,
    isModified,
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
          setInputParams={setInputParams}
          resetInputParams={resetInputParams}
          isModified={isModified}
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
