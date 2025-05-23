import React, { useState, useEffect } from 'react';
import './App.css';
import Web3 from 'web3';
import ManagerSection from './components/ManagerSection';
import ParticipantSetup from './components/ParticipantSetup';
import GameSection from './components/GameSection';
import StatusSection from './components/StatusSection';

function App() {
  const [web3, setWeb3] = useState(null);
  const [lotteryContract, setLotteryContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [contractBalance, setContractBalance] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Welcome to the Blockchain Lottery!');

  const contractAddress = '0xCb2E272f63ae1C90ca288b3B314Dc1b052f3BaD5';
  const contractABI = [
    {
      "inputs": [],
      "name": "buyTicket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "determineWinner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "number",
          "type": "uint8"
        }
      ],
      "name": "NumberSelected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "index",
          "type": "uint8"
        }
      ],
      "name": "ParticipantAdded",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "number",
          "type": "uint8"
        }
      ],
      "name": "selectNumber",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[3]",
          "name": "_participants",
          "type": "address[3]"
        }
      ],
      "name": "startGame",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "participant",
          "type": "address"
        }
      ],
      "name": "TicketPurchased",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "winner",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "winningNumber",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "prize",
          "type": "uint256"
        }
      ],
      "name": "WinnerDeclared",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "gameEnded",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gameStarted",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAvailableNumbers",
      "outputs": [
        {
          "internalType": "uint8[]",
          "name": "",
          "type": "uint8[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "participant",
          "type": "address"
        }
      ],
      "name": "getParticipantNumber",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasPaidTicket",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "hasParticipated",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "number",
          "type": "uint8"
        }
      ],
      "name": "isNumberAvailable",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "manager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MANAGER_FEE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "numberSelectionCount",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "participantCount",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "participants",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "selectedNumbers",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TICKET_PRICE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ticketPurchaseCount",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "winner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "WINNER_PRIZE",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "winningNumber",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  useEffect(() => {
    let mounted = true;
    let web3Instance = null;

    const init = async () => {
      try {
        console.log("Initializing Web3...");
        console.log("Contract address:", contractAddress);
        
        if (window.ethereum) {
          web3Instance = new Web3(window.ethereum);
          
          if (mounted) {
            setWeb3(web3Instance);
          }
          
          try {
            
            const accounts = await window.ethereum.request({ 
              method: 'eth_accounts' 
            });
            
            console.log("Connected accounts:", accounts);
            
           
            if (accounts.length === 0) {
              const requestedAccounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
              });
              
              if (mounted) {
                if (requestedAccounts.length === 0) {
                  setStatusMessage('Please connect at least one account in MetaMask');
                  return;
                }
                
                setAccounts(requestedAccounts);
                setCurrentAccount(requestedAccounts[0]);
              }
            } else {
            
              if (mounted) {
                setAccounts(accounts);
                setCurrentAccount(accounts[0]);
              }
            }
            
           
            if (mounted) {
              const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
              
             
              try {
                await contractInstance.methods.gameStarted().call();
                
                
                setLotteryContract(contractInstance);
                
              
                window.ethereum.on('accountsChanged', (newAccounts) => {
                  if (newAccounts.length === 0) {
                    setStatusMessage('Please connect your MetaMask account');
                  } else {
                    setAccounts(newAccounts);
                    setCurrentAccount(newAccounts[0]);
                    setStatusMessage('Account changed. Ready to continue.');
                  }
                });
                
              
                window.ethereum.on('chainChanged', () => {
                  window.location.reload();
                });
                
               
                try {
                  const networkId = await web3Instance.eth.net.getId();
                  console.log("Connected to network ID:", networkId);
                  
                  // Check for both Ethereum and Avalanche networks
                  const supportedNetworks = {
                    1: 'Ethereum Mainnet',
                    3: 'Ethereum Ropsten',
                    4: 'Ethereum Rinkeby',
                    5: 'Ethereum Goerli',
                    42: 'Ethereum Kovan',
                    43113: 'Avalanche Fuji Testnet',
                    43114: 'Avalanche Mainnet'
                  };
                  
                  if (!supportedNetworks[networkId]) {
                    console.log("Not connected to a supported network. Please connect to Avalanche Fuji Testnet (43113) or Avalanche Mainnet (43114)");
                    setStatusMessage('Please connect to Avalanche Fuji Testnet or Avalanche Mainnet');
                  } else {
                    console.log("Connected to:", supportedNetworks[networkId]);
                  }
                } catch (error) {
                  console.error("Error getting network info:", error);
                }
                
    
                try {
                  const isGameStarted = await contractInstance.methods.gameStarted().call();
                  const isGameEnded = await contractInstance.methods.gameEnded().call();
                  
                  if (mounted) {
                    setGameStarted(isGameStarted);
                    setGameEnded(isGameEnded);
                    
                  
                    await updateContractBalance(contractInstance, web3Instance);
                  }
                } catch (error) {
                  console.error("Error checking game status:", error);
                  if (mounted) {
                    setStatusMessage('Error reading contract state. Please check your network connection.');
                  }
                }
              } catch (error) {
                console.error("Error verifying contract:", error);
                if (mounted) {
                  setStatusMessage('Error: Contract not found at the specified address. Please check your network connection and contract address.');
                }
              }
            }
          } catch (error) {
            if (error.code === 4001) {
        
              if (mounted) {
                setStatusMessage('Please connect your MetaMask wallet to use this application');
              }
            } else {
              console.error("MetaMask connection error:", error);
              if (mounted) {
                setStatusMessage('Error connecting to MetaMask. Please check console for details.');
              }
            }
          }
        } else {
          if (mounted) {
            setStatusMessage('Please install MetaMask extension to use this application');
          }
        }
      } catch (error) {
        console.error("Error initializing Web3:", error);
        if (mounted) {
          setStatusMessage('Error connecting to blockchain. Please check console for details.');
        }
      }
    };
    
    init();

  
    return () => {
      mounted = false;
  
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  const updateContractBalance = async (contract, web3Instance) => {
    if (contract && web3Instance) {
      try {
        const balance = await contract.methods.getContractBalance().call();
        const balanceInAvax = web3Instance.utils.fromWei(balance, 'ether');
        setContractBalance(balanceInAvax);
      } catch (error) {
        console.error("Error updating contract balance:", error);
      }
    }
  };

  const startGame = async (participantAddresses) => {
    try {
      if (!lotteryContract) {
        setStatusMessage('Error: Contract not initialized. Please check your connection.');
        return;
      }
      
      if (!currentAccount) {
        setStatusMessage('Error: No account connected. Please connect your MetaMask wallet.');
        return;
      }
      
      console.log("Starting game with participants:", participantAddresses);
      console.log("Current account:", currentAccount);
      
      setStatusMessage('Starting game...');
      
      setGameStarted('loading');
      
      await lotteryContract.methods.startGame(participantAddresses)
        .send({ from: currentAccount });
      
      setParticipants(participantAddresses);
      setGameStarted(true);
      setStatusMessage('Game started successfully!');
    } catch (error) {
      console.error("Error starting game:", error);

      setGameStarted(false);
      
      if (error.message && error.message.includes('User denied transaction signature')) {
        setStatusMessage('Transaction was rejected in MetaMask. Please approve the transaction to start the game.');
      } else if (error.message && error.message.includes('revert')) {
        setStatusMessage('Contract error: ' + error.message);
      } else {
        setStatusMessage('Error starting game. Please check console for details.');
      }
    }
  };

  return (
    <div className="container">
      <h1>Blockchain Lottery DApp Powered by Avalanche</h1>
      
      <ManagerSection 
        managerAddress={currentAccount} 
        contractBalance={contractBalance} 
      />
      
      {gameStarted === true ? (
        <GameSection 
          participants={participants}
          web3={web3}
          contract={lotteryContract}
          account={currentAccount}
          gameEnded={gameEnded}
          onStatusChange={setStatusMessage}
        />
      ) : gameStarted === 'loading' ? (
        <div className="loading-section">
          <h2>Starting Game...</h2>
          <p>Please confirm the transaction in MetaMask</p>
        </div>
      ) : (
        <ParticipantSetup onStartGame={startGame} />
      )}
      
      <StatusSection message={statusMessage} />
    </div>
  );
}

export default App;
