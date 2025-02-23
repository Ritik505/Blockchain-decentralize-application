const contractAddress = "0xD4DB29384c29DfEc0Bf693ef06393676f75285AA";  
const contractABI = [
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
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "NewMemo",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "buyCoffee",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMemos",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "message",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Coffee.Memo[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;

async function connectWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();
        document.querySelector(".wallet-status").textContent = `Wallet Connected`;

        loadMemos();
    } else {
        alert("Please install MetaMask to use this DApp");
    }
}

async function buyCryptoSponsorship() {
    const name = document.getElementById("name").value.trim();
    const message = document.getElementById("message").value.trim();
    const amount = document.getElementById("amount").value.trim();

    if (!name || !message || !amount) {
        alert("All fields are required!");
        return;
    }

    document.getElementById("loading").style.display = "block";

    try {
        const accounts = await web3.eth.getAccounts();
        await contract.methods.buyCoffee(name, message).send({
            from: accounts[0],
            value: web3.utils.toWei(amount, "ether")
        });

        alert("Sponsorship sent successfully!");
        loadMemos();
    } catch (error) {
        alert("Transaction failed: " + error.message);
    }

    document.getElementById("loading").style.display = "none";
}

async function loadMemos() {
    const memos = await contract.methods.getMemos().call();
    const memosDiv = document.getElementById("memos");
    memosDiv.innerHTML = ""; 

    memos.forEach((memo) => {
        const memoElement = document.createElement("div");
        memoElement.classList.add("memo");
        const timestamp = Number(memo.timestamp); 
        memoElement.innerHTML = `<p><strong>${memo.name}</strong> (${new Date(timestamp * 1000).toLocaleString()})</p>
                                 <p>${memo.message}</p>`;
        memosDiv.appendChild(memoElement);
    });
}

window.onload = async () => {
    await connectWeb3();
};
