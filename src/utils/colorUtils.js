import chroma from 'chroma-js'
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

export const getBrewerColours = (scaleName = 'OrRd', num = 5) => {
  return chroma.scale(scaleName).colors(num)
}

export const opacify = (col, alpha) => {
  return chroma(col).alpha(alpha)
}
