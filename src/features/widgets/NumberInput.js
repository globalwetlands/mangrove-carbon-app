import React from 'react'

import './NumberInput.css'

const NumberInput = ({
  value,
  onChange = (val) => console.log(val),
  width = 'auto',
  style = {},
  unit = '',
}) => {
  const handleChange = (e) => onChange(e.target.value)

  return (
    <span>
      <input
        className="NumberInput"
        value={value}
        type="number"
        onChange={handleChange}
        style={{
          ...style,
          width,
        }}
      />{' '}
      {unit}
    </span>
  )
}

export default NumberInput
