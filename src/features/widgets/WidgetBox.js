import React from 'react'
import CloseIcon from 'react-feather/dist/icons/x'

const WidgetBox = ({ children, onClose, ...props }) => {
  return (
    <div className="Widgets--Box" {...props}>
      <CloseIcon
        className="Widgets--Box--CloseButton"
        role="button"
        onClick={onClose}
      />
      {children}
    </div>
  )
}

export default WidgetBox
