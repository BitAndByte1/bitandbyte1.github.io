import { translations } from './translations.js';
import { getLang } from './lang.js';

export function initPrices() {
    renderPrices(getLang());

    document.addEventListener('language-changed', (e) => {
        renderPrices(e.detail.lang);
    });
}

function renderPrices(lang) {
    const container = document.getElementById('prices-container');
    if (!container) return;

    const t = translations[lang];
    if (!t || !t.prices_page || !t.prices_page.items || !t.prices_page.items.categories) {
        console.error('Price data is missing for language:', lang);
        return;
    }

    const categories = t.prices_page.items.categories;
    container.innerHTML = ''; // Clear existing

    // Order: cleaning, hardware, software, data
    const order = ['cleaning', 'hardware', 'software', 'data'];

    order.forEach(key => {
        const cat = categories[key];
        if (!cat) return;

        const section = document.createElement('div');
        section.className = 'price-section';

        const title = document.createElement('h3');
        title.className = 'price-category-title';
        title.innerHTML = `<i class="fas fa-caret-right text-accent"></i> ${cat.title}`;
        section.appendChild(title);

        const table = document.createElement('table');
        table.className = 'price-table';

        const tbody = document.createElement('tbody');
        cat.list.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="price-name">${item.name}</td>
                <td class="price-val">${item.price}</td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        section.appendChild(table);

        container.appendChild(section);
    });
}
