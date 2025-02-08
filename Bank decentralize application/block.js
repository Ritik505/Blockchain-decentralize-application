var web3;
var address = "0x/ECA3Bc4B6f2C6F806bcf5f48Fb5fcd41a26177b2";

async function Connect() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            web3 = new Web3(window.ethereum);
            alert("Wallet Connected!");
        } catch (error) {
            alert("Connection Failed: " + error.message);
        }
    } else {
        alert("Please install MetaMask to use this feature!");
    }
}

if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
}

var abi = [
    {
        "inputs": [{ "internalType": "int256", "name": "amt", "type": "int256" }],
        "name": "deposite_money", // ✅ Correct function name from smart contract
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "int256", "name": "amt", "type": "int256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBalance",
        "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

var contract = new web3.eth.Contract(abi, address);

async function deposit() { 
    var inputval = document.getElementById("amount").value;
    if (!inputval) {
        alert("Enter an amount to deposit!");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.deposite_money(parseInt(inputval)).send({ from: accounts[0] });
        document.getElementById("amount").value = ""; // Clear input
        alert("Deposit Successful!");
    } catch (error) {
        alert("Transaction Failed: " + error.message);
    }
}

async function withdraw() { 
    var inputval = document.getElementById("amount").value;
    if (!inputval) {
        alert("Enter an amount to withdraw!");
        return;
    }

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.withdraw(parseInt(inputval)).send({ from: accounts[0] });
        document.getElementById("amount").value = ""; 
        alert("Withdrawal Successful!");
    } catch (error) {
        alert("Transaction Failed: " + error.message);
    }
}

async function show_balance() {
    try {
        const balance = await contract.methods.getBalance().call();
        document.getElementById("balance").innerHTML = balance;
    } catch (error) {
        alert("Error: " + error.message);
    }
}
