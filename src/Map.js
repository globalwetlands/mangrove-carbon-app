import React, { useState } from 'react'
import MapGL, { NavigationControl } from 'react-map-gl'

import './Map.css'

const Map = () => {
  const mapboxApiAccessToken = import.meta.env
    .SNOWPACK_PUBLIC_MAPBOX_ACCESS_TOKEN
  const mapStyle = 'mapbox://styles/mapbox/light-v9'

  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 0,
    longitude: 0,
    zoom: 2,
  })

  return (
    <div className="Map">
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={mapStyle}
        onViewportChange={setViewport}
        mapboxApiAccessToken={mapboxApiAccessToken}
      >
        <NavigationControl
          className="Map--NavigationControl"
          onViewportChange={setViewport}
        />
      </MapGL>
    </div>
  )
}
export default Map
