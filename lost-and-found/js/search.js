// search.js
let allItems = [];

window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    if (!wallet) { window.location.href = '../login.html'; return; }
    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);

    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }
    await loadAllItems();
});

async function loadAllItems() {
    const grid = document.getElementById('items-grid');
    grid.innerHTML = '<div style="color:var(--text-muted)">Loading from blockchain...</div>';
    try {
        const total = await contract.methods.getTotalItems().call();
        allItems = [];
        const locations = new Set();
        for (let i = 1; i <= Number(total); i++) {
            const item = await contract.methods.getItem(i).call();
            if (item.itemId && item.itemId != 0) {
                allItems.push(item);
                if (item.location) locations.add(item.location);
            }
        }
        // Populate location filter
        const locSelect = document.getElementById('filter-location');
        locations.forEach(loc => {
            const opt = document.createElement('option');
            opt.value = loc; opt.textContent = loc;
            locSelect.appendChild(opt);
        });
        filterItems();
    } catch(e) {
        grid.innerHTML = '<div class="alert alert-danger">Error loading items: ' + e.message + '</div>';
    }
}

function filterItems() {
    const text = document.getElementById('search-text').value.toLowerCase();
    const type = document.getElementById('filter-type').value;
    const category = document.getElementById('filter-category').value;
    const location = document.getElementById('filter-location').value;
    const status = document.getElementById('filter-status').value;

    const filtered = allItems.filter(item => {
        const matchText = !text || 
            item.name.toLowerCase().includes(text) ||
            item.description.toLowerCase().includes(text) ||
            item.location.toLowerCase().includes(text) ||
            item.category.toLowerCase().includes(text) ||
            item.personName.toLowerCase().includes(text);
        const matchType = !type || item.itemType === type;
        const matchCat = !category || item.category === category;
        const matchLoc = !location || item.location === location;
        const matchStatus = !status || (status === 'resolved' ? item.isResolved : !item.isResolved);
        return matchText && matchType && matchCat && matchLoc && matchStatus;
    });

    renderItems(filtered);
}

function renderItems(items) {
    const grid = document.getElementById('items-grid');
    document.getElementById('result-count').textContent = `Showing ${items.length} item(s)`;
    if (items.length === 0) {
        grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-muted)"><div style="font-size:3rem">🔍</div><p style="margin-top:0.75rem">No items found matching your search.</p></div>';
        return;
    }
    grid.innerHTML = items.map(item => {
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
                <p style="font-size:0.83rem;color:var(--text-muted);margin-top:0.4rem">${item.description.substring(0,80)}...</p>
            </div>
        </div>`;
    }).join('');
}

function resetFilters() {
    document.getElementById('search-text').value = '';
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-location').value = '';
    document.getElementById('filter-status').value = '';
    filterItems();
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
