import React from 'react'
import CloseIcon from 'react-feather/dist/icons/x'
import IconButton from '../../common/IconButton'

const WidgetBox = ({ children, onClose, ...props }) => {
  return (
    <div className="Widgets--Box" {...props}>
      <IconButton
        Icon={CloseIcon}
        className="Widgets--Box--CloseButton"
        onClick={onClose}
      />
      {children}
    </div>
  )
}

export default WidgetBox
