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

        const card = document.createElement('div');
        card.className = 'price-card';

        const title = document.createElement('h3');
        title.className = 'price-category-title';
        title.innerHTML = `<i class="fas fa-caret-right text-accent"></i> ${cat.title}`;
        card.appendChild(title);

        const list = document.createElement('ul');
        list.className = 'price-list';

        cat.list.forEach(item => {
            const li = document.createElement('li');
            li.className = 'price-item';
            li.innerHTML = `
                <span class="price-name">${item.name}</span>
                <span class="price-val text-accent">${item.price}</span>
            `;
            list.appendChild(li);
        });
        card.appendChild(list);

        container.appendChild(card);
    });
}
