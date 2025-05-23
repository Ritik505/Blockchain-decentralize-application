import React from 'react';

function StatusSection({ message }) {
  return (
    <div id="status-section">
      <h3>Status</h3>
      <p id="status-message">{message}</p>
    </div>
  );
}

export default StatusSection; 