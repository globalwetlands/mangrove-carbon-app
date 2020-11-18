import materialColors from 'material-colors/dist/colors.js'
// https://www.materialui.co/colors

export const colors = materialColors

export function getMaterialPalette(baseColor = 'red') {
  const palette = colors[baseColor]
  return palette
}
