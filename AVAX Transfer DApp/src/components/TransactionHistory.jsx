import React from 'react';

function TransactionHistory({ history }) {
    return (
        <>
            <h3 id="Transaction">Transaction History</h3>
            <div id="history">
                {history.length === 0 ? (
                    <p>No transactions yet.</p>
                ) : (
                    history.map((txLink, index) => (
                        <a key={index} href={txLink} target="_blank" rel="noopener noreferrer">
                            Transaction: {txLink.split('/').pop()}
                        </a>
                    ))
                )}
            </div>
        </>
    );
}

export default TransactionHistory;