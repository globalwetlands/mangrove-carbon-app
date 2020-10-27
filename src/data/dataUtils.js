export const loadLocationsData = async (
  dataUrl = '/geojson/locations_polygons.json'
) => {
  console.log('Loading locations data')
  const data = fetch(dataUrl).then((res) => res.json())
  return data
}

export const loadSingleLocationData = async (locationID) => {
  console.log(`Loading location ${locationID} data`)
  const dataUrl = `/locations_data/${locationID}.json`
  const data = fetch(dataUrl).then((res) => res.json())
  return data
}
