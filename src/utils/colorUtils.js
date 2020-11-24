import materialColors from 'material-colors/dist/colors.js'
// https://www.materialui.co/colors

export const colors = materialColors

export function getMaterialPalette(baseColor = 'red') {
  const palette = colors[baseColor]
  return palette
}

export const dataColors = [
  '#113280',
  '#ffa600',
  '#8a2f89',
  '#ff6247',
  '#d73171',
]
