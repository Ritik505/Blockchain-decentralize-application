import React, { useState, useEffect } from 'react';

function GameSection({ participants, web3, contract, account, gameEnded, onStatusChange }) {
  const [ticketStatus, setTicketStatus] = useState({
    1: false,
    2: false,
    3: false
  });
  
  const [selectedNumbers, setSelectedNumbers] = useState({});
  const [availableNumbers, setAvailableNumbers] = useState([1, 2, 3, 4]);
  const [currentParticipant, setCurrentParticipant] = useState(0);
  const [showNumberSelection, setShowNumberSelection] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winnerInfo, setWinnerInfo] = useState({
    address: '',
    number: 0,
    prize: 0
  });
  
  const [isUpdatingNumbers, setIsUpdatingNumbers] = useState(false);
  
  // Get available numbers when component loads
  useEffect(() => {
    if (contract) {
      updateAvailableNumbers();
    }
  }, [contract]);
  
  // Update game status based on ticket purchases
  useEffect(() => {
    const allTicketsPurchased = ticketStatus[1] && ticketStatus[2] && ticketStatus[3];
    if (allTicketsPurchased && !showNumberSelection) {
      setShowNumberSelection(true);
      onStatusChange('All tickets purchased! Time to select numbers.');
    }
  }, [ticketStatus, showNumberSelection, onStatusChange]);
  
  // Update the available numbers
  const updateAvailableNumbers = async () => {
    try {
      if (contract && web3 && !isUpdatingNumbers) {
        setIsUpdatingNumbers(true);
        const numbers = await contract.methods.getAvailableNumbers().call();
        setAvailableNumbers(numbers.map(n => parseInt(n)));
        setIsUpdatingNumbers(false);
      }
    } catch (error) {
      console.error("Error getting available numbers:", error);
      setIsUpdatingNumbers(false);
      onStatusChange('Unable to fetch available numbers. Please check your connection to MetaMask.');
    }
  };
  
  // Buy a ticket for a participant
  const buyTicket = async (participantNumber) => {
    try {
      onStatusChange(`Buying ticket for Participant ${participantNumber}...`);
      
      // Set a loading state to prevent multiple calls
      setTicketStatus(prev => ({
        ...prev,
        [participantNumber]: 'loading'
      }));
      
      // Set the current account to the participant's account
      // For simplicity we're using the current account for all participants
      const result = await contract.methods.buyTicket().send({
        from: account,
        value: web3.utils.toWei('5', 'ether')
      });
      
      if (result) {
        // Update ticket status
        setTicketStatus(prev => ({
          ...prev,
          [participantNumber]: true
        }));
        
        onStatusChange(`Ticket purchased for Participant ${participantNumber}!`);
      }
    } catch (error) {
      console.error("Error buying ticket:", error);
      
      // Reset the ticket status to false since the transaction failed
      setTicketStatus(prev => ({
        ...prev,
        [participantNumber]: false
      }));
      
      // Provide a more specific error message for user rejections
      if (error.message && error.message.includes('User denied transaction signature')) {
        onStatusChange('Transaction was rejected in MetaMask. Please approve the transaction to continue.');
      } else {
        onStatusChange('Error buying ticket. Check console for details.');
      }
    }
  };
  
  // Select a number for the current participant
  const selectNumber = async (number) => {
    try {
      onStatusChange(`Selecting number ${number} for Participant ${currentParticipant + 1}...`);
      
      // Set temporary selection to indicate processing
      setSelectedNumbers(prev => ({
        ...prev,
        [currentParticipant + 1]: 'selecting...'
      }));
      
      const result = await contract.methods.selectNumber(number).send({
        from: account
      });
      
      if (result) {
        // Update selected numbers
        setSelectedNumbers(prev => ({
          ...prev,
          [currentParticipant + 1]: number
        }));
        
        // Update available numbers
        await updateAvailableNumbers();
        
        // Move to next participant
        setCurrentParticipant(prev => prev + 1);
        
        onStatusChange(`Number ${number} selected for Participant ${currentParticipant + 1}!`);
        
        // Check if all participants have selected numbers
        if (currentParticipant === 2) {
          onStatusChange('All numbers selected! Ready to determine the winner.');
        }
      }
    } catch (error) {
      console.error("Error selecting number:", error);
      
      // Reset the selection state
      setSelectedNumbers(prev => {
        const newState = {...prev};
        delete newState[currentParticipant + 1];
        return newState;
      });
      
      if (error.message && error.message.includes('User denied transaction signature')) {
        onStatusChange('Transaction was rejected in MetaMask. Please approve the transaction to continue.');
      } else {
        onStatusChange('Error selecting number. Check console for details.');
      }
    }
  };
  
  // Determine the winner
  const determineWinner = async () => {
    try {
      onStatusChange('Determining winner...');
      
      // Set a loading state
      setWinnerInfo({
        ...winnerInfo,
        loading: true
      });
      
      const receipt = await contract.methods.determineWinner().send({
        from: account
      });
      
      // Find the WinnerDeclared event in the transaction receipt
      const winnerEvent = receipt.events.WinnerDeclared;
      if (winnerEvent) {
        const { winner, winningNumber, prize } = winnerEvent.returnValues;
        
        setWinnerInfo({
          address: winner,
          number: parseInt(winningNumber),
          prize: web3.utils.fromWei(prize, 'ether'),
          loading: false
        });
        
        setShowWinner(true);
        onStatusChange(`Winner determined! Winning number: ${winningNumber}`);
      }
    } catch (error) {
      console.error("Error determining winner:", error);
      
      // Reset loading state
      setWinnerInfo({
        ...winnerInfo,
        loading: false
      });
      
      if (error.message && error.message.includes('User denied transaction signature')) {
        onStatusChange('Transaction was rejected in MetaMask. Please approve the transaction to continue.');
      } else {
        onStatusChange('Error determining winner. Check console for details.');
      }
    }
  };
  
  return (
    <div id="game-section">
      <h2>Game in Progress</h2>
      
      <div id="ticket-section">
        <h3>Buy Tickets (5 ETH each)</h3>
        <div className="participants">
          {participants.map((address, index) => (
            <div className="participant" key={index}>
              <p>Participant {index + 1}: <span className="participant-address">{address}</span></p>
              <button 
                className="buy-ticket" 
                onClick={() => buyTicket(index + 1)}
                disabled={ticketStatus[index + 1] === true || ticketStatus[index + 1] === 'loading'}
              >
                Buy Ticket
              </button>
              <span className="ticket-status">
                {ticketStatus[index + 1] === true ? 'Purchased' : 
                 ticketStatus[index + 1] === 'loading' ? 'Processing...' : 'Not Purchased'}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {showNumberSelection && (
        <div id="number-selection">
          <h3>Pick Numbers</h3>
          
          {currentParticipant < 3 ? (
            <div className="selection-area">
              <p>Participant {currentParticipant + 1}: Choose a number</p>
              <div className="number-buttons">
                {availableNumbers.map(number => (
                  <button 
                    key={number}
                    className="number-btn" 
                    onClick={() => selectNumber(number)}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <p>Selected: <span>
                {selectedNumbers[currentParticipant + 1] || 'None'}
              </span></p>
            </div>
          ) : (
            <div>
              <h3>All numbers selected!</h3>
              <div className="selection-summary">
                {Object.entries(selectedNumbers).map(([participant, number]) => (
                  <p key={participant}>Participant {participant} selected: {number}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {currentParticipant === 3 && !showWinner && (
        <div id="result-section">
          <h3>Determine Winner</h3>
          <button 
            id="determine-winner" 
            onClick={determineWinner}
            disabled={winnerInfo.loading}
          >
            {winnerInfo.loading ? 'Processing...' : 'Show Winner'}
          </button>
        </div>
      )}
      
      {showWinner && (
        <div id="winner-display">
          <h3>Winner</h3>
          <p>Winning Number: <span id="winning-number">{winnerInfo.number}</span></p>
          <p>Winner Address: <span id="winner-address">{winnerInfo.address}</span></p>
          <p>Prize: <span id="prize-amount">{winnerInfo.prize}</span> ETH</p>
        </div>
      )}
    </div>
  );
}

export default GameSection; 