// admin-users.js
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
    await loadUsers();
});

async function loadUsers() {
    const container = document.getElementById('users-table');
    try {
        // Collect unique addresses from items and claims
        const [totalItems, totalClaims] = await Promise.all([
            contract.methods.getTotalItems().call(),
            contract.methods.getTotalClaims().call()
        ]);
        const addressSet = new Map();

        for (let i = 1; i <= Number(totalItems); i++) {
            const item = await contract.methods.getItem(i).call();
            if (item.poster && item.poster !== '0x0000000000000000000000000000000000000000') {
                if (!addressSet.has(item.poster)) {
                    const name = await contract.methods.userNames(item.poster).call();
                    const mobile = await contract.methods.userMobiles(item.poster).call();
                    const isAdm = await contract.methods.isAdmin(item.poster).call();
                    addressSet.set(item.poster, { name, mobile, isAdmin: isAdm, itemCount: 0, claimCount: 0 });
                }
                addressSet.get(item.poster).itemCount++;
            }
        }
        for (let i = 1; i <= Number(totalClaims); i++) {
            const c = await contract.methods.getClaim(i).call();
            if (c.claimant && c.claimant !== '0x0000000000000000000000000000000000000000') {
                if (!addressSet.has(c.claimant)) {
                    const name = await contract.methods.userNames(c.claimant).call();
                    const mobile = await contract.methods.userMobiles(c.claimant).call();
                    const isAdm = await contract.methods.isAdmin(c.claimant).call();
                    addressSet.set(c.claimant, { name, mobile, isAdmin: isAdm, itemCount: 0, claimCount: 0 });
                }
                addressSet.get(c.claimant).claimCount++;
            }
        }

        if (addressSet.size === 0) { container.innerHTML = '<p style="color:var(--text-muted)">No users found.</p>'; return; }

        const rows = Array.from(addressSet.entries()).map(([addr, data]) => `
        <tr>
            <td style="font-family:monospace;font-size:0.82rem">${addr}</td>
            <td>${data.name || 'N/A'}</td>
            <td>${data.mobile || 'N/A'}</td>
            <td>${data.isAdmin ? '<span class="badge badge-resolved">Admin</span>' : '<span class="badge badge-found">User</span>'}</td>
            <td>${data.itemCount}</td>
            <td>${data.claimCount}</td>
        </tr>`).join('');

        container.innerHTML = `<div class="table-wrap"><table>
            <thead><tr><th>Wallet Address</th><th>Name</th><th>Mobile</th><th>Role</th><th>Items Posted</th><th>Claims Made</th></tr></thead>
            <tbody>${rows}</tbody></table></div>`;
    } catch(e) {
        container.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>';
    }
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
