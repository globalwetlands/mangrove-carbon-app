export const loadLocationsData = async (
  dataUrl = '/geojson/locations_polygons.json'
) => {
  console.log('Loading locations data')
  const data = fetch(dataUrl).then((res) => res.json())
  return data
}
