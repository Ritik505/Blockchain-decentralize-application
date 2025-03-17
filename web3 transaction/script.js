window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined') {
        window.web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
    } else {
        alert("Please install MetaMask or use a Web3-enabled browser.");
    }
});

async function fetchBalance(addressType) {
    const address = document.getElementById(`${addressType}Address`).value.trim();
    if (!web3.utils.isAddress(address)) {
        document.getElementById(`${addressType}Balance`).textContent = `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} Balance: Invalid Address`;
        return;
    }

    try {
        const balance = await web3.eth.getBalance(address);
        document.getElementById(`${addressType}Balance`).textContent = `${addressType.charAt(0).toUpperCase() + addressType.slice(1)} Balance: ${web3.utils.fromWei(balance, "ether")} ETH`;
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

async function estimateGasFee() {
    const sender = document.getElementById('senderAddress').value.trim();
    const receiver = document.getElementById('receiverAddress').value.trim();
    const amount = document.getElementById('etherAmount').value.trim();
    const gasFeeText = document.getElementById('gasFee');

    if (!sender || !receiver || !amount) {
        gasFeeText.textContent = "Estimated Gas Fee";
        return;
    }

    try {
        const estimatedGas = await web3.eth.estimateGas({
            from: sender,
            to: receiver,
            value: web3.utils.toWei(amount, "ether")
        });

        const gasPrice = await web3.eth.getGasPrice();
        const totalGasFee = web3.utils.fromWei((estimatedGas * gasPrice).toString(), "ether");

        gasFeeText.textContent = `Estimated Gas Fee: ${totalGasFee} ETH`;
    } catch (error) {
        gasFeeText.textContent = "Estimated Gas Fee: Error fetching gas estimate";
        console.error("Gas fee estimation error:", error);
    }
}

async function confirmTransaction() {
    const amount = document.getElementById('etherAmount').value.trim();

    if (!amount) {
        alert("Fill in all fields before confirming.");
        return;
    }

    document.getElementById('modalAmount').textContent = amount;
    document.getElementById('overlay').style.display = "block";
    document.getElementById('modal').style.display = "block";
}

function closeModal() {
    document.getElementById('overlay').style.display = "none";
    document.getElementById('modal').style.display = "none";
}

async function sendTransaction() {
    closeModal();  

    const sender = document.getElementById('senderAddress').value.trim();
    const receiver = document.getElementById('receiverAddress').value.trim();
    const amount = document.getElementById('etherAmount').value.trim();
    const history = document.getElementById('history');
    const status = document.getElementById('status');

    if (!sender || !receiver || !amount) {
        status.textContent = "Please fill in all fields before sending the transaction.";
        status.className = "message error";
        return;
    }

    status.textContent = "Transaction in Progress...";
    status.className = "message";

    try {
        const tx = await web3.eth.sendTransaction({
            from: sender,
            to: receiver,
            value: web3.utils.toWei(amount, "ether")
        });

        status.textContent = `Transaction Successful! Hash: ${tx.transactionHash}`;
        status.className = "message success";

        history.innerHTML += `<a href="https://etherscan.io/tx/${tx.transactionHash}" target="_blank">${tx.transactionHash}</a>`;

        fetchBalance('sender');
        fetchBalance('receiver');
    } catch (error) {
        status.textContent = `Transaction Failed: ${error.message}`;
        status.className = "message error";
    }
}

function clearFields() {
    document.getElementById('senderAddress').value = "";
    document.getElementById('receiverAddress').value = "";
    document.getElementById('etherAmount').value = "";
    document.getElementById('gasFee').textContent = "Estimated Gas Fee";
    document.getElementById('senderBalance').textContent = "Sender Balance: ";
    document.getElementById('receiverBalance').textContent = "Receiver Balance: ";
}
