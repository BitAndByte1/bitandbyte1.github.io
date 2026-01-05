import { monitorAuth, login, logout } from './auth.js';
import { addLaptop, getLaptops, deleteLaptop, uploadImage } from './db.js';

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const addLaptopForm = document.getElementById('addLaptopForm');
const productList = document.getElementById('adminProductList');

// Initialize Auth
monitorAuth(loginSection, dashboardSection, logoutBtn);

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
});

// Logout Handler
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await logout();
});

// Add Laptop Handler
addLaptopForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = addLaptopForm.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Качва се...';

    try {
        const model = document.getElementById('model').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;
        const imageFile = document.getElementById('imageFile').files[0];

        if (!imageFile) throw new Error("Моля изберете снимка!");

        const imageUrl = await uploadImage(imageFile);
        await addLaptop(model, price, description, imageUrl);

        addLaptopForm.reset();
        alert("Лаптопът е добавен успешно!");
        loadProducts(); // Refresh list
    } catch (error) {
        alert("Грешка: " + error.message);
        console.error(error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Добави Лаптоп';
    }
});

// Load and Display Products for Admin
async function loadProducts() {
    if (!productList) return;

    productList.innerHTML = '<p>Зареждане...</p>';
    const laptops = await getLaptops();
    productList.innerHTML = '';

    if (laptops.length === 0) {
        productList.innerHTML = '<p>Няма намерени лаптопи.</p>';
        return;
    }

    laptops.forEach(laptop => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `
            <div style="display:flex; align-items:center;">
                <img src="${laptop.imageUrl}" alt="${laptop.model}">
                <div>
                    <h4>${laptop.model}</h4>
                    <p>${laptop.price} €</p>
                </div>
            </div>
            <button class="btn" style="background: #d9534f;" onclick="window.removeLaptop('${laptop.id}', '${laptop.imageUrl}')">Изтрий</button>
        `;
        productList.appendChild(div);
    });
}

// Make removeLaptop available globally
window.removeLaptop = async (id, imageUrl) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този лаптоп?')) {
        await deleteLaptop(id, imageUrl);
        loadProducts();
    }
};

// Listen for auth state to load products only when logged in
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadProducts();
    }
});
