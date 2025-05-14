import React, { useState, useEffect } from 'react';

function ParticipantSetup({ onStartGame }) {
  const [participants, setParticipants] = useState({
    participant1: '',
    participant2: '',
    participant3: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');

  // Get the current address from MetaMask
  useEffect(() => {
    const getAddress = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setCurrentAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error getting current address:", error);
        }
      }
    };
    
    getAddress();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setParticipants(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const fillCurrentAddress = (field) => {
    if (currentAddress) {
      setParticipants(prev => ({
        ...prev,
        [field]: currentAddress
      }));
    }
  };

  const handleStartGame = async () => {
    // Validate participant addresses
    if (!participants.participant1 || !participants.participant2 || !participants.participant3) {
      alert('Please enter all participant addresses');
      return;
    }
    
    // Validate Ethereum addresses
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(participants.participant1) || 
        !addressRegex.test(participants.participant2) || 
        !addressRegex.test(participants.participant3)) {
      alert('Please enter valid Ethereum addresses (0x followed by 40 hexadecimal characters)');
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Call the parent function with the array of addresses
      await onStartGame([
        participants.participant1,
        participants.participant2,
        participants.participant3
      ]);
    } catch (error) {
      console.error("Error in ParticipantSetup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="setup-section">
      <h2>Enter Participants</h2>
      <p className="helper-text">
        You need to enter 3 participant Ethereum addresses to start the game.
        {currentAddress && <> You can use your current address: <code>{currentAddress}</code></>}
      </p>
      <div className="participant-inputs">
        <div className="input-group">
          <input
            type="text"
            id="participant1"
            placeholder="Participant 1 Address"
            value={participants.participant1}
            onChange={handleChange}
            disabled={isLoading}
          />
          {currentAddress && 
            <button 
              type="button" 
              onClick={() => fillCurrentAddress('participant1')}
              disabled={isLoading}
              className="use-current-btn"
            >
              Use Current
            </button>
          }
        </div>
        <div className="input-group">
          <input
            type="text"
            id="participant2"
            placeholder="Participant 2 Address"
            value={participants.participant2}
            onChange={handleChange}
            disabled={isLoading}
          />
          {currentAddress && 
            <button 
              type="button" 
              onClick={() => fillCurrentAddress('participant2')}
              disabled={isLoading}
              className="use-current-btn"
            >
              Use Current
            </button>
          }
        </div>
        <div className="input-group">
          <input
            type="text"
            id="participant3"
            placeholder="Participant 3 Address"
            value={participants.participant3}
            onChange={handleChange}
            disabled={isLoading}
          />
          {currentAddress && 
            <button 
              type="button" 
              onClick={() => fillCurrentAddress('participant3')}
              disabled={isLoading}
              className="use-current-btn"
            >
              Use Current
            </button>
          }
        </div>
      </div>
      <button 
        id="start-game" 
        onClick={handleStartGame}
        disabled={isLoading}
      >
        {isLoading ? 'Starting Game...' : 'Start Game'}
      </button>
    </div>
  );
}

export default ParticipantSetup; 