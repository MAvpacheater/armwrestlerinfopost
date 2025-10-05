// Оптимізована версія Trader
let traderInitialized = false;
let isEditMode = false;
let traderData = null;
let itemImages = {};
let pageBackground = null; // Зберігаємо фонове зображення
let currentLang = 'en';
let isTraderVisible = false;

// Кешування DOM елементів
const traderCache = {
    page: null,
    lastRender: 0,
    renderDelay: 100 // мінімальний час між рендерами
};

async function loadTraderJSON() {
    if (traderData) return traderData; // Повертаємо кеш
    
    try {
        const response = await fetch('other/sell.json');
        traderData = await response.json();
        return traderData;
    } catch (error) {
        console.error('Error loading trader data:', error);
        return null;
    }
}

async function initializeTrader() {
    if (traderInitialized) {
        console.log('⚠️ Trader already initialized, re-rendering...');
        currentLang = getCurrentAppLanguage?.() || 'en';
        renderTraderStore(currentLang);
        return;
    }

    traderCache.page = document.getElementById('traderPage');
    if (!traderCache.page) {
        console.error('❌ Trader page not found');
        return;
    }

    console.log('🚀 Initializing Trader...');
    await loadTraderJSON();
    
    currentLang = getCurrentAppLanguage?.() || 'en';
    
    // Перевіряємо чи сторінка видима зараз
    const isVisible = traderCache.page.offsetParent !== null;
    console.log('👁️ Trader page visible:', isVisible);
    
    if (isVisible) {
        // Якщо видима - рендеримо одразу
        renderTraderStore(currentLang);
        isTraderVisible = true;
    }
    
    // Рендеримо тільки якщо сторінка видима
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isTraderVisible = entry.isIntersecting;
            console.log('🔄 Trader visibility changed:', isTraderVisible);
            
            if (isTraderVisible && !traderCache.page.innerHTML) {
                renderTraderStore(currentLang);
            }
        });
    });
    
    observer.observe(traderCache.page);
    
    traderInitialized = true;
    console.log('✅ Trader initialized (optimized)');
}

