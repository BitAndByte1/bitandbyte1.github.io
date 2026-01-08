import { translations } from './translations.js';
export { translations };

let currentLang = localStorage.getItem('site_lang') || 'bg';

// Apply language on load
document.addEventListener('DOMContentLoaded', () => {
    updatePageLanguage();
    setupLanguageSwitcher();
});

export function getLang() {
    return currentLang;
}

export function setLang(lang) {
    if (lang !== 'bg' && lang !== 'en') return;
    currentLang = lang;
    localStorage.setItem('site_lang', lang);
    updatePageLanguage();
    document.dispatchEvent(new CustomEvent('language-changed', { detail: { lang } }));
}

function updatePageLanguage() {
    const t = translations[currentLang];

    // Update simple text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = getNestedTranslation(t, key);
        if (text) {
            // Check if it's HTML content (if key contains 'title' or special markers, usually safe here)
            // Ideally we use innerHTML for things with <br> or <span>
            if (el.innerHTML.includes('<') || text.includes('<')) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Update buttons state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active-lang');
            btn.style.fontWeight = 'bold';
            btn.style.textDecoration = 'underline';
        } else {
            btn.classList.remove('active-lang');
            btn.style.fontWeight = 'normal';
            btn.style.textDecoration = 'none';
        }
    });
}

function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

function setupLanguageSwitcher() {
    const switchers = document.querySelectorAll('.lang-switcher');

    // If no switcher exists in HTML, maybe inject one? 
    // For now, we assume HTML has buttons with class 'lang-btn' and data-lang="bg/en"

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('lang-btn')) {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            setLang(lang);
        }
    });
}
