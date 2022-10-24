import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement(document.getElementById('root'));

const CustomModal = (
  modalIsOpen: boolean, 
  closeModal: (isOpen: boolean) => void,
  modalHeader?: string,
  modalBody?: string | JSX.Element | number,
  modalHeaderClass?: string,
  modalBodyClass?: string,
  modalCloseBtnClass?: string ) => {
    
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Custom Modal"
      className="customModal"
      overlayClassName="customModalOverlay">
        <div className="row">
          <h2 className={`customModalHeader header100 my-3 ${modalHeaderClass}`}>{modalHeader}</h2>
        </div>
        <div className="row">
          <div className={`customModalBody ${modalBodyClass}`}>{modalBody}</div>
        </div>
        <div className="row justify-content-center">
          <button className={`btnCloseCustomModal ${modalCloseBtnClass}`} 
            onClick={() => closeModal(false)}>
            CLOSE
          </button>
        </div>
    </Modal>
  );
}

export default CustomModal;