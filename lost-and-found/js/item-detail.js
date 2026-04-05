// item-detail.js
let currentItemId;

window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    if (!wallet) { window.location.href = '../login.html'; return; }
    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);

    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }

    const params = new URLSearchParams(window.location.search);
    currentItemId = params.get('id');
    if (!currentItemId) { window.location.href = 'search.html'; return; }
    await loadItem(currentItemId);
});

async function loadItem(id) {
    const container = document.getElementById('item-detail');
    try {
        const item = await contract.methods.getItem(id).call();
        if (!item.itemId || item.itemId == 0) { container.innerHTML = '<div class="alert alert-danger">Item not found.</div>'; return; }

        const imgSrc = item.imagePath ? '../uploads/' + item.imagePath : '../uploads/no-image.png';
        const isOwner = item.poster.toLowerCase() === currentAccount.toLowerCase();
        const wallet = sessionStorage.getItem('walletAddress');

        container.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;align-items:start">
            <div>
                <img src="${imgSrc}" alt="${item.name}" style="width:100%;border-radius:var(--radius);box-shadow:var(--shadow)" onerror="this.src='../uploads/no-image.png'">
            </div>
            <div>
                <div style="display:flex;gap:0.5rem;margin-bottom:0.75rem;flex-wrap:wrap">
                    <span class="badge badge-${item.itemType}">${item.itemType.toUpperCase()}</span>
                    <span class="badge badge-${item.category.toLowerCase()}">${item.category}</span>
                    ${item.isResolved ? '<span class="badge badge-resolved">RESOLVED</span>' : '<span class="badge" style="background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0">ACTIVE</span>'}
                </div>
                <h1 style="font-size:1.75rem;margin-bottom:1rem">${item.name}</h1>
                <div class="card card-sm" style="margin-bottom:1rem">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;font-size:0.9rem">
                        <div><span style="color:var(--text-muted)">📂 Category</span><br><strong>${item.category}</strong></div>
                        <div><span style="color:var(--text-muted)">📍 Location</span><br><strong>${item.location}</strong></div>
                        <div><span style="color:var(--text-muted)">📅 Date Lost</span><br><strong>${item.dateLost}</strong></div>
                        <div><span style="color:var(--text-muted)">👤 Posted By</span><br><strong>${item.personName}</strong></div>
                        <div><span style="color:var(--text-muted)">📱 Mobile</span><br><strong>${item.mobile}</strong></div>
                        <div><span style="color:var(--text-muted)">🔗 Block Time</span><br><strong>${tsToDate(item.timestamp)}</strong></div>
                    </div>
                </div>
                <div class="card card-sm" style="margin-bottom:1rem">
                    <p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:0.3rem">DESCRIPTION</p>
                    <p style="font-size:0.95rem">${item.description}</p>
                </div>
                <div class="card card-sm" style="margin-bottom:1.25rem;font-size:0.8rem">
                    <p style="color:var(--text-muted);margin-bottom:0.2rem">Blockchain Record</p>
                    <p>Poster: <span style="font-family:monospace">${item.poster}</span></p>
                    <p>Item ID: #${item.itemId}</p>
                </div>
                ${!isOwner && !item.isResolved ? `
                <button class="btn btn-primary btn-lg" onclick="openClaimModal()">📩 Request to Claim</button>
                ` : ''}
                ${isOwner ? `
                <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
                    <a href="post-item.html?edit=${item.itemId}" class="btn btn-outline">✏️ Edit Post</a>
                    <button class="btn btn-danger" onclick="deleteItem(${item.itemId})">🗑️ Delete</button>
                    ${!item.isResolved ? `<button class="btn btn-success" onclick="markResolved(${item.itemId})">✅ Mark Resolved</button>` : ''}
                </div>
                ` : ''}
            </div>
        </div>`;
    } catch(e) {
        container.innerHTML = '<div class="alert alert-danger">Error: ' + e.message + '</div>';
    }
}

function openClaimModal() {
    document.getElementById('claim-modal').style.display = 'flex';
}
function closeClaimModal() {
    document.getElementById('claim-modal').style.display = 'none';
}

async function submitClaim() {
    const name = document.getElementById('claim-name').value.trim();
    const mobile = document.getElementById('claim-mobile').value.trim();
    const proofFile = document.getElementById('claim-proof').files[0];
    const msgEl = document.getElementById('claim-msg');

    if (!name || !mobile || !proofFile) {
        msgEl.className = 'alert alert-danger'; msgEl.textContent = 'All fields are required'; msgEl.style.display = 'block'; return;
    }

    const btn = document.getElementById('claim-submit-btn');
    btn.textContent = 'Submitting...'; btn.disabled = true;

    try {
        // Upload proof image to XAMPP via PHP
        const formData = new FormData();
        formData.append('image', proofFile);
        formData.append('folder', 'proofs');
        const uploadRes = await fetch('../php/upload-image.php', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadData.success) throw new Error('Image upload failed: ' + uploadData.error);

        const proofPath = uploadData.filename;

        await contract.methods.submitClaim(currentItemId, name, mobile, proofPath)
            .send({ from: currentAccount });

        msgEl.className = 'alert alert-success';
        msgEl.textContent = '✅ Claim submitted successfully! Track status in My Claims.';
        msgEl.style.display = 'block';
        setTimeout(closeClaimModal, 2500);
    } catch(e) {
        msgEl.className = 'alert alert-danger'; msgEl.textContent = 'Error: ' + e.message; msgEl.style.display = 'block';
    }
    btn.textContent = 'Submit Claim'; btn.disabled = false;
}

async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        await contract.methods.deleteItem(id).send({ from: currentAccount });
        alert('Post deleted.'); window.location.href = 'my-posts.html';
    } catch(e) { alert('Error: ' + e.message); }
}

async function markResolved(id) {
    if (!confirm('Mark this item as resolved/found?')) return;
    try {
        await contract.methods.resolveItem(id).send({ from: currentAccount });
        alert('Item marked as resolved!'); location.reload();
    } catch(e) { alert('Error: ' + e.message); }
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
