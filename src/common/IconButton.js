import React from 'react'

const IconButton = ({ Icon, onClick, ...props }) => {
  const handleKeyDown = (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
      onClick(e)
    }
  }
  return (
    <Icon
      role="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-pressed="false"
      {...props}
    />
  )
}

export default IconButton
