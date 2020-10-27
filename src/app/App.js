import React, { useState } from 'react'
import Map from '../features/map/Map'
import Widgets from '../features/widgets/Widgets'

function App() {
  const [selectedLocationData, setSelectedLocationData] = useState()

  return (
    <div>
      <Map setSelectedLocationData={setSelectedLocationData} />
      <Widgets selectedLocationData={selectedLocationData} />
    </div>
  )
}

export default App
