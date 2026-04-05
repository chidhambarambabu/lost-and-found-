// admin-dashboard.js
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
    await loadStats();
    await loadPendingClaims();
    await loadRecentItems();
});

async function loadStats() {
    try {
        const [items, claims, feedbacks] = await Promise.all([
            contract.methods.getTotalItems().call(),
            contract.methods.getTotalClaims().call(),
            contract.methods.getTotalFeedbacks().call()
        ]);
        document.getElementById('stat-items').textContent = items.toString();
        document.getElementById('stat-claims').textContent = claims.toString();
        document.getElementById('stat-feedbacks').textContent = feedbacks.toString();

        let pending = 0;
        for (let i = 1; i <= Number(claims); i++) {
            const c = await contract.methods.getClaim(i).call();
            if (c.status === 'pending') pending++;
        }
        document.getElementById('stat-pending').textContent = pending;
    } catch(e) { console.error(e); }
}

async function loadPendingClaims() {
    const container = document.getElementById('pending-claims');
    try {
        const total = await contract.methods.getTotalClaims().call();
        let rows = '';
        for (let i = Number(total); i >= Math.max(1, Number(total)-10); i--) {
            const c = await contract.methods.getClaim(i).call();
            if (c.claimId && c.status === 'pending') {
                const item = await contract.methods.getItem(c.itemId).call();
                rows += `<tr>
                    <td>#${c.claimId}</td>
                    <td>${item.name || 'N/A'}</td>
                    <td>${c.claimerName}</td>
                    <td>${c.claimerMobile}</td>
                    <td>${tsToDate(c.timestamp)}</td>
                    <td>${c.proofImagePath ? `<a href="../uploads/${c.proofImagePath}" target="_blank" class="btn btn-outline btn-sm">View</a>` : 'N/A'}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="approveClaim(${c.claimId})">Approve</button>
                        <button class="btn btn-danger btn-sm" style="margin-left:0.3rem" onclick="rejectClaim(${c.claimId})">Reject</button>
                    </td>
                </tr>`;
            }
        }
        if (!rows) { container.innerHTML = '<p style="color:var(--text-muted)">No pending claims.</p>'; return; }
        container.innerHTML = `<div class="table-wrap"><table>
            <thead><tr><th>ID</th><th>Item</th><th>Claimant</th><th>Mobile</th><th>Date</th><th>Proof</th><th>Action</th></tr></thead>
            <tbody>${rows}</tbody></table></div>`;
    } catch(e) { container.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>'; }
}

async function loadRecentItems() {
    const container = document.getElementById('recent-items');
    try {
        const total = await contract.methods.getTotalItems().call();
        let rows = '';
        for (let i = Number(total); i >= Math.max(1, Number(total)-5); i--) {
            const item = await contract.methods.getItem(i).call();
            if (item.itemId) {
                rows += `<tr>
                    <td>#${item.itemId}</td>
                    <td><span class="badge badge-${item.itemType}">${item.itemType}</span></td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>${item.location}</td>
                    <td>${item.personName}</td>
                    <td>${item.isResolved ? '<span class="badge badge-resolved">Resolved</span>' : '<span class="badge badge-found">Active</span>'}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="adminDelete(${item.itemId})">Delete</button></td>
                </tr>`;
            }
        }
        container.innerHTML = `<div class="table-wrap"><table>
            <thead><tr><th>ID</th><th>Type</th><th>Name</th><th>Category</th><th>Location</th><th>Posted By</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>${rows}</tbody></table></div>`;
    } catch(e) { container.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>'; }
}

async function approveClaim(id) {
    if (!confirm('Approve this claim?')) return;
    try {
        await contract.methods.updateClaimStatus(id, 'approved').send({ from: currentAccount });
        alert('Claim approved!'); location.reload();
    } catch(e) { alert('Error: ' + e.message); }
}

async function rejectClaim(id) {
    if (!confirm('Reject this claim?')) return;
    try {
        await contract.methods.updateClaimStatus(id, 'rejected').send({ from: currentAccount });
        alert('Claim rejected.'); location.reload();
    } catch(e) { alert('Error: ' + e.message); }
}

async function adminDelete(id) {
    if (!confirm('Delete this item from the blockchain?')) return;
    try {
        await contract.methods.deleteItem(id).send({ from: currentAccount });
        alert('Item deleted.'); location.reload();
    } catch(e) { alert('Error: ' + e.message); }
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
