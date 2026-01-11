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

    order.forEach((key, index) => {
        const cat = categories[key];
        if (!cat) return;

        // Create Section
        const section = document.createElement('section');
        // Alternating backgrounds: even -> bg-1 (#080808), odd -> bg-2 (#222)
        const bgClass = index % 2 === 0 ? 'section-bg-1' : 'section-bg-2';
        section.className = `price-section ${bgClass}`;

        // Create Container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'container';

        // Title
        const title = document.createElement('h3');
        title.className = 'price-category-title';
        title.innerHTML = `<i class="fas fa-caret-right text-accent"></i> ${cat.title}`;
        contentContainer.appendChild(title);

        // List
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
        contentContainer.appendChild(list);

        section.appendChild(contentContainer);
        container.appendChild(section);
    });
}
