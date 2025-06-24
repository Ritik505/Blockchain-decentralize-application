import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, amount }) {
    if (!isOpen) return null;

    return (
        <>
            <div className="overlay" style={{ display: 'block' }}></div>
            <div className="modal" style={{ display: 'block' }}>
                <h3>Confirm Transaction</h3>
                <p>Are you sure you want to send <span>{amount}</span> AVAX?</p>
                <button className="confirm-btn" onClick={onConfirm}>
                    <i className="fas fa-check"></i>  Confirm
                </button>
                <button className="cancel-btn" onClick={onClose}>
                    <i className="fas fa-times"></i>  Cancel
                </button>
            </div>
        </>
    );
}

export default ConfirmationModal;