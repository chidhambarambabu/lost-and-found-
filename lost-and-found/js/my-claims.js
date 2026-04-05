// my-claims.js
window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    if (!wallet) { window.location.href = '../login.html'; return; }
    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }
    await loadMyClaims();
});

async function loadMyClaims() {
    const container = document.getElementById('claims-container');
    const wallet = sessionStorage.getItem('walletAddress');
    try {
        const total = await contract.methods.getTotalClaims().call();
        let myClaims = [];
        for (let i = 1; i <= Number(total); i++) {
            const claim = await contract.methods.getClaim(i).call();
            if (claim.claimId && claim.claimant.toLowerCase() === wallet.toLowerCase()) {
                const item = await contract.methods.getItem(claim.itemId).call();
                myClaims.push({ claim, item });
            }
        }

        if (myClaims.length === 0) {
            container.innerHTML = '<div class="card" style="text-align:center;padding:3rem"><div style="font-size:3rem">📭</div><p style="margin-top:1rem;color:var(--text-muted)">No claims submitted yet. <a href="search.html">Browse items to claim.</a></p></div>';
            return;
        }

        container.innerHTML = `
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Claim ID</th>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Proof</th>
                    </tr>
                </thead>
                <tbody>
                    ${myClaims.map(({ claim, item }) => `
                    <tr>
                        <td>#${claim.claimId}</td>
                        <td><a href="item-detail.html?id=${item.itemId}">${item.name || 'N/A'}</a></td>
                        <td>${item.category || '-'}</td>
                        <td>${item.location || '-'}</td>
                        <td>${tsToDate(claim.timestamp)}</td>
                        <td><span class="badge badge-${claim.status}">${claim.status.toUpperCase()}</span></td>
                        <td>${claim.proofImagePath ? `<a href="../uploads/${claim.proofImagePath}" target="_blank" class="btn btn-outline btn-sm">View Proof</a>` : 'N/A'}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    } catch(e) {
        container.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>';
    }
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
