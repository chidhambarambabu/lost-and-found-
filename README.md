
# 🔍 Lost & Found Blockchain DApp

A decentralized application (DApp) that helps users report, search, and claim lost items securely using blockchain technology. This system ensures transparency, trust, and tamper-proof records using smart contracts.

---

## 🚀 Features

* 🔐 MetaMask authentication (User & Admin)
* 📦 Post lost and found items
* 🔎 Search and filter items
* ✅ Secure claim request system
* 👨‍💼 Admin dashboard for management
* 💬 Feedback system
* 🖼️ Image upload (stored off-chain via XAMPP)
* 🔗 Blockchain-based data storage (Ethereum smart contract)

---

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Blockchain:** Solidity, Web3.js
* **Development Tools:** Ganache, Remix IDE
* **Wallet:** MetaMask
* **Backend (Off-chain):** PHP (XAMPP)

---

## 📁 Project Structure

```
lost-and-found/
├── login.html
├── register.html
├── css/
│   ├── global.css
│   └── login.css
├── js/
│   ├── blockchain.js
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
├── admin/
├── php/
├── contracts/
└── uploads/
```

---

## ⚡ Quick Start

1. Start Ganache
2. Deploy smart contract using Remix
3. Connect MetaMask to Ganache
4. Update contract address & ABI in `js/blockchain.js`
5. Start XAMPP and open:
   👉 http://localhost/lost-and-found/login.html

---

## 🚀 Detailed Setup Guide

### STEP 1 — Start Ganache

1. Open Ganache
2. Create a new workspace or use Quickstart
3. Note:

   * RPC URL: `http://127.0.0.1:7545`
   * Account[0] (Admin wallet)

---

### STEP 2 — Deploy Smart Contract (Remix)

1. Open https://remix.ethereum.org
2. Create file: `LostAndFound.sol`
3. Paste contract code
4. Compile using Solidity version `0.8.0+`
5. Go to **Deploy & Run Transactions**
6. Select environment: **Injected Provider - MetaMask**
7. Connect MetaMask → Deploy

✅ Copy:

* Contract Address
* Contract ABI

---

### STEP 3 — Connect MetaMask to Ganache

1. Open MetaMask
2. Add network manually:

* Network Name: Ganache Local
* RPC URL: http://127.0.0.1:7545
* Chain ID: 1337
* Currency Symbol: ETH

3. Import Ganache accounts using private keys
4. Use Account[0] as Admin

---

### STEP 4 — Configure Blockchain اتصال

Edit `js/blockchain.js`:

```javascript
const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS";
const CONTRACT_ABI = [ /* Paste ABI here */ ];
```

---

### STEP 5 — Setup XAMPP

1. Start Apache (and MySQL optional)
2. Copy project to:

```
C:\xampp\htdocs\lost-and-found\
```

3. Create folders:

```
uploads/items/
uploads/proofs/
```

4. Open in browser:

```
http://localhost/lost-and-found/login.html
```

---

### STEP 6 — First Login

#### Admin Login:

* Use MetaMask Account[0]
* Click "Login as Admin"

#### User Login:

* Switch MetaMask account
* Register and login

---

## 📸 Screenshots

*(Add your screenshots here)*

```
screenshots/login.png
screenshots/dashboard.png
screenshots/admin.png
```

---

## 🔗 Important Notes

* Images are stored **off-chain** (XAMPP uploads folder)
* Blockchain stores:

  * Item details
  * Claim requests
  * User data
  * Feedback
* Admin = Wallet that deployed the contract
* Every transaction requires MetaMask confirmation
* No ID-based search — filtering is client-side

---

## 👨‍💻 Author

**Chidhambaram B**
Software Engineering Student

---

## 📄 License

This project is developed for educational purposes.

---
