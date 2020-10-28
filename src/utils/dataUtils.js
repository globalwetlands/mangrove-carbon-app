export const loadLocationsData = async ({
  type = 'country', // country, aoi, wdpa
}) => {
  const dataUrl = `/geojson/${type}_locations.json`
  console.log('Loading locations data')
  const data = fetch(dataUrl).then((res) => res.json())
  return data
}

export const loadSingleLocationData = async (locationID) => {
  console.log(`Loading location ${locationID} data`)
  const dataUrl = `/locations_data/${locationID}.json`
  const data = fetch(dataUrl).then((res) => res.json())
  // await delay(1000)
  return data
}
