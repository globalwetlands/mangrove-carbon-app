import React from 'react'
import ChevronDown from 'react-feather/dist/icons/chevron-down'

import './SelectInput.css'

const SelectInput = ({
  options = [],
  className = '',
  onChange,
  selectedValue,
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e.target.value)
  }
  return (
    <span className={`SelectInput--Wrap ${className}`} {...props}>
      <select
        className="SelectInput--Input"
        onChange={handleChange}
        value={selectedValue}
      >
        {options.map(({ name, value }) => (
          <option value={value} key={`Select${value}`}>
            {name}
          </option>
        ))}
      </select>
      <ChevronDown className="SelectInput--Icon" />
    </span>
  )
}

export default SelectInput
