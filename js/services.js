import { translations, getLang } from './translations.js';

export function initServices() {
    const serviceCards = document.querySelectorAll('.service-card');
    const modal = document.getElementById('service-modal');
    const closeModalBtn = modal.querySelector('.close-modal');

    // Open Modal
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceKey = card.getAttribute('data-service');
            if (serviceKey) {
                openServiceModal(serviceKey);
            }
        });
    });

    // Close Modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on Esc key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

function openServiceModal(serviceKey) {
    const lang = getLang();
    const t = translations[lang];
    const serviceData = t.services[serviceKey];
    const modal = document.getElementById('service-modal');

    if (!serviceData) {
        console.error(`Service data not found for key: ${serviceKey}`);
        return;
    }

    // Populate Modal
    modal.querySelector('.modal-title').textContent = serviceData.title;
    modal.querySelector('.modal-desc').textContent = serviceData.details || serviceData.text;

    // Populate Includes
    const includesList = modal.querySelector('.modal-includes-list');
    includesList.innerHTML = '';
    if (serviceData.includes && serviceData.includes.length > 0) {
        serviceData.includes.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            includesList.appendChild(li);
        });
        modal.querySelector('.modal-includes').style.display = 'block';
    } else {
        modal.querySelector('.modal-includes').style.display = 'none';
    }

    // Populate Process
    const processText = modal.querySelector('.modal-process-text');
    if (serviceData.process) {
        processText.textContent = serviceData.process;
        modal.querySelector('.modal-process').style.display = 'block';
    } else {
        modal.querySelector('.modal-process').style.display = 'none';
    }

    // Show Modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}
