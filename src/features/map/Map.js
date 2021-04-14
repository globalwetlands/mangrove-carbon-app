import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import summarise from 'summary'

import Spinner from '../../common/Spinner'
import MapLegend from './MapLegend'
import Menu from './Menu'
import { useLocationsData } from '../../utils/dataHooks'
import { getBrewerColours } from '../../utils/colorUtils'
import { normalise, tToMt } from '../../utils/utils'
import { hideMenuHelpText } from '../../redux/globalSettingsSlice'
import './Map.css'

const Map = ({ setSelectedLocationData }) => {
  const mapboxApiAccessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
  const mapStyle =
    'mapbox://styles/ejinks-gu/ckhycntp61ol31am7qum156sk?optimize=true'
  const mapRef = useRef()

  const countryLocations = useLocationsData({ type: 'country' })
  // const wdpaLocations = useLocationsData({ type: 'wdpa' })
  // const aoiLocations = useLocationsData({ type: 'aoi' })

  const forecastYears = useSelector(
    (state) => state.widgetSettings.forecastYears
  )

  const dispatch = useDispatch()

  const loadingState = useMemo(() => {
    if (!!countryLocations?.length) {
      return 'loaded'
    }
    return 'loading'
  }, [countryLocations])

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

  const onMouseOut = () => {
    setTooltip({})
  }

  const onClick = (e) => {
    const { features } = e
    const clickedFeature =
      features && features.find((f) => f.layer.id === 'data')
    if (clickedFeature) {
      fitBounds(clickedFeature)
      setSelectedLocationData(clickedFeature?.properties)
      dispatch(hideMenuHelpText())
    }
  }

  const renderTooltip = () => {
    const { hoveredFeature, x, y } = tooltip

    if (!hoveredFeature) {
      return null
    }

    const type = _.startCase(hoveredFeature.properties.location_type)
    const name = `${hoveredFeature.properties.name} (${hoveredFeature.properties.iso})`
    const emissionModelResultFinal = tToMt(
      hoveredFeature.properties.emissionModelResultFinal
    ).toFixed(1)
    const userHasModifiedParams =
      hoveredFeature.properties.userHasModifiedParams

    return (
      hoveredFeature && (
        <div className="Map--Tooltip" style={{ left: x, top: y }}>
          <div>
            {type}: <span className="Map--Tooltip--Value">{name}</span>
          </div>
          <div>
            Projected Emissions:{' '}
            <span className="Map--Tooltip--Value">
              {emissionModelResultFinal} Mt
            </span>
          </div>
          <div>
            {!!userHasModifiedParams && (
              <span>
                <em>*user modified</em>
              </span>
            )}
          </div>
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

    const colourKey = 'emissionModelResultFinal'
    const colourKeyName = `${forecastYears || 0}yr Projected Emissions`
    const colourKeyUnit = 'Mt CO₂e'
    const colourValueKey = 'colour_normalised'
    // const minValue = _.min(locations.map((loc) => loc[colourKey])) || 0
    const minValue = 0
    // const maxValue = _.max(locations.map((loc) => tToMt(loc[colourKey]))) || 1
    const allValues = locations.map((loc) => tToMt(loc[colourKey]))
    const summary = summarise(allValues)
    const numValueStops = 5
    const maxValue = _.ceil(summary.quartile(0.95), -2)
    const valueStep = maxValue / numValueStops
    const valueStops = _.range(minValue, maxValue + valueStep, valueStep)

    const colourData = {
      colourKey,
      colourValueKey,
      colourKeyName,
      colourKeyUnit,
      min: minValue,
      max: maxValue,
      valueStops,
      colourStops: getBrewerColours('Reds', numValueStops),
      opacity: 0.5,
    }

    let features = locations.map((loc) => {
      const { geometry, bounds, ...properties } = loc

      const value = tToMt(properties[colourKey])

      const normalisedColourVal = normalise(
        value,
        colourData.max,
        colourData.min
      )

      const colourStopIndex = _.clamp(
        Math.floor(normalisedColourVal * numValueStops),
        0,
        numValueStops - 1
      )
      const colour = colourData.colourStops[colourStopIndex]

      return {
        type: 'Feature',
        geometry: geometry,
        properties: {
          ...properties,
          // save x/y bounding box coordinates
          x: bounds?.coordinates[0][0],
          y: bounds?.coordinates[0][2],
          colour,
        },
      }
    })

    setMapColours(colourData)
    setMapFeatures(features)
  }, [
    countryLocations,
    forecastYears,
    // , wdpaLocations, aoiLocations
  ])

  const dataLayer = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-opacity': mapColours.opacity,
      'fill-outline-color': 'black',
      'fill-color': ['get', 'colour'],
    },
  }

  const getCursor = (e) => {
    if (e.isHovering) {
      return 'pointer'
    }
    if (e?.isDragging) {
      return 'grabbing'
    }
    if (tooltip?.hoveredFeature) {
      return 'crosshair'
    }
    return 'grab'
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
        onMouseOut={onMouseOut}
        onClick={onClick}
        ref={mapRef}
        getCursor={getCursor}
      >
        <NavigationControl
          className="Map--NavigationControl"
          onViewportChange={setViewport}
        />

        <Source
          type="geojson"
          data={{ type: 'FeatureCollection', features: mapFeatures }}
        >
          <Layer {...dataLayer} beforeId="country-label" />
        </Source>

        {renderTooltip()}
      </MapGL>

      <div className="Map--Overlays">
        <Menu />
        {loadingState === 'loaded' && <MapLegend mapColours={mapColours} />}
      </div>

      {loadingState !== 'loaded' && (
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
