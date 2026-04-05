// ============================================================
// blockchain.js — MetaMask + Ganache + Web3 Connection
// PASTE YOUR CONTRACT ADDRESS AND ABI HERE AFTER DEPLOYING
// IN REMIX IDE
// ============================================================

// ---- STEP 1: After deploying in Remix, paste contract address here ----
const CONTRACT_ADDRESS = "0xE0A4892aF5D98d9a6Ce5A62657faE87a545F0424"; 
// Example: "0xd9145CCE52D386f254917e481eB44e9943F39138"

// ---- STEP 2: After deploying in Remix, copy the ABI from 
//              Remix > Compilation Details > ABI and paste below ----
const CONTRACT_ABI = [
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
				"internalType": "uint256",
				"name": "claimId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "claimant",
				"type": "address"
			}
		],
		"name": "ClaimSubmitted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "claimId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"name": "ClaimUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			}
		],
		"name": "deleteItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "feedbackId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "FeedbackPosted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "poster",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "itemType",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "ItemPosted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			}
		],
		"name": "ItemResolved",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_rating",
				"type": "uint256"
			}
		],
		"name": "postFeedback",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_itemType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_category",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_dateLost",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_imagePath",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_personName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_mobile",
				"type": "string"
			}
		],
		"name": "postItem",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_mobile",
				"type": "string"
			}
		],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			}
		],
		"name": "resolveItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_claimerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_claimerMobile",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_proofImagePath",
				"type": "string"
			}
		],
		"name": "submitClaim",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_claimId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_status",
				"type": "string"
			}
		],
		"name": "updateClaimStatus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_category",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_dateLost",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_imagePath",
				"type": "string"
			}
		],
		"name": "updateItem",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_mobile",
				"type": "string"
			}
		],
		"name": "updateProfile",
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
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
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
		"name": "claimCounter",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "claims",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "claimId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "claimant",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "claimerName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "claimerMobile",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "proofImagePath",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "feedbackCounter",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "feedbacks",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "feedbackId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "rating",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllUsers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_claimId",
				"type": "uint256"
			}
		],
		"name": "getClaim",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "claimId",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "itemId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "claimant",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "claimerName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "claimerMobile",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "proofImagePath",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "status",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct LostAndFound.ClaimRequest",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_feedbackId",
				"type": "uint256"
			}
		],
		"name": "getFeedback",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "feedbackId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "user",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "message",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "rating",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct LostAndFound.Feedback",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_itemId",
				"type": "uint256"
			}
		],
		"name": "getItem",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "itemId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "poster",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "itemType",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "category",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "dateLost",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "imagePath",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "personName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "mobile",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isResolved",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct LostAndFound.Item",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalClaims",
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
		"name": "getTotalFeedbacks",
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
		"name": "getTotalItems",
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
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "isAdmin",
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
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "isRegistered",
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
		"name": "itemCounter",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "items",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "itemId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "poster",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "itemType",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "category",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dateLost",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "imagePath",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "personName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "mobile",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isResolved",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
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
				"name": "",
				"type": "address"
			}
		],
		"name": "registeredUsers",
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
		"name": "userMobiles",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
		"name": "userNames",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// ---- STEP 3: MetaMask + Ganache Setup ----
// In MetaMask: Add Network > Custom RPC
//   Network Name: Ganache
//   RPC URL: http://127.0.0.1:7545
//   Chain ID: 1337
//   Currency: ETH

let web3;
let contract;
let currentAccount;

async function initBlockchain() {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Request MetaMask account access
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            currentAccount = accounts[0];
            web3 = new Web3(window.ethereum);

            // ⚠️ Check chain ID matches Ganache (1337)
            const chainId = await web3.eth.getChainId();
            if (chainId !== 1337n && chainId !== 1337) {
                alert("⚠️ Please switch MetaMask to the Ganache network (Chain ID: 1337)");
                return false;
            }

            // Create contract instance
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            // Listen for account changes
            window.ethereum.on("accountsChanged", (accounts) => {
                currentAccount = accounts[0];
                sessionStorage.setItem("walletAddress", currentAccount);
                location.reload();
            });

            sessionStorage.setItem("walletAddress", currentAccount);
            console.log("✅ Blockchain connected. Account:", currentAccount);
            return true;
        } catch (err) {
            console.error("MetaMask connection error:", err);
            alert("MetaMask connection failed: " + err.message);
            return false;
        }
    } else {
        alert("❌ MetaMask not found! Please install MetaMask extension.");
        return false;
    }
}

// Helper: get current wallet address
function getAccount() {
    return currentAccount || sessionStorage.getItem("walletAddress");
}

// Helper: shorten address for display
function shortAddress(addr) {
    if (!addr) return "";
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
}

// Helper: convert timestamp to date string
function tsToDate(timestamp) {
    if (!timestamp || timestamp == 0) return "N/A";
    return new Date(Number(timestamp) * 1000).toLocaleDateString("en-IN");
}

// Auto-connect on page load if already authorized
window.addEventListener("load", async () => {
    if (typeof window.ethereum !== "undefined") {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
            web3 = new Web3(window.ethereum);
            currentAccount = accounts[0];
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            sessionStorage.setItem("walletAddress", currentAccount);
        }
    }
});
