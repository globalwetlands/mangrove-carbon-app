import React, { useEffect, useState, Fragment } from 'react'
import _ from 'lodash'

import { useSingleLocationData } from '../../utils/dataHooks'
import { calculateEmissionData } from '../../utils/dataUtils'
import Spinner from '../../common/Spinner'
import EmissionModelChart from './EmissionsModelChart'
import StoredCarbonChart from './StoredCarbonChart'
import NumberInput from './NumberInput'

const EmissionModelDescription = ({ emissionModelResult = {} }) => {
  const {
    historicalTimeDiff,
    loss_ha,
    area_ha,
    deforestationRatePercent,
    sequestrationRate,
    emissionsFactor,
    carbonStoredPerHectare,
  } = emissionModelResult

  const displayVal = (val, round = 10) =>
    _.isNaN(val) ? '_' : _.round(val, round).toLocaleString()

  return (
    <div className="Widgets--Description">
      <div>
        Mangrove {loss_ha < 0 ? 'gain' : 'loss'} of{' '}
        <strong>{displayVal(Math.abs(loss_ha), 0)} ha</strong> over{' '}
        {displayVal(historicalTimeDiff)} years.
      </div>
      <div>
        Mangrove Extent <strong>{displayVal(area_ha, 0)} ha</strong>.
      </div>
      <div>
        Deforestation rate of{' '}
        <strong>
          <NumberInput
            value={displayVal(deforestationRatePercent * 100, 2)}
            width={50}
            unit="% pa"
          />
        </strong>
        .
      </div>
      <div>
        Sequestration rate of{' '}
        <strong>{displayVal(sequestrationRate)} t CO₂e per year</strong>.
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

  const [emissionModelResult, setEmissionModelResult] = useState()

  useEffect(() => {
    if (locationData) {
      const emissionModelResult = calculateEmissionData(locationData)
      setEmissionModelResult(emissionModelResult)
    } else {
      setEmissionModelResult(undefined)
    }
  }, [locationData])

  return (
    <Fragment>
      {locationDataLoadingState !== 'loaded' && (
        <Spinner isSmall style={{ position: 'absolute', left: 10, top: 10 }} />
      )}

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Title">
          {selectedLocationData?.name} ({selectedLocationData?.iso})
        </h3>

        <EmissionModelDescription emissionModelResult={emissionModelResult} />
      </div>

      <div className="Widgets--Box--Column">
        <h3 className="Widgets--Box--Column--Title">Projected Emissions</h3>
        <EmissionModelChart
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
          emissionModelResult={emissionModelResult}
        />
      </div>
    </Fragment>
  )
}

export default EmissionsModelWidget
