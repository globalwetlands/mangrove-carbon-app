import React, { useEffect, useState, useRef, useCallback } from 'react'
import MapGL, {
  NavigationControl,
  Source,
  Layer,
  WebMercatorViewport,
  FlyToInterpolator,
} from 'react-map-gl'
import _ from 'lodash'

import './Map.css'

const Map = ({ data, setSelectedLocationData }) => {
  const mapboxApiAccessToken = import.meta.env
    .SNOWPACK_PUBLIC_MAPBOX_ACCESS_TOKEN
  const mapStyle = 'mapbox://styles/mapbox/light-v9'

  const mapRef = useRef()

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

  const fitBounds = useCallback(
    ({ x, y }) => {
      const { longitude, latitude, zoom } = new WebMercatorViewport(
        viewport
      ).fitBounds([x, y], {
        padding: 100,
        offset: [0, 0],
      })
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
    const hoveredFeature =
      features && features.find((f) => f.layer.id === 'data')

    const bounds = hoveredFeature.geometry?.coordinates?.[0]

    fitBounds({ x: bounds[0], y: bounds[2] })

    setSelectedLocationData(hoveredFeature?.properties)
  }

  const renderTooltip = () => {
    const { hoveredFeature, x, y } = tooltip

    return (
      hoveredFeature && (
        <div className="Map--Tooltip" style={{ left: x, top: y }}>
          <div>State: {hoveredFeature.properties.name}</div>
          <div>Type: {hoveredFeature.properties.location_type}</div>
          <div>ISO: {hoveredFeature.properties.iso}</div>
        </div>
      )
    )
  }

  useEffect(() => {
    let locations = data.data
    locations = _.sortBy(locations, 'area_m2').reverse()

    setMapFeatures({
      type: 'FeatureCollection',
      features: locations.map((loc) => {
        const { bounds, ...properties } = loc
        return {
          type: 'Feature',
          geometry: bounds,
          properties: {
            ...properties,
          },
        }
      }),
    })
  }, [data])

  const dataLayer = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-opacity': 0.2,
      'fill-color': [
        'match',
        ['get', 'location_type'],
        'country',
        'lightsalmon',
        'wdpa',
        'cyan',
        /* other */ 'hotpink',
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
        ref={mapRef}
      >
        <NavigationControl
          className="Map--NavigationControl"
          onViewportChange={setViewport}
        />
        <Source type="geojson" data={mapFeatures}>
          <Layer {...dataLayer} />
        </Source>
        {renderTooltip()}
      </MapGL>
    </div>
  )
}
export default Map
