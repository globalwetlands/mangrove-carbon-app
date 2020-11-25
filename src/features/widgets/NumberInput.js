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
  const formattedValue = (value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 20,
  })
  const calculatedWidth = formattedValue.length + 0.5 // unit = ch
  const minWidth = 25

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
          minWidth,
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
