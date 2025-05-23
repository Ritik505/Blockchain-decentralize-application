import React from 'react';

function ManagerSection({ managerAddress, contractBalance }) {
  return (
    <div id="manager-section">
      <h2>Manager Section</h2>
      <p>Manager Address: <span id="manager-address">{managerAddress}</span></p>
    </div>
  );
}

export default ManagerSection; 