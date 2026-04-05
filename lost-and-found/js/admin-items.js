// admin-items.js
let allItems = [];

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
    await loadAllItems();
});

async function loadAllItems() {
    const container = document.getElementById('items-table');
    try {
        const total = await contract.methods.getTotalItems().call();
        allItems = [];
        for (let i = 1; i <= Number(total); i++) {
            const item = await contract.methods.getItem(i).call();
            if (item.itemId) allItems.push(item);
        }
        filterItems();
    } catch(e) { container.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>'; }
}

function filterItems() {
    const text = document.getElementById('search').value.toLowerCase();
    const type = document.getElementById('filter-type').value;
    const cat = document.getElementById('filter-cat').value;
    const status = document.getElementById('filter-status').value;

    const filtered = allItems.filter(item => {
        const matchText = !text || item.name.toLowerCase().includes(text) || item.location.toLowerCase().includes(text);
        const matchType = !type || item.itemType === type;
        const matchCat = !cat || item.category === cat;
        const matchStatus = !status || (status === 'resolved' ? item.isResolved : !item.isResolved);
        return matchText && matchType && matchCat && matchStatus;
    });
    renderItems(filtered);
}

function renderItems(data) {
    const container = document.getElementById('items-table');
    document.getElementById('count').textContent = `Showing ${data.length} item(s)`;
    if (data.length === 0) { container.innerHTML = '<div class="card" style="text-align:center;padding:2rem;color:var(--text-muted)">No items found.</div>'; return; }
    container.innerHTML = `<div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>Type</th><th>Name</th><th>Category</th><th>Location</th><th>Posted By</th><th>Mobile</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
        ${data.map(item => `<tr>
            <td>#${item.itemId}</td>
            <td><span class="badge badge-${item.itemType}">${item.itemType.toUpperCase()}</span></td>
            <td><a href="../user/item-detail.html?id=${item.itemId}">${item.name}</a></td>
            <td>${item.category}</td>
            <td>${item.location}</td>
            <td>${item.personName}</td>
            <td>${item.mobile}</td>
            <td>${item.dateLost}</td>
            <td>${item.isResolved ? '<span class="badge badge-resolved">Resolved</span>' : '<span class="badge badge-found">Active</span>'}</td>
            <td style="white-space:nowrap">
                ${!item.isResolved ? `<button class="btn btn-success btn-sm" onclick="resolveItem(${item.itemId})">Resolve</button> ` : ''}
                <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.itemId})">Delete</button>
            </td>
        </tr>`).join('')}
        </tbody></table></div>`;
}

async function resolveItem(id) {
    if (!confirm('Mark this item as resolved?')) return;
    try {
        await contract.methods.resolveItem(id).send({ from: currentAccount });
        alert('Item marked resolved!'); await loadAllItems();
    } catch(e) { alert('Error: ' + e.message); }
}

async function deleteItem(id) {
    if (!confirm('Delete this item permanently?')) return;
    try {
        await contract.methods.deleteItem(id).send({ from: currentAccount });
        alert('Item deleted!'); await loadAllItems();
    } catch(e) { alert('Error: ' + e.message); }
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
