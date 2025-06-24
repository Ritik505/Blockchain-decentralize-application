import React from 'react';

function TransferForm({
    formValues,
    onInputChange,
    senderBalance,
    receiverBalance,
    gasFee,
    onConfirm,
    onClear,
    status
}) {
    return (
        <>
            <p className="balance">{senderBalance || 'Sender Balance:'}</p>
            <p className="balance">{receiverBalance || 'Receiver Balance:'}</p>

            <input
                type="text"
                className="sra"
                id="sender"
                placeholder="Enter Sender Address"
                value={formValues.sender}
                onChange={onInputChange}
            />
            <input
                type="text"
                className="sra"
                id="receiver"
                placeholder="Enter Receiver Address"
                value={formValues.receiver}
                onChange={onInputChange}
            />
            <input
                type="text"
                className="sra"
                id="amount"
                placeholder="Enter Amount (AVAX)"
                value={formValues.amount}
                onChange={onInputChange}
            />

            <p id="gasFee">{gasFee}</p>

            <button className="primary-btn" onClick={onConfirm}>
                <i className="fas fa-paper-plane"></i>  <b>Send Transaction</b>
            </button>
            <button className="secondary-btn" onClick={onClear}>
                <i className="fas fa-eraser"></i>  <b>Clear</b>
            </button>

            {status.message && (
                <p className={`message ${status.type}`}>{status.message}</p>
            )}
        </>
    );
}

export default TransferForm;