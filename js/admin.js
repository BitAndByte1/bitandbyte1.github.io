import { monitorAuth, login, logout } from './auth.js';
import { addLaptop, getLaptops, deleteLaptop } from './backend.js';
import { getAppointments, updateAppointmentStatus, deleteAppointment } from './appointments.js';

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const addLaptopForm = document.getElementById('addLaptopForm');
const productList = document.getElementById('adminProductList');

// Tab Elements
const tabLaptops = document.getElementById('tabLaptops');
const tabAppointments = document.getElementById('tabAppointments');
const laptopsSection = document.getElementById('laptopsSection');
const appointmentsSection = document.getElementById('appointmentsSection');
const appointmentsList = document.getElementById('appointmentsList');

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

// Tab Switching
tabLaptops.addEventListener('click', () => {
    laptopsSection.classList.remove('hidden');
    appointmentsSection.classList.add('hidden');
    tabLaptops.style.background = '#2a2a2a';
    tabAppointments.style.background = 'transparent';
    loadProducts();
});

tabAppointments.addEventListener('click', () => {
    laptopsSection.classList.add('hidden');
    appointmentsSection.classList.remove('hidden');
    tabAppointments.style.background = '#2a2a2a';
    tabLaptops.style.background = 'transparent';
    loadAppointments();
});

// Add Laptop Handler
addLaptopForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = addLaptopForm.querySelector('button');
    const statusMsg = document.getElementById('statusMessage');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Обработване...';

    statusMsg.style.display = 'block';
    statusMsg.style.color = '#fff';
    statusMsg.textContent = 'Обработване на снимката...';

    try {
        const model = document.getElementById('model').value;
        const price = document.getElementById('price').value;
        const description = document.getElementById('description').value;

        // Collect Structured Specs
        const specs = {
            cpu: document.getElementById('specCPU').value,
            ram: document.getElementById('specRAM').value,
            storage: document.getElementById('specStorage').value,
            display: document.getElementById('specDisplay').value,
            video: document.getElementById('specGPU').value,
            os: document.getElementById('specOS').value
        };

        const externalLink = document.getElementById('externalLink').value;
        const imageFiles = document.getElementById('imageFile').files; // Get FileList

        if (imageFiles.length === 0) throw new Error("Моля изберете поне една снимка!");

        // addLaptop now handles the image compression internally and array
        await addLaptop(model, price, description, specs, externalLink, imageFiles);

        statusMsg.style.color = 'green';
        statusMsg.textContent = 'Успешно записано!';

        addLaptopForm.reset();
        alert("Лаптопът е добавен успешно!");

        setTimeout(() => {
            statusMsg.style.display = 'none';
        }, 3000);

        loadProducts(); // Refresh list
    } catch (error) {
        statusMsg.style.color = 'red';
        statusMsg.textContent = "Грешка: " + error.message;
        console.error(error);
        alert("Грешка: " + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Добави Лаптоп';
    }
});

// Load and Display Products
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
            <button class="btn" style="background: #d9534f;" onclick="window.removeLaptop('${laptop.id}')">Изтрий</button>
        `;
        productList.appendChild(div);
    });
}

// Load and Display Appointments
async function loadAppointments() {
    if (!appointmentsList) return;

    appointmentsList.innerHTML = '<tr><td colspan="7">Зареждане...</td></tr>';
    const appointments = await getAppointments();
    appointmentsList.innerHTML = '';

    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<tr><td colspan="7">Няма намерени заявки.</td></tr>';
        return;
    }

    appointments.forEach(app => {
        const date = new Date(app.createdAt.seconds * 1000).toLocaleString('bg-BG');
        const statusColor = app.status === 'done' ? 'green' : (app.status === 'in-progress' ? 'orange' : 'white');

        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #333';
        tr.innerHTML = `
            <td style="padding: 10px;">${date}</td>
            <td style="padding: 10px;">${app.name || '-'}</td>
            <td style="padding: 10px;">${app.phone || '-'}</td>
            <td style="padding: 10px;">${app.service || '-'}</td>
            <td style="padding: 10px;">${app.issue || '-'}</td>
            <td style="padding: 10px; color: ${statusColor};">${app.status}</td>
            <td style="padding: 10px;">
                <button class="btn" style="padding: 5px 10px; font-size: 12px; background: green;" onclick="window.completeApp('${app.id}')">Готово</button>
                <button class="btn" style="padding: 5px 10px; font-size: 12px; background: #d9534f;" onclick="window.deleteApp('${app.id}')">Изтрий</button>
            </td>
        `;
        appointmentsList.appendChild(tr);
    });
}

// Global Functions for Actions
window.removeLaptop = async (id) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този лаптоп?')) {
        await deleteLaptop(id);
        loadProducts();
    }
};

window.completeApp = async (id) => {
    await updateAppointmentStatus(id, 'done');
    loadAppointments();
};

window.deleteApp = async (id) => {
    if (confirm('Сигурни ли сте, че искате да изтриете тази заявка?')) {
        await deleteAppointment(id);
        loadAppointments();
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
