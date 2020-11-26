import React, { useEffect, useState, useCallback } from 'react'
import {
  InteractiveMap as MapGL,
  NavigationControl,
  Source,
  Layer,
  WebMercatorViewport,
  FlyToInterpolator,
} from 'react-map-gl'
import _ from 'lodash'
import bbox from '@turf/bbox'

import { useLocationsData } from '../../utils/dataHooks'
import Spinner from '../../common/Spinner'
import './Map.css'
import { colors } from '../../utils/colorUtils'
import { normalise } from '../../utils/utils'

const Map = ({ setSelectedLocationData }) => {
  const mapboxApiAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
  const mapStyle = 'mapbox://styles/mapbox/light-v9'

  const countryLocations = useLocationsData({ type: 'country' })
  // const wdpaLocations = useLocationsData({ type: 'wdpa' })
  // const aoiLocations = useLocationsData({ type: 'aoi' })

  const [viewport, setViewport] = useState({
    // width: 400,
    // height: 400,
    latitude: 20,
    longitude: 0,
    zoom: 2,
    minZoom: 2,
  })

  const [tooltip, setTooltip] = useState({})
  const [mapFeatures, setMapFeatures] = useState(null)
  const [mapColours, setMapColours] = useState({})

  const fitBounds = useCallback(
    (feature) => {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature)

      const { longitude, latitude, zoom } = new WebMercatorViewport(
        viewport
      ).fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: { top: 100, bottom: 200, right: 100, left: 100 },
          offset: [0, 0],
        }
      )
      const updatedViewport = {
        ...viewport,
        longitude,
        latitude,
        zoom,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
        // transitionEasing: d3.easeCubic,
      }
      setViewport(updatedViewport)
    },
    [viewport]
  )

  const onHover = (e) => {
    const {
      features,
      srcEvent: { offsetX, offsetY },
    } = e
    const hoveredFeature =
      features && features.find((f) => f.layer.id === 'data')

    setTooltip({
      hoveredFeature,
      x: offsetX,
      y: offsetY,
    })
  }

  const onClick = (e) => {
    const { features } = e
    const clickedFeature =
      features && features.find((f) => f.layer.id === 'data')
    if (clickedFeature) {
      fitBounds(clickedFeature)
      setSelectedLocationData(clickedFeature?.properties)
    }
  }

  const renderTooltip = () => {
    const { hoveredFeature, x, y } = tooltip

    if (!hoveredFeature) {
      return null
    }

    const type = _.startCase(hoveredFeature.properties.location_type)
    const name = `${hoveredFeature.properties.name} (${hoveredFeature.properties.iso})`
    const deforestationRate = _.round(
      hoveredFeature.properties.deforestationRate * 100,
      2
    )

    return (
      hoveredFeature && (
        <div className="Map--Tooltip" style={{ left: x, top: y }}>
          <div>
            {type}: {name}
          </div>
          <div>Deforestation Rate: {deforestationRate}%</div>
        </div>
      )
    )
  }

  useEffect(() => {
    let locations = [
      ...countryLocations,
      //  ...wdpaLocations, ...aoiLocations
    ]
    locations = _.sortBy(locations, 'area_m2').reverse()

    const colourKey = 'deforestationRate'
    const colourValueKey = 'colour_normalised'
    const minValue = _.min(locations.map((loc) => loc[colourKey])) || 0
    const maxValue = _.max(locations.map((loc) => loc[colourKey])) || 1
    const colourData = {
      colourKey,
      colourValueKey,
      min: minValue,
      max: maxValue,
      colourMin: colors.teal[400],
      colourMax: colors.deepOrange[500],
    }

    let features = locations.map((loc) => {
      const { geometry, bounds, ...properties } = loc
      return {
        type: 'Feature',
        geometry: geometry,
        properties: {
          ...properties,
          // save x/y bounding box coordinates
          x: bounds?.coordinates[0][0],
          y: bounds?.coordinates[0][2],
          //  add colourValue
          [colourValueKey]:
            normalise(properties[colourKey], colourData.max, colourData.min) *
            100,
        },
      }
    })

    setMapColours(colourData)
    setMapFeatures(features)
  }, [
    countryLocations,
    // , wdpaLocations, aoiLocations
  ])

  const dataLayer = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-opacity': 0.5,
      'fill-outline-color': 'black',
      'fill-color': [
        'interpolate-hcl',
        ['linear'],
        ['get', mapColours.colourValueKey],
        0,
        mapColours.colourMin,
        100,
        mapColours.colourMax,
      ],
    },
  }

  return (
    <div className="Map">
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={mapStyle}
        onViewportChange={setViewport}
        mapboxApiAccessToken={mapboxApiAccessToken}
        onHover={onHover}
        onClick={onClick}
      >
        <NavigationControl
          className="Map--NavigationControl"
          onViewportChange={setViewport}
        />
        <Source
          type="geojson"
          data={{ type: 'FeatureCollection', features: mapFeatures }}
        >
          <Layer {...dataLayer} />
        </Source>
        {renderTooltip()}
      </MapGL>
      {!countryLocations?.length && (
        <Spinner
          style={{
            position: 'absolute',
            top: 'calc(50% - 33px)',
            left: 'calc(50% - 33px)',
          }}
        />
      )}
    </div>
  )
}
export default Map
