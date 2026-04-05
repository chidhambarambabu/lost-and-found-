// profile.js
window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    if (!wallet) { window.location.href = '../login.html'; return; }
    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);
    document.getElementById('profile-wallet').value = wallet;
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }
    try {
        const name = await contract.methods.userNames(wallet).call();
        const mobile = await contract.methods.userMobiles(wallet).call();
        document.getElementById('profile-name').value = name;
        document.getElementById('profile-mobile').value = mobile;
    } catch(e) { console.error(e); }
});

async function updateProfile() {
    const name = document.getElementById('profile-name').value.trim();
    const mobile = document.getElementById('profile-mobile').value.trim();
    if (!name || !mobile) { showMsg('profile-msg', 'Name and mobile required', 'danger'); return; }
    try {
        await contract.methods.updateProfile(name, mobile).send({ from: currentAccount });
        sessionStorage.setItem('userName', name);
        showMsg('profile-msg', '✅ Profile updated on blockchain!', 'success');
    } catch(e) { showMsg('profile-msg', 'Error: ' + e.message, 'danger'); }
}

async function changePassword() {
    const curr = document.getElementById('curr-pwd').value;
    const newPwd = document.getElementById('new-pwd').value;
    const confirm = document.getElementById('confirm-pwd').value;
    if (!curr || !newPwd || !confirm) { showMsg('pwd-msg', 'All fields required', 'danger'); return; }
    if (newPwd !== confirm) { showMsg('pwd-msg', 'Passwords do not match', 'danger'); return; }
    try {
        const res = await fetch('../php/change-password.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wallet: currentAccount, currentPassword: curr, newPassword: newPwd })
        });
        const data = await res.json();
        if (data.success) { showMsg('pwd-msg', '✅ Password changed!', 'success'); }
        else { showMsg('pwd-msg', data.error, 'danger'); }
    } catch(e) { showMsg('pwd-msg', 'Server error: ' + e.message, 'danger'); }
}

function showMsg(id, text, type) {
    const el = document.getElementById(id);
    el.className = 'alert alert-' + type; el.textContent = text; el.style.display = 'block';
}
function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
