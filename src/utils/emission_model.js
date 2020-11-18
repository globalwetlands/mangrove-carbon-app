/*
Opportunity to store carbon 
for r == d
where t is the time period
  A1 is initial area
  d is deforestation rate
    gross loss not net loss
  r is emission rate
    0.1 fixed rate
  Cmax is maximum emissions
    ag carbon + bg carbon
    check units are the same, sometimes C, sometimes CO2, C02 is 2.67 times heavier
  s is sequestration rate 
    MG per hectare per year
*/

function emission_model_rd({ t, A1, d, r, Cmax, s }) {
  let x =
    (A1 * s * (1 - Math.exp(-d * t))) / d -
    A1 * Cmax * (1 - Math.exp(-d * t) - d * t * Math.exp(-d * t)) -
    A1 * s * t
  // because we want positive values
  x = x * -1
  return x
}

function emission_model_rnotd({ t, A1, d, r, Cmax, s }) {
  let x =
    (A1 * s * (1 - Math.exp(-d * t))) / d - // sequestration with deforesting
    (A1 * Cmax * (d * Math.exp(-r * t) - r * Math.exp(-d * t) + (r - d))) /
      (r - d) -
    // emission from deforesting
    A1 * s * t // sequestration no deforestation
  x = x * -1
  return x
}

export function emission_model({
  t, // the prediction time period
  A1, // initial area
  d, // deforestation rate
  r = 0.1, // emissions rate
  Cmax, // ag carbon + bg carbon per hectare
  s = 0, // sequestration rate // is the yearly sequestration rate per hectare
}) {
  const args = {
    t,
    A1,
    d,
    r,
    Cmax,
    s,
  }

  if (d < 0) {
    return 0
  }

  if (r === d) {
    return emission_model_rd(args)
  } else {
    return emission_model_rnotd(args)
  }
}
