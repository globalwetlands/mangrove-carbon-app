import React from 'react'
import NumberFormat from 'react-number-format'

import './NumberInput.css'

const NumberInput = ({
  value,
  name,
  onChange = console.log,
  style = {},
  unit = '',
  ...props
}) => {
  const calculatedWidth = (value || 0).toLocaleString().length

  return (
    <span>
      <NumberFormat
        className="NumberInput"
        value={value}
        displayType={'input'}
        thousandSeparator={true}
        style={{
          ...style,
          width: `${calculatedWidth}ch`,
        }}
        onValueChange={({ floatValue, formattedValue }) => {
          onChange({
            name,
            value: floatValue,
          })
        }}
        {...props}
      />{' '}
      {unit}
    </span>
  )
}

export default NumberInput
