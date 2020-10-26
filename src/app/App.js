import React from 'react'
import Map from '../features/map/Map'

import locationsData from '../data/gmw_locations.json'

function App() {
  return <Map data={locationsData} />
}

export default App