function handleBackgroundUpload(event) {
    const file = event.target.files[0];
    if (!file || file.size > 10000000) { // Ліміт 10MB
        if (file?.size > 10000000) {
            alert('Image too large! Max 10MB');
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        pageBackground = e.target.result;
        applyPageBackground();
        console.log('🖼️ Page background uploaded');
    };
    reader.readAsDataURL(file);
}

function applyPageBackground() {
    if (!traderCache.page) return;
    
    if (pageBackground) {
        const style = traderCache.page.querySelector('style') || document.createElement('style');
        style.textContent = `
            #traderPage::before {
                background-image: url('${pageBackground}'), 
                    radial-gradient(circle at 20% 50%, rgba(255,100,0,0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 50%, rgba(138,43,226,0.08) 0%, transparent 50%) !important;
                background-blend-mode: overlay, normal, normal;
            }
        `;
        if (!traderCache.page.querySelector('style')) {
            traderCache.page.appendChild(style);
        }
        traderCache.page.classList.add('has-custom-bg');
    } else {
        const style = traderCache.page.querySelector('style');
        if (style) style.remove();
        traderCache.page.classList.remove('has-custom-bg');
    }
}

function removePageBackground() {
    pageBackground = null;
    applyPageBackground();
    console.log('🗑️ Page background removed');
}

function handleImageUpload(event, index, lang) {
    const file = event.target.files[0];
    if (!file || file.size > 5000000) { // Ліміт 5MB
        if (file?.size > 5000000) {
            alert('Image too large! Max 5MB');
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        itemImages[`${lang}-${index}`] = e.target.result;
        
        // Оновлюємо тільки одну картинку, а не весь рендер
        const imgContainer = document.querySelector(`[data-img-id="${lang}-${index}"]`);
        if (imgContainer) {
            imgContainer.innerHTML = `<img src="${e.target.result}" alt="Item ${index}">`;
        }
    };
    reader.readAsDataURL(file);
}

function renderTraderStore(lang = 'en') {
    // Throttling - не рендеримо частіше ніж раз на 100ms
    const now = Date.now();
    if (now - traderCache.lastRender < traderCache.renderDelay) {
        console.log('⏱️ Throttling render...');
        return;
    }
    traderCache.lastRender = now;

    if (!traderCache.page) {
        console.error('❌ Trader page not found in cache');
        return;
    }
    
    if (!traderData?.[lang]) {
        console.error(`❌ No trader data for language: ${lang}`);
        return;
    }

    console.log(`🎨 Rendering trader store for: ${lang}`);

    const data = traderData[lang];
    const items = data.items || [];
    
    // Використовуємо DocumentFragment для оптимізації
    const fragment = document.createDocumentFragment();
    const container = document.createElement('div');
    
    container.innerHTML = `
        ${!isEditMode ? `
            <button class="trader-settings-btn" onclick="toggleTraderEdit('${lang}')" title="${data.editButton}">⚙️</button>
        ` : `
            <label for="trader-bg-upload" class="trader-bg-btn" title="Upload Background">🖼️</label>
            <input type="file" id="trader-bg-upload" class="trader-bg-input" accept="image/*" onchange="handleBackgroundUpload(event)">
        `}
        
        <div class="trader-header">
            ${isEditMode ? `
                <input type="text" class="edit-title" value="${data.title}" data-lang="${lang}" data-field="title">
                <input type="text" class="edit-subtitle" value="${data.subtitle}" data-lang="${lang}" data-field="subtitle">
            ` : `
                <h1 class="trader-title">${data.title}</h1>
                <div class="trader-subtitle">${data.subtitle}</div>
            `}
        </div>
        
        ${isEditMode ? `
            <div style="text-align: center; margin: 20px 0;">
                <button onclick="saveTraderChanges('${lang}')" class="trader-btn trader-btn-save">${data.saveButton}</button>
                <button onclick="cancelTraderEdit('${lang}')" class="trader-btn trader-btn-cancel">${data.cancelButton}</button>
                ${pageBackground ? `<button onclick="removePageBackground()" class="trader-btn" style="background: linear-gradient(135deg, #666, #444); border-color: #666;">🗑️ Remove Background</button>` : ''}
            </div>
        ` : ''}
        
        <div class="trader-container">
            ${items.map((item, index) => createItemCard(item, index, lang, data, isEditMode)).join('')}
        </div>
    `;
    
    fragment.appendChild(container);
    
    // Очищаємо і вставляємо за один раз
    traderCache.page.innerHTML = '';
    traderCache.page.appendChild(fragment.firstChild);
    
    // Застосовуємо фон після рендеру
    applyPageBackground();
    
    console.log('✅ Trader store rendered');
}

// Винесли створення карток в окрему функцію
function createItemCard(item, index, lang, data, editMode) {
    const imageKey = `${lang}-${index}`;
    const hasImage = itemImages[imageKey];
    
    return `
        <div class="trader-card">
            <div class="trader-image-container" data-img-id="${imageKey}">
                ${editMode ? `
                    <label class="trader-upload-area" for="file-${imageKey}">
                        ${hasImage ? `<img src="${itemImages[imageKey]}" alt="${item.name}">` : `
                            <div class="upload-icon">📸</div>
                            <div class="upload-text">Click</div>
                        `}
                    </label>
                    <input type="file" id="file-${imageKey}" class="trader-file-input" accept="image/*" onchange="handleImageUpload(event, ${index}, '${lang}')">
                ` : hasImage ? `
                    <img src="${itemImages[imageKey]}" alt="${item.name}">
                ` : `
                    <div class="trader-image-placeholder">${item.icon || '🎃'}</div>
                `}
            </div>
            
            <div class="trader-card-body">
                ${editMode ? `
                    <input type="text" class="edit-name" value="${item.name || ''}" data-lang="${lang}" data-index="${index}" data-field="name">
                ` : `
                    <div class="trader-name">${item.name || ''}</div>
                `}
                
                <div class="trader-price">
                    <span class="price-label">${data.priceLabel}</span>
                    ${editMode ? `
                        <input type="text" class="edit-price" value="${item.price || ''}" data-lang="${lang}" data-index="${index}" data-field="price">
                    ` : `
                        <span class="price-value">${item.price || ''}</span>
                    `}
                </div>
                
                ${editMode ? `
                    <input type="text" class="edit-quantity" value="${item.quantity || ''}" data-lang="${lang}" data-index="${index}" data-field="quantity">
                ` : `
                    <div class="trader-quantity">${item.quantity || ''}</div>
                `}
            </div>
        </div>
    `;
}

function toggleTraderEdit(lang) {
    isEditMode = !isEditMode;
    renderTraderStore(lang);
}

function saveTraderChanges(lang) {
    const inputs = document.querySelectorAll('[data-lang]');
    
    // Батч апдейт
    const updates = {};
    
    inputs.forEach(input => {
        const field = input.dataset.field;
        const index = input.dataset.index;
        const value = input.value.trim();
        
        if (index !== undefined) {
            const idx = parseInt(index);
            if (!updates[idx]) updates[idx] = {};
            updates[idx][field] = value;
        } else {
            if (!updates.global) updates.global = {};
            updates.global[field] = value;
        }
    });
    
    // Застосовуємо всі зміни разом
    Object.keys(updates).forEach(key => {
        if (key === 'global') {
            Object.assign(traderData[lang], updates.global);
        } else {
            const idx = parseInt(key);
            if (!traderData[lang].items[idx]) {
                traderData[lang].items[idx] = {};
            }
            Object.assign(traderData[lang].items[idx], updates[key]);
        }
    });
    
    isEditMode = false;
    renderTraderStore(lang);
}

function cancelTraderEdit(lang) {
    isEditMode = false;
    renderTraderStore(lang);
}

function updateTraderLanguage(lang) {
    console.log('🌍 Updating trader language to:', lang);
    currentLang = lang;
    
    // Завжди рендеримо при зміні мови, якщо сторінка активна
    const traderPage = document.getElementById('traderPage');
    const isActive = traderPage?.classList.contains('active');
    
    console.log('📄 Trader page active:', isActive);
    
    if (isActive || isTraderVisible) {
        renderTraderStore(lang);
    }
}

// Експорт функцій
window.initializeTrader = initializeTrader;
window.updateTraderLanguage = updateTraderLanguage;
window.toggleTraderEdit = toggleTraderEdit;
window.saveTraderChanges = saveTraderChanges;
window.cancelTraderEdit = cancelTraderEdit;
window.handleImageUpload = handleImageUpload;
window.handleBackgroundUpload = handleBackgroundUpload;
window.removePageBackground = removePageBackground;

// Слухач зміни мови з debounce
let langChangeTimeout;
document.addEventListener('languageChanged', (e) => {
    clearTimeout(langChangeTimeout);
    langChangeTimeout = setTimeout(() => {
        console.log('🔔 Language changed event received:', e.detail.language);
        updateTraderLanguage(e.detail.language);
    }, 150);
});

console.log('✅ Trader module loaded (optimized)');
