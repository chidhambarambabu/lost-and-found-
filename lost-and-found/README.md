# Lost & Found Blockchain DApp — Complete Setup Guide

## 📁 Project Structure
```
lost-and-found/
├── login.html              ← Login page (User + Admin)
├── register.html           ← User registration
├── css/
│   ├── global.css          ← Shared styles (all pages)
│   └── login.css           ← Login/register styles
├── js/
│   ├── blockchain.js       ← ⚠️ MetaMask + Web3 + Contract ABI (EDIT THIS)
│   ├── login.js
│   ├── register.js
│   ├── user-dashboard.js
│   ├── search.js
│   ├── item-detail.js
│   ├── post-item.js
│   ├── my-posts.js
│   ├── my-claims.js
│   ├── profile.js
│   ├── feedback.js
│   ├── admin-dashboard.js
│   ├── admin-claims.js
│   ├── admin-items.js
│   └── admin-users.js
├── user/
│   ├── dashboard.html
│   ├── search.html
│   ├── item-detail.html
│   ├── post-item.html
│   ├── my-posts.html
│   ├── my-claims.html
│   ├── profile.html
│   └── feedback.html
├── admin/
│   ├── dashboard.html
│   ├── claim-requests.html
│   ├── all-items.html
│   └── user-accounts.html
├── php/
│   ├── upload-image.php    ← Handles image uploads to XAMPP
│   └── change-password.php ← Off-chain password management
├── contracts/
│   └── LostAndFound.sol    ← Solidity smart contract
└── uploads/                ← Images stored here (XAMPP only)
    ├── items/
    └── proofs/
```

---

## 🚀 STEP-BY-STEP SETUP

### STEP 1 — Start Ganache
1. Open **Ganache** application
2. Create a new Workspace or use Quickstart
3. Note the **RPC URL** (default: `http://127.0.0.1:7545`)
4. Note **Account[0]** — this will be the admin wallet

### STEP 2 — Deploy Smart Contract in Remix
1. Open **https://remix.ethereum.org**
2. Create a new file: `LostAndFound.sol`
3. Copy the full content from `contracts/LostAndFound.sol` into it
4. Click **Solidity Compiler** tab (left sidebar)
5. Select compiler version: `0.8.0` or higher
6. Click **Compile LostAndFound.sol**
7. Click **Deploy & Run Transactions** tab
8. In the **ENVIRONMENT** dropdown, select: **Injected Provider - MetaMask**
9. MetaMask will pop up — connect to your Ganache account
10. Click **Deploy**
11. ✅ After deployment, copy the **Contract Address** (shown below the Deploy button)
12. Also copy the **ABI**: click the copy icon next to "ABI" in the Compilation Details

### STEP 3 — Connect MetaMask to Ganache
1. Open MetaMask extension
2. Click the network dropdown → **Add Network** → **Add a network manually**
3. Fill in:
   - **Network Name:** Ganache Local
   - **New RPC URL:** `http://127.0.0.1:7545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** ETH
4. Click Save
5. Import Ganache accounts:
   - In Ganache, click the key icon on Account[0] to see the private key
   - In MetaMask: Account menu → **Import Account** → paste private key
   - This account is the **Admin**
   - Import Account[1], [2], etc. for test users

### STEP 4 — Paste Contract Address & ABI
Open `js/blockchain.js` and:
1. Replace `"0xYOUR_CONTRACT_ADDRESS_HERE"` with your deployed contract address
2. Replace the `CONTRACT_ABI` array with the ABI copied from Remix

Example:
```javascript
const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const CONTRACT_ABI = [ ...paste ABI here... ];
```

### STEP 5 — Setup XAMPP
1. Open **XAMPP Control Panel**
2. Start **Apache** and **MySQL** (MySQL optional for this project)
3. Copy the entire `lost-and-found/` folder to:
   - **Windows:** `C:\xampp\htdocs\lost-and-found\`
   - **Mac/Linux:** `/Applications/XAMPP/htdocs/lost-and-found/`
4. Create the uploads folder with write permissions:
   - `htdocs/lost-and-found/uploads/items/`
   - `htdocs/lost-and-found/uploads/proofs/`
5. Access at: `http://localhost/lost-and-found/login.html`

### STEP 6 — First Login
1. Open `http://localhost/lost-and-found/login.html`
2. Click **Admin Login** tab
3. Connect MetaMask using **Account[0]** (the deployer/admin)
4. Click **Login as Admin** → redirected to admin dashboard
5. For user: switch MetaMask to another account, go to **User Login** tab → Connect → Register

---

## 🔗 WHERE TO PASTE METAMASK & REMIX CODE

| File | What to paste |
|------|--------------|
| `js/blockchain.js` line 8 | Contract address from Remix |
| `js/blockchain.js` line 10 | Contract ABI array from Remix |
| MetaMask custom network | Ganache RPC: `http://127.0.0.1:7545`, Chain ID: `1337` |

---

## ⚠️ IMPORTANT NOTES

- **Images** are stored in XAMPP's `uploads/` folder, NOT on the blockchain
- Only the **image filename/path** is stored on-chain
- The blockchain stores: item details, claim requests, user registration, feedback
- Admin is the **wallet that deployed the contract** (Account[0] in Ganache)
- Each MetaMask transaction requires confirmation — normal for development
- No item IDs are used for searching — all items are displayed and filtered client-side
