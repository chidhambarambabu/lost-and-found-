// register.js
async function connectWalletForReg() {
    const ok = await initBlockchain();
    if (ok) {
        document.getElementById('wallet-box').style.display = 'none';
        document.getElementById('wallet-info').style.display = 'block';
        document.getElementById('w-addr').textContent = shortAddress(currentAccount);
    }
}

async function registerUser() {
    const name = document.getElementById('name').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const msg = document.getElementById('msg');

    if (!name || !mobile) { showMsg('Name and mobile are required', 'danger'); return; }
    if (!currentAccount) { await connectWalletForReg(); return; }

    document.getElementById('reg-text').textContent = 'Registering...';
    document.getElementById('reg-spinner').style.display = 'inline-block';
    document.getElementById('reg-btn').disabled = true;

    try {
        const isReg = await contract.methods.isRegistered(currentAccount).call();
        if (isReg) { showMsg('Already registered! Redirecting...', 'info'); setTimeout(() => window.location.href = 'login.html', 1500); return; }

        await contract.methods.registerUser(name, mobile).send({ from: currentAccount });
        showMsg('✅ Registered successfully! Redirecting to login...', 'success');
        sessionStorage.setItem('userName', name);
        sessionStorage.setItem('walletAddress', currentAccount);
        setTimeout(() => window.location.href = 'login.html', 2000);
    } catch (e) {
        showMsg('Error: ' + e.message, 'danger');
    }
    document.getElementById('reg-text').textContent = 'Register on Blockchain';
    document.getElementById('reg-spinner').style.display = 'none';
    document.getElementById('reg-btn').disabled = false;
}

function showMsg(text, type) {
    const el = document.getElementById('msg');
    el.className = 'alert alert-' + type;
    el.textContent = text;
    el.style.display = 'block';
}
