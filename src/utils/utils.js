export function m2ToHa(m2) {
  return m2 * 0.0001
}

export async function delay(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
