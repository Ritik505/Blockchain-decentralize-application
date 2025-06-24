import { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import Header from './components/Header';
import TransferForm from './components/TransferForm';
import TransactionHistory from './components/TransactionHistory';
import ConfirmationModal from './components/ConfirmationModal';
import './index.css'; 

const FUJI_RPC = 'https://api.avax-test.network/ext/bc/C/rpc';

function App() {
    const [web3, setWeb3] = useState(null);
    const [userAddress, setUserAddress] = useState('');
    const [senderBalance, setSenderBalance] = useState('');
    const [receiverBalance, setReceiverBalance] = useState('');
    const [gasFee, setGasFee] = useState('Estimated Gas Fee');
    const [status, setStatus] = useState({ message: '', type: '' });
    const [history, setHistory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        sender: '',
        receiver: '',
        amount: ''
    });

    const handleConnectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const web3Instance = new Web3(window.ethereum);
                setWeb3(web3Instance);

                const accounts = await web3Instance.eth.getAccounts();
                if (accounts.length > 0) {
                    const connectedAddress = accounts[0];
                    setUserAddress(connectedAddress);
                }

                const chainId = await web3Instance.eth.getChainId();
                if (chainId !== 43113) {
                    await switchNetwork(web3Instance);
                }
            } catch (error) {
                console.error('Error connecting to Web3:', error);
                setStatus({ message: 'Error connecting to MetaMask. ' + (error.message || ''), type: 'error' });
            }
        } else {
            setStatus({ message: 'Please install MetaMask to use this application.', type: 'error' });
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    const newAddress = accounts[0];
                    setUserAddress(newAddress);
                    setStatus({ message: 'Account changed successfully.', type: 'success' });
                } else {
                    setUserAddress('');
                    setWeb3(null);
                    setFormValues({ sender: '', receiver: '', amount: '' });
                    setStatus({ message: 'Wallet disconnected. Please connect again.', type: 'error' });
                }
            };
            
            const handleChainChanged = () => {
                window.location.reload();
            };

            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);

            return () => {
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
            };
        }
    }, []);

    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xA869' }],
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0xA869',
                        chainName: 'Avalanche Fuji Testnet',
                        nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
                        rpcUrls: [FUJI_RPC],
                        blockExplorerUrls: ['https://testnet.snowtrace.io/']
                    }]
                });
            }
        }
    };
    
    const fetchBalance = useCallback(async (type, address) => {
        if (!web3 || !web3.utils.isAddress(address)) {
            const balanceSetter = type === 'sender' ? setSenderBalance : setReceiverBalance;
            balanceSetter('');
            return;
        }
        try {
            const balance = await web3.eth.getBalance(address);
            const balanceInAVAX = web3.utils.fromWei(balance, 'ether');
            const formattedBalance = `${type.charAt(0).toUpperCase() + type.slice(1)} Balance: ${parseFloat(balanceInAVAX).toFixed(4)} AVAX`;
            if (type === 'sender') setSenderBalance(formattedBalance);
            else setReceiverBalance(formattedBalance);
        } catch (error) {
            console.error(`Error fetching ${type} balance:`, error);
        }
    }, [web3]);

    useEffect(() => {
        if(formValues.sender) fetchBalance('sender', formValues.sender);
        if(formValues.receiver) fetchBalance('receiver', formValues.receiver);
    }, [formValues.sender, formValues.receiver, fetchBalance]);

    const estimateGasFee = () => {
        if (!web3) return;
        const { sender, receiver, amount } = formValues;
        if (!web3.utils.isAddress(sender) || !web3.utils.isAddress(receiver) || !amount) {
            setGasFee('Estimated Gas Fee');
            return;
        }
        const fixedGasFee = 0.00000025;
        setGasFee(`Estimated Gas Fee: ${fixedGasFee.toFixed(8)} AVAX`);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues(prev => ({ ...prev, [id]: value }));
    };

    useEffect(() => {
        estimateGasFee();
    }, [formValues]);


    const handleConfirmTransaction = () => {
        if (!formValues.amount || isNaN(formValues.amount) || parseFloat(formValues.amount) <= 0) {
            setStatus({ message: 'Please enter a valid amount', type: 'error' });
            return;
        }
        setIsModalOpen(true);
    };

    const handleSendTransaction = async () => {
        if (!web3 || !web3.utils.isAddress(formValues.sender) || !web3.utils.isAddress(formValues.receiver)) {
            setStatus({ message: 'Invalid address format', type: 'error' });
            setIsModalOpen(false);
            return;
        }

        try {
            setIsModalOpen(false);
            setStatus({ message: 'Transaction in progress...', type: 'pending' });
            setSenderBalance('Sender Balance: Updating...');
            setReceiverBalance('Receiver Balance: Updating...');

            const receipt = await web3.eth.sendTransaction({
                from: formValues.sender,
                to: formValues.receiver,
                value: web3.utils.toWei(formValues.amount, 'ether'),
            });
            
            const newTx = `https://testnet.snowtrace.io/tx/${receipt.transactionHash}`;
            setHistory(prevHistory => [newTx, ...prevHistory]);
            setStatus({ message: 'Transaction successful!', type: 'success' });
            
            setTimeout(() => {
                fetchBalance('sender', formValues.sender);
                fetchBalance('receiver', formValues.receiver);
                setFormValues(prev => ({ ...prev, amount: '' }));
            }, 2000);

        } catch (error) {
            console.error('Transaction error:', error);
            setStatus({ message: 'Transaction failed: ' + error.message, type: 'error' });
            fetchBalance('sender', formValues.sender);
            fetchBalance('receiver', formValues.receiver);
        }
    };

    const handleClearFields = () => {
        setFormValues({ sender: '', receiver: '', amount: '' });
        setSenderBalance('');
        setReceiverBalance('');
        setGasFee('Estimated Gas Fee');
        setStatus({ message: '', type: '' });
    };

    return (
        <div id="container">
            <Header />
            
            {!userAddress ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button className="primary-btn" onClick={handleConnectWallet} style={{ width: 'auto' }}>
                        <i className="fas fa-wallet"></i>  Connect Wallet
                    </button>
                    {status.message && (
                         <p className={`message ${status.type}`} style={{width: 'auto', marginTop: '1rem'}}>{status.message}</p>
                    )}
                </div>
            ) : (
                <>
                    <TransferForm
                        formValues={formValues}
                        onInputChange={handleInputChange}
                        senderBalance={senderBalance}
                        receiverBalance={receiverBalance}
                        gasFee={gasFee}
                        onConfirm={handleConfirmTransaction}
                        onClear={handleClearFields}
                        status={status}
                    />
                    <TransactionHistory history={history} />
                </>
            )}
            
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSendTransaction}
                amount={formValues.amount}
            />
        </div>
    );
}

export default App;