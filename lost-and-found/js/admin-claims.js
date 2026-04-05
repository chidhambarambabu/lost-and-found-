// admin-claims.js
let allClaims = [];

window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    const role = sessionStorage.getItem('role');
    if (!wallet || role !== 'admin') { window.location.href = '../login.html'; return; }
    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }
    await loadAllClaims();
});

async function loadAllClaims() {
    const container = document.getElementById('claims-table');
    container.innerHTML = '<div style="color:var(--text-muted)">Loading from blockchain...</div>';
    try {
        const total = await contract.methods.getTotalClaims().call();
        allClaims = [];
        for (let i = 1; i <= Number(total); i++) {
            const c = await contract.methods.getClaim(i).call();
            if (c.claimId) {
                const item = await contract.methods.getItem(c.itemId).call();
                allClaims.push({ claim: c, item });
            }
        }
        renderClaims(allClaims);
    } catch(e) {
        container.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>';
    }
}

function filterClaims(status) {
    const filtered = status === 'all' ? allClaims : allClaims.filter(({ claim }) => claim.status === status);
    renderClaims(filtered);
}

function renderClaims(data) {
    const container = document.getElementById('claims-table');
    if (data.length === 0) { container.innerHTML = '<div class="card" style="text-align:center;padding:2rem;color:var(--text-muted)">No claims found.</div>'; return; }
    container.innerHTML = `<div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>Item</th><th>Type</th><th>Claimant</th><th>Mobile</th><th>Date</th><th>Proof</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
        ${data.map(({ claim, item }) => `<tr>
            <td>#${claim.claimId}</td>
            <td><a href="../user/item-detail.html?id=${item.itemId}">${item.name || 'N/A'}</a></td>
            <td><span class="badge badge-${item.itemType || 'lost'}">${(item.itemType || 'N/A').toUpperCase()}</span></td>
            <td>${claim.claimerName}<br><span style="font-size:0.78rem;color:var(--text-muted);font-family:monospace">${shortAddress(claim.claimant)}</span></td>
            <td>${claim.claimerMobile}</td>
            <td>${tsToDate(claim.timestamp)}</td>
            <td>${claim.proofImagePath ? `<a href="../uploads/${claim.proofImagePath}" target="_blank" class="btn btn-outline btn-sm">View Proof</a>` : 'None'}</td>
            <td><span class="badge badge-${claim.status}">${claim.status.toUpperCase()}</span></td>
            <td>${claim.status === 'pending' ? `
                <button class="btn btn-success btn-sm" onclick="updateStatus(${claim.claimId}, 'approved')">✅ Approve</button>
                <button class="btn btn-danger btn-sm" style="margin-top:0.25rem" onclick="updateStatus(${claim.claimId}, 'rejected')">❌ Reject</button>
            ` : '—'}</td>
        </tr>`).join('')}
        </tbody></table></div>`;
}

async function updateStatus(id, status) {
    if (!confirm(`${status === 'approved' ? 'Approve' : 'Reject'} this claim?`)) return;
    try {
        await contract.methods.updateClaimStatus(id, status).send({ from: currentAccount });
        alert(`Claim ${status}!`); await loadAllClaims();
    } catch(e) { alert('Error: ' + e.message); }
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
