// login.js

function showTab(tab) {
    document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', (tab === 'admin') ? i===1 : i===0));
    document.querySelectorAll('.tab-pane').forEach((p,i) => p.classList.toggle('active', (tab === 'admin') ? i===1 : i===0));
}

function showMsg(id, msg, type) {
    const el = document.getElementById(id);
    el.className = 'alert alert-' + type;
    el.textContent = msg;
    el.style.display = 'block';
}

async function connectWallet() {
    document.getElementById('connect-btn-text').textContent = 'Connecting...';
    document.getElementById('connect-spinner').style.display = 'inline-block';
    const ok = await initBlockchain();
    document.getElementById('connect-btn-text').textContent = 'Connect MetaMask';
    document.getElementById('connect-spinner').style.display = 'none';
    if (ok) {
        document.getElementById('wallet-box').style.display = 'none';
        document.getElementById('wallet-connected').style.display = 'block';
        document.getElementById('wallet-addr').textContent = shortAddress(currentAccount);
        document.getElementById('chain-dot').style.background = '#22c55e';
        document.getElementById('chain-status').textContent = 'Connected to Ganache';
    }
}

async function loginUser() {
    const btn = document.getElementById('login-btn-text');
    btn.textContent = 'Checking...';
    document.getElementById('login-spinner').style.display = 'inline-block';
    try {
        const isReg = await contract.methods.isRegistered(currentAccount).call();
        const isAdm = await contract.methods.isAdmin(currentAccount).call();
        if (isAdm) {
            sessionStorage.setItem('role', 'admin');
            sessionStorage.setItem('walletAddress', currentAccount);
            window.location.href = 'admin/dashboard.html';
        } else if (isReg) {
            const name = await contract.methods.userNames(currentAccount).call();
            sessionStorage.setItem('role', 'user');
            sessionStorage.setItem('walletAddress', currentAccount);
            sessionStorage.setItem('userName', name);
            window.location.href = 'user/dashboard.html';
        } else {
            window.location.href = 'register.html';
        }
    } catch (e) {
        showMsg('msg-user', 'Error: ' + e.message, 'danger');
    }
    btn.textContent = 'Login / Register';
    document.getElementById('login-spinner').style.display = 'none';
}

async function connectAdminWallet() {
    const ok = await initBlockchain();
    if (ok) {
        document.getElementById('admin-addr').textContent = shortAddress(currentAccount);
        document.getElementById('admin-connected').style.display = 'block';
    }
}

async function loginAdmin() {
    try {
        const isAdm = await contract.methods.isAdmin(currentAccount).call();
        if (isAdm) {
            sessionStorage.setItem('role', 'admin');
            sessionStorage.setItem('walletAddress', currentAccount);
            window.location.href = 'admin/dashboard.html';
        } else {
            showMsg('msg-admin', '❌ This wallet is not the admin. Use the deployer wallet.', 'danger');
        }
    } catch (e) {
        showMsg('msg-admin', 'Error: ' + e.message, 'danger');
    }
}
