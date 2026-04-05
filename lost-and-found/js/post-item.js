// post-item.js
let editItemId = null;

window.addEventListener('load', async () => {
    const wallet = sessionStorage.getItem('walletAddress');
    if (!wallet) { window.location.href = '../login.html'; return; }
    document.getElementById('wallet-display').textContent = '🦊 ' + shortAddress(wallet);

    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        currentAccount = wallet;
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    }

    // Pre-fill name/mobile from session
    const name = sessionStorage.getItem('userName');
    if (name) document.getElementById('person-name').value = name;

    // Check if editing
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    if (typeParam === 'found') {
        document.querySelector('input[value="found"]').checked = true;
        setType('found');
    }
    editItemId = params.get('edit');
    if (editItemId) {
        document.getElementById('page-title').textContent = '✏️ Edit Item';
        document.getElementById('post-text').textContent = 'Update on Blockchain';
        await loadItemForEdit(editItemId);
    }
});

function setType(type) {
    document.querySelectorAll('input[name="item-type"]').forEach(r => r.checked = r.value === type);
}

function previewImage(input) {
    const preview = document.getElementById('img-preview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
        reader.readAsDataURL(input.files[0]);
    }
}

async function loadItemForEdit(id) {
    const item = await contract.methods.getItem(id).call();
    document.querySelector(`input[value="${item.itemType}"]`).checked = true;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-desc').value = item.description;
    document.getElementById('item-location').value = item.location;
    document.getElementById('item-date').value = item.dateLost;
    document.getElementById('person-name').value = item.personName;
    document.getElementById('person-mobile').value = item.mobile;
    if (item.imagePath) {
        const prev = document.getElementById('img-preview');
        prev.src = '../uploads/' + item.imagePath;
        prev.style.display = 'block';
    }
}

async function postItem() {
    const type = document.querySelector('input[name="item-type"]:checked').value;
    const name = document.getElementById('item-name').value.trim();
    const category = document.getElementById('item-category').value;
    const desc = document.getElementById('item-desc').value.trim();
    const location = document.getElementById('item-location').value.trim();
    const date = document.getElementById('item-date').value;
    const personName = document.getElementById('person-name').value.trim();
    const mobile = document.getElementById('person-mobile').value.trim();
    const imageFile = document.getElementById('item-image').files[0];

    if (!name || !category || !desc || !location || !date || !personName || !mobile) {
        showMsg('All fields are required.', 'danger'); return;
    }

    const btn = document.getElementById('post-btn');
    document.getElementById('post-text').textContent = 'Processing...';
    document.getElementById('post-spinner').style.display = 'inline-block';
    btn.disabled = true;

    try {
        let imagePath = '';
        if (imageFile) {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('folder', 'items');
            const res = await fetch('../php/upload-image.php', { method: 'POST', body: formData });
            const data = await res.json();
            if (!data.success) throw new Error('Image upload failed: ' + data.error);
            imagePath = data.filename;
        }

        if (editItemId) {
            await contract.methods.updateItem(editItemId, name, category, desc, location, date, imagePath)
                .send({ from: currentAccount });
            showMsg('✅ Item updated on blockchain!', 'success');
        } else {
            await contract.methods.postItem(type, name, category, desc, location, date, imagePath, personName, mobile)
                .send({ from: currentAccount });
            showMsg('✅ Item posted on blockchain! Redirecting...', 'success');
        }
        setTimeout(() => window.location.href = 'my-posts.html', 2000);
    } catch(e) {
        showMsg('Error: ' + e.message, 'danger');
    }
    document.getElementById('post-text').textContent = editItemId ? 'Update on Blockchain' : 'Post on Blockchain';
    document.getElementById('post-spinner').style.display = 'none';
    btn.disabled = false;
}

function showMsg(text, type) {
    const el = document.getElementById('msg');
    el.className = 'alert alert-' + type;
    el.textContent = text;
    el.style.display = 'block';
}

function logout() { sessionStorage.clear(); window.location.href = '../login.html'; }
