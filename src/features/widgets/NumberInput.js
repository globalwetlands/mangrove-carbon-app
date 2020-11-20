import React from 'react'

import './NumberInput.css'

const NumberInput = ({
  value,
  onChange = console.log,
  style = {},
  unit = '',
  ...props
}) => {
  const charWidth = 11.5
  const calculatedWidth = (value || 0).toString().length * charWidth

  return (
    <span>
      <input
        className="NumberInput"
        value={value}
        type="number"
        onChange={onChange}
        style={{
          ...style,
          width: calculatedWidth,
        }}
        {...props}
      />{' '}
      {unit}
    </span>
  )
}

export default NumberInput
