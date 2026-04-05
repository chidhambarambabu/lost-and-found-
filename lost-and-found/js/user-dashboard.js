// user-dashboard.js
window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    const role = sessionStorage.getItem('role');
    if (!wallet || role !== 'user') { window.location.href = '../login.html'; return; }

    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);
    document.getElementById('wallet-stat').textContent = wallet;

    const name = sessionStorage.getItem('userName') || 'User';
    document.getElementById('user-name').textContent = name;

    // Init blockchain
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }

    await loadStats();
    await loadRecentItems();
});

async function loadStats() {
    try {
        const total = await contract.methods.getTotalItems().call();
        const totalClaims = await contract.methods.getTotalClaims().call();
        document.getElementById('total-items').textContent = total.toString();

        let myClaimCount = 0, approvedCount = 0;
        const wallet = sessionStorage.getItem('walletAddress');
        for (let i = 1; i <= Number(totalClaims); i++) {
            const claim = await contract.methods.getClaim(i).call();
            if (claim.claimant.toLowerCase() === wallet.toLowerCase()) {
                myClaimCount++;
                if (claim.status === 'approved') approvedCount++;
            }
        }
        document.getElementById('total-claims').textContent = myClaimCount;
        document.getElementById('approved-claims').textContent = approvedCount;
    } catch(e) { console.error(e); }
}

async function loadRecentItems() {
    const container = document.getElementById('recent-items');
    try {
        const total = await contract.methods.getTotalItems().call();
        if (Number(total) === 0) { container.innerHTML = '<p style="color:var(--text-muted)">No items posted yet.</p>'; return; }
        container.innerHTML = '';
        const start = Math.max(1, Number(total) - 5);
        for (let i = Number(total); i >= start; i--) {
            const item = await contract.methods.getItem(i).call();
            if (!item.itemId || item.itemId == 0) continue;
            container.innerHTML += renderItemCard(item);
        }
    } catch(e) { container.innerHTML = '<p style="color:var(--danger)">Error loading items: ' + e.message + '</p>'; }
}

function renderItemCard(item) {
    const imgSrc = item.imagePath ? '../uploads/' + item.imagePath : '../uploads/no-image.png';
    return `
    <div class="item-card" onclick="window.location.href='item-detail.html?id=${item.itemId}'">
        <img src="${imgSrc}" alt="${item.name}" onerror="this.src='../uploads/no-image.png'">
        <div class="item-card-body">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem">
                <span class="badge badge-${item.itemType}">${item.itemType.toUpperCase()}</span>
                ${item.isResolved ? '<span class="badge badge-resolved">RESOLVED</span>' : ''}
            </div>
            <div class="item-card-title">${item.name}</div>
            <div class="item-card-meta">
                <span>📂 ${item.category}</span>
                <span>📍 ${item.location}</span>
                <span>📅 ${item.dateLost}</span>
            </div>
        </div>
    </div>`;
}

function logout() {
    sessionStorage.clear();
    window.location.href = '../login.html';
}
