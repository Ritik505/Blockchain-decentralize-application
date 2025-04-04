const CONTRACT_ADDRESS = "YOUR CONTRACT DEPLOYED ADDRESS"; 
const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "getLatestETHPrice",
        "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLatestBTCPrice",
        "outputs": [{ "internalType": "int256", "name": "", "type": "int256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

function toggleDropdown(type) {
    const dropdown = document.getElementById(`${type}Dropdown`);
    const arrow = dropdown.previousElementSibling.querySelector(".arrow");

    if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
        arrow.style.transform = "rotate(0deg)";
    } else {
        dropdown.classList.add("show");
        arrow.style.transform = "rotate(180deg)";
    }
}

async function fetchPrices() {
    try {
        if (!window.ethereum) {
            document.getElementById("error").innerText = "MetaMask not detected!";
            return;
        }

        
        await window.ethereum.request({ method: "eth_requestAccounts" });

    
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        
        const ethPriceRaw = await contract.getLatestETHPrice();
        const btcPriceRaw = await contract.getLatestBTCPrice();

    
        document.getElementById("ethPrice").innerText = `$${(Number(ethPriceRaw) / 10 ** 8).toFixed(2)}`;
        document.getElementById("btcPrice").innerText = `$${(Number(btcPriceRaw) / 10 ** 8).toFixed(2)}`;
    } catch (err) {
        document.getElementById("error").innerText = `Error: ${err.message}`;
    }
}

async function fetchBalance() {
    try {
        if (!window.ethereum) {
            document.getElementById("error").innerText = "MetaMask not detected!";
            return;
        }

        const selectedOption = document.getElementById("walletOptions").value;
        if (selectedOption !== "balance") return;

    
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);

    
        const balance = await provider.getBalance(accounts[0]);
        const balanceInEth = ethers.utils.formatEther(balance);

        document.getElementById("walletBalance").innerText = `${parseFloat(balanceInEth).toFixed(4)}`;
    } catch (err) {
        document.getElementById("error").innerText = `Error: ${err.message}`;
    }
}

window.onload = fetchPrices;
