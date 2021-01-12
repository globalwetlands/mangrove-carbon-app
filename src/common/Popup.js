import React from 'react'
import Modal from 'react-modal'
import CloseIcon from 'react-feather/dist/icons/x'

import './Popup.css'
import IconButton from './IconButton'

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(`#root`)

const Popup = ({ title, modalIsOpen, setModalIsOpen, children }) => {
  function afterOpenModal() {}

  function closeModal() {
    setModalIsOpen(false)
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      className="Popup--Modal"
      overlayClassName="Popup--Overlay"
    >
      <div className="Popup--Modal--Inner">
        {title && <h3 className="Popup--Title">{title}</h3>}
        <div className="Popup--Content">{children}</div>
      </div>
      <IconButton
        Icon={CloseIcon}
        className="Popup--CloseButton"
        onClick={closeModal}
      />
    </Modal>
  )
}

export default Popup
