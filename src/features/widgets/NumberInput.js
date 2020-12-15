import React from 'react'
import NumberFormat from 'react-number-format'
import _ from 'lodash'

import './NumberInput.css'

const NumberInput = ({
  value,
  name,
  onChange = console.log,
  style = {},
  unit = '',
  min,
  max,
  ...props
}) => {
  const formattedValue = (value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 20,
  })
  const calculatedWidth = formattedValue.length + 0.5 // unit = ch
  const minWidth = 25

  const isAllowed = ({ floatValue }) => {
    let isValid = true
    if (_.isNumber(min)) {
      isValid = floatValue >= min
    }
    if (_.isNumber(max)) {
      isValid = floatValue <= max
    }
    return isValid
  }

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
        isAllowed={isAllowed}
        {...props}
      />{' '}
      {unit}
    </span>
  )
}

export default NumberInput
