// my-posts.js
window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    if (!wallet) { window.location.href = '../login.html'; return; }
    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }
    await loadMyPosts();
});

async function loadMyPosts() {
    const grid = document.getElementById('my-posts-grid');
    const wallet = sessionStorage.getItem('walletAddress');
    try {
        const total = await contract.methods.getTotalItems().call();
        let myItems = [];
        for (let i = 1; i <= Number(total); i++) {
            const item = await contract.methods.getItem(i).call();
            if (item.itemId && item.poster.toLowerCase() === wallet.toLowerCase()) {
                myItems.push(item);
            }
        }
        document.getElementById('post-count').textContent = `${myItems.length} post(s)`;
        if (myItems.length === 0) {
            grid.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:3rem"><div style="font-size:3rem">📭</div><p style="margin-top:1rem;color:var(--text-muted)">No posts yet. <a href="post-item.html">Post your first item!</a></p></div>';
            return;
        }
        grid.innerHTML = myItems.reverse().map(item => {
            const imgSrc = item.imagePath ? '../uploads/' + item.imagePath : '../uploads/no-image.png';
            return `
            <div class="item-card">
                <img src="${imgSrc}" alt="${item.name}" onclick="window.location.href='item-detail.html?id=${item.itemId}'" onerror="this.src='../uploads/no-image.png'">
                <div class="item-card-body">
                    <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.4rem">
                        <span class="badge badge-${item.itemType}">${item.itemType.toUpperCase()}</span>
                        ${item.isResolved ? '<span class="badge badge-resolved">RESOLVED</span>' : ''}
                    </div>
                    <div class="item-card-title">${item.name}</div>
                    <div class="item-card-meta">
                        <span>📂 ${item.category}</span>
                        <span>📍 ${item.location}</span>
                    </div>
                    <div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap">
                        <a href="item-detail.html?id=${item.itemId}" class="btn btn-outline btn-sm">View</a>
                        <a href="post-item.html?edit=${item.itemId}" class="btn btn-outline btn-sm">Edit</a>
                        <button class="btn btn-danger btn-sm" onclick="deletePost(${item.itemId})">Delete</button>
                        ${!item.isResolved ? `<button class="btn btn-success btn-sm" onclick="markResolved(${item.itemId})">Resolve</button>` : ''}
                    </div>
                </div>
            </div>`;
        }).join('');
    } catch(e) {
        grid.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>';
    }
}

async function deletePost(id) {
    if (!confirm('Delete this post permanently from the blockchain?')) return;
    try {
        await contract.methods.deleteItem(id).send({ from: currentAccount });
        alert('Post deleted!'); location.reload();
    } catch(e) { alert('Error: ' + e.message); }
}

async function markResolved(id) {
    if (!confirm('Mark item as resolved/found?')) return;
    try {
        await contract.methods.resolveItem(id).send({ from: currentAccount });
        alert('Marked as resolved!'); location.reload();
    } catch(e) { alert('Error: ' + e.message); }
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
