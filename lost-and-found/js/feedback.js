// feedback.js
let selectedRating = 0;

window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    if (!wallet) { window.location.href = '../login.html'; return; }
    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }
    await loadFeedbacks();
});

function setRating(r) {
    selectedRating = r;
    document.querySelectorAll('#star-rating span').forEach((s, i) => {
        s.textContent = i < r ? '★' : '☆';
        s.style.color = i < r ? '#f59e0b' : '#94a3b8';
    });
}

async function submitFeedback() {
    const message = document.getElementById('fb-message').value.trim();
    if (!message || selectedRating === 0) {
        showMsg('fb-msg', 'Please provide a rating and message.', 'danger'); return;
    }
    try {
        await contract.methods.postFeedback(message, selectedRating).send({ from: currentAccount });
        showMsg('fb-msg', '✅ Feedback submitted on blockchain!', 'success');
        document.getElementById('fb-message').value = '';
        setRating(0);
        await loadFeedbacks();
    } catch(e) { showMsg('fb-msg', 'Error: ' + e.message, 'danger'); }
}

async function loadFeedbacks() {
    const container = document.getElementById('feedback-list');
    try {
        const total = await contract.methods.getTotalFeedbacks().call();
        if (Number(total) === 0) { container.innerHTML = '<p style="color:var(--text-muted)">No feedback yet.</p>'; return; }
        let html = '';
        for (let i = Number(total); i >= 1; i--) {
            const fb = await contract.methods.getFeedback(i).call();
            const stars = '★'.repeat(Number(fb.rating)) + '☆'.repeat(5 - Number(fb.rating));
            html += `
            <div style="padding:1rem 0;border-bottom:1px solid var(--border)">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.35rem">
                    <span style="color:#f59e0b;font-size:1.1rem">${stars}</span>
                    <span style="color:var(--text-muted);font-size:0.8rem">${tsToDate(fb.timestamp)}</span>
                </div>
                <p style="font-size:0.93rem;margin-bottom:0.25rem">${fb.message}</p>
                <span style="font-size:0.78rem;color:var(--text-muted);font-family:monospace">${shortAddress(fb.user)}</span>
            </div>`;
        }
        container.innerHTML = html;
    } catch(e) { container.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>'; }
}

function showMsg(id, text, type) {
    const el = document.getElementById(id);
    el.className = 'alert alert-' + type; el.textContent = text; el.style.display = 'block';
}
function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
