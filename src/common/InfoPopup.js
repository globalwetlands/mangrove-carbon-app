import React, { Fragment, useState } from 'react'
import Modal from 'react-modal'
import InfoIcon from 'react-feather/dist/icons/info'
import CloseIcon from 'react-feather/dist/icons/x'

import './InfoPopup.css'
import IconButton from './IconButton'

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(`#root`)

const InfoPopup = ({ content, title, className = '' }) => {
  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function afterOpenModal() {}

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <Fragment>
      <IconButton
        Icon={InfoIcon}
        className={`InfoPopup--InfoIcon ${className}`}
        onClick={openModal}
      />
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        className="InfoPopup--Modal"
        overlayClassName="InfoPopup--Overlay"
      >
        <IconButton
          Icon={CloseIcon}
          className="InfoPopup--CloseButton"
          onClick={closeModal}
        />
        {title && <h3 className="InfoPopup--Title">{title}</h3>}
        <div className="InfoPopup--Content">{content}</div>
      </Modal>
    </Fragment>
  )
}

export default InfoPopup
