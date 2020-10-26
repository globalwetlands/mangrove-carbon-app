import React, { useState } from 'react'
import Map from '../features/map/Map'
import Widgets from '../features/widgets/Widgets'

import locationsData from '../data/gmw_locations.json'

function App() {
  const [selectedLocationData, setSelectedLocationData] = useState()

  return (
    <div>
      <Map
        data={locationsData}
        setSelectedLocationData={setSelectedLocationData}
      />
      <Widgets selectedLocationData={selectedLocationData} />
    </div>
  )
}

export default App
