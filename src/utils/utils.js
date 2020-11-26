export function m2ToHa(m2) {
  return m2 * 0.0001
}

export function tToMt(t) {
  return t / 1000000
}

export function normalise(val, max, min) {
  return (val - min) / (max - min)
}

export async function delay(ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}
