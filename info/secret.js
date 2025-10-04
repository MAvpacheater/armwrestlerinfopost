// Secret Pets Module - UPDATED WITH MULTILINGUAL SUPPORT

// Language management
let secretCurrentLanguage = 'en';
let secretTranslations = null;
let secretInitialized = false;
let currentSecretType = 'rewards';

// Image URLs for rewards (consistent across languages)
const rewardImages = [
    "https://i.postimg.cc/QM43hkV6/2025-09-09-17-03-52.png",
    "https://i.postimg.cc/GmRrQmZj/2025-09-09-17-05-23.png",
    "https://i.postimg.cc/QM43hkV6/2025-09-09-17-03-52.png",
    "https://i.postimg.cc/GmRrQmZj/2025-09-09-17-05-23.png",
    "https://i.postimg.cc/QM43hkV6/2025-09-09-17-03-52.png"
];

// Image URLs for pets (consistent across languages)
const petImages = [
    "https://i.postimg.cc/CK6WWh6X/2025-09-09-17-06-19.png", // Arcane Hydra
    "https://i.postimg.cc/vZXRtL7Q/2025-09-09-17-06-10.png", // Hatched Phoenix
    "https://i.postimg.cc/N003J9bR/2025-09-09-17-06-14.png", // Voidwalker
    "https://i.postimg.cc/Jz1BLnVT/2025-09-09-17-06-33.png", // Stardust Dragon
    "https://i.postimg.cc/FRd2vMMR/2025-09-09-17-06-29.png", // Nebula Fantom
    "https://i.postimg.cc/2jBDNWYw/2025-09-09-17-05-57.png", // Flaming Beast
    "https://i.postimg.cc/nhnbmwDR/2025-09-09-17-06-05.png", // Magic Dominus
    "https://i.postimg.cc/qqnVsPwY/2025-09-09-17-05-54.png", // Sparkly Penguin
    "https://i.postimg.cc/Ghw1Lph1/2025-09-09-17-06-01.png", // Totem Dominus
    "https://i.postimg.cc/4djRhf6V/2025-09-09-17-05-49.png", // Kingdom Hydra
    "https://i.postimg.cc/857V5J6T/2025-09-09-17-05-40.png", // Sapphire Cat
    "https://i.postimg.cc/RFk2ZPmT/2025-09-09-17-06-24.png", // Heavenly Secret
    "", // ??? - no image
    "", // Halloween Secret - no image
    ""  // Mega American Serpent - no image
];

// Get language from localStorage or default to English
function getCurrentLanguage() {
    const saved = localStorage.getItem('armHelper_language');
    return saved || 'en';
}

// Load translations from JSON file
async function loadSecretTranslations() {
    if (secretTranslations) return secretTranslations;
    
    try {
        console.log('📥 Loading secret translations...');
        const response = await fetch('info/secret.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        secretTranslations = await response.json();
        console.log('✅ Secret translations loaded successfully');
        return secretTranslations;
    } catch (error) {
        console.error('❌ Error loading secret translations:', error);
        // Fallback to English if translations fail to load
        secretTranslations = {
            en: {
                title: "Secret Pets",
                loading: "Loading secret pets...",
                error: "Error loading secret pets data",
                retry: "Retry",
                switcher: {
                    rewards: "Rewards",
                    names: "Names"
                },
                rewards: [
                    { hatch: 1, reward: "+1 egg hatch" },
                    { hatch: 3, reward: "+1 equip" },
                    { hatch: 5, reward: "+1 egg hatch" },
                    { hatch: 9, reward: "+1 equip" },
                    { hatch: 12, reward: "+1 egg hatch" }
                ],
                pets: [
                    { name: "Arcane Hydra", boosts: "Percentage 150% | Power 40m", world: "World 4" },
                    { name: "Hatched Phoenix", boosts: "Percentage 160% | Power 50m", world: "World 5" },
                    { name: "Voidwalker", boosts: "Percentage 170% | Power 78,5m", world: "World 6" },
                    { name: "Stardust Dragon", boosts: "Percentage 180% | Power 115m", world: "World 7" },
                    { name: "Nebula Fantom", boosts: "Percentage 190% | Power 160m", world: "World 8" },
                    { name: "Flaming Beast", boosts: "Percentage 200% | Power 215m", world: "World 9" },
                    { name: "Magic Dominus", boosts: "Percentage 210% | Power 240m", world: "World 10" },
                    { name: "Sparkly Penguin", boosts: "Percentage 215% | Power 275m", world: "World 11" },
                    { name: "Totem Dominus", boosts: "Percentage 220% | Power 300m", world: "World 12" },
                    { name: "Kingdom Hydra", boosts: "Percentage 225% | Power 340m", world: "World 13" },
                    { name: "Sapphire Cat", boosts: "Percentage 230% | Power 385m", world: "World 14" },
                    { name: "Heavenly Secret", boosts: "Percentage 240% | Power 425m", world: "World 15" },
                    { name: "Mega Desert Snake", boosts: "Percentage 340% | Power 1.3b", world: "World 21" },
                    { name: "Halloween Secret", boosts: "Percentage 240% | Power 435m", world: "Halloween" },
                    { name: "Mega American Serpent", boosts: "Percentage 315% | Power 1.3b", world: "USA" }
                ],
                info: {
                    title: "Secret Pets Information",
                    worldsText: "You can hatch secrets pets on {worlds} worlds",
                    worldsHighlight: "4-15 and 21",
                    countText: "Rn on game {count} secret pets",
                    count: "15",
                    abilities: "Secret pets have unique abilities and special stats bonuses",
                    note: "P.S. I spent 1-2 days to knock out 1 secret (I had 5.5m lucky)"
                }
            }
        };
        return secretTranslations;
    }
}

// Update language when it changes globally
function updateSecretLanguage(newLanguage) {
    console.log(`🔮 Secret received language change request: ${secretCurrentLanguage} → ${newLanguage}`);
    
    if (newLanguage === secretCurrentLanguage) {
        console.log('🔄 Same language, skipping update');
        return;
    }
    
    secretCurrentLanguage = newLanguage;
    console.log(`🔮 Updating secret language to: ${newLanguage}`);
    
    // Reinitialize if already initialized
    if (secretInitialized) {
        secretInitialized = false;
        setTimeout(initializeSecret, 100);
    }
}

// Function to handle image loading errors
function handleImageError(img) {
    img.style.display = 'flex';
    img.style.alignItems = 'center';
    img.style.justifyContent = 'center';
    img.style.background = 'linear-gradient(135deg, #e2e8f0, #cbd5e0)';
    img.style.color = '#64748b';
    img.style.fontSize = '0.8em';
    img.style.fontWeight = '500';
    img.innerHTML = 'No Image';
    img.removeAttribute('src');
}

// Generate secret content
async function generateSecretContent() {
    const container = document.getElementById('secretContainer');
    if (!container) {
        console.error('❌ Secret container not found');
        return;
    }
    
    // Get current language
    secretCurrentLanguage = getCurrentLanguage();
    
    // Load translations if not already loaded
    if (!secretTranslations) {
        await loadSecretTranslations();
    }
    
    // Show loading state
    const loadingText = secretTranslations[secretCurrentLanguage]?.loading || 'Loading secret pets...';
    container.innerHTML = `<div class="secret-loading">${loadingText}</div>`;
    
    try {
        // Small delay to show loading animation
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const currentLangData = secretTranslations[secretCurrentLanguage];
        if (!currentLangData) {
            throw new Error(`Language data for ${secretCurrentLanguage} not found`);
        }
        
        // Generate hatch rewards grid for Rewards section
        const hatchRewardsHTML = currentLangData.rewards.map((item, index) => {
            const imageHTML = rewardImages[index] ? 
                `<img src="${rewardImages[index]}" alt="Hatch ${item.hatch} Reward" class="hatch-reward-image" onerror="handleImageError(this)">` :
                `<div class="hatch-reward-image" style="background: linear-gradient(135deg, #e2e8f0, #cbd5e0); display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.8em; font-weight: 500;">No Image</div>`;
            
            return `
                <div class="hatch-reward-card">
                    ${imageHTML}
                    <div class="hatch-reward-content">
                        <div class="hatch-number">Hatch ${item.hatch}</div>
                        <div class="hatch-reward">${item.reward}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Generate secret pets list for Names section
        const secretPetsHTML = currentLangData.pets.map((pet, index) => {
            const imageHTML = petImages[index] ? 
                `<img src="${petImages[index]}" alt="${pet.name}" class="secret-pet-image" onerror="handleImageError(this)">` :
                `<div class="secret-pet-image" style="background: linear-gradient(135deg, #e2e8f0, #cbd5e0); display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 0.8em; font-weight: 500;">No Image</div>`;
            
            return `
                <div class="secret-pet-item">
                    ${imageHTML}
                    <div class="secret-pet-content">
                        <div class="secret-pet-name">${pet.name}</div>
                        <div class="secret-pet-boosts">${pet.boosts}</div>
                    </div>
                    <div class="secret-pet-world">${pet.world}</div>
                </div>
            `;
        }).join('');

        // Process info text with placeholders
        const worldsText = currentLangData.info.worldsText.replace('{worlds}', `<span class="secret-worlds-highlight">${currentLangData.info.worldsHighlight}</span>`);
        const countText = currentLangData.info.countText.replace('{count}', `<span class="secret-count-highlight">${currentLangData.info.count}</span>`);

        // Create the complete secret pets content
        const fullHTML = `
            <!-- Secret Type Switcher -->
            <div class="secret-switcher">
                <button class="secret-switch-btn ${currentSecretType === 'rewards' ? 'active' : ''}" data-secret-type="rewards" onclick="switchSecretType('rewards')">${currentLangData.switcher.rewards}</button>
                <button class="secret-switch-btn ${currentSecretType === 'names' ? 'active' : ''}" data-secret-type="names" onclick="switchSecretType('names')">${currentLangData.switcher.names}</button>
            </div>
            
            <!-- Rewards Section -->
            <div class="secret-section ${currentSecretType === 'rewards' ? 'active' : ''}" id="rewardsSection">
                <div class="hatch-rewards-grid">
                    ${hatchRewardsHTML}
                </div>
                
                <div class="secret-image-container">
                    <img src="https://i.postimg.cc/MTvCfmFj/2025-09-08-13-11-34.jpg" 
                         alt="Secret Pets" 
                         class="secret-image"
                         loading="lazy">
                </div>
                
                <div class="secret-info">
                    <h3>${currentLangData.info.title}</h3>
                    <div class="secret-info-text">
                        ${worldsText}
                    </div>
                    <div class="secret-info-text">
                        ${countText}
                    </div>
                    <div class="secret-info-text">
                        ${currentLangData.info.abilities}
                    </div>
                    <div class="secret-info-text">
                        ${currentLangData.info.note}
                    </div>
                </div>
            </div>
            
            <!-- Names Section -->
            <div class="secret-section ${currentSecretType === 'names' ? 'active' : ''}" id="namesSection">
                ${secretPetsHTML}
            </div>
        `;

        container.innerHTML = fullHTML;
        console.log(`✅ Generated secret pets content in ${secretCurrentLanguage}`);
        
        // Add loading effect to main image
        const secretImage = container.querySelector('.secret-image');
        if (secretImage) {
            secretImage.addEventListener('load', function() {
                this.style.opacity = '1';
            });
            
            secretImage.addEventListener('error', function() {
                this.src = 'https://via.placeholder.com/500x317/667eea/ffffff?text=Secret+Pets';
                this.alt = 'Secret Pets Image';
            });
        }
        
    } catch (error) {
        console.error('❌ Error generating secret content:', error);
        
        // Show error state
        const errorText = secretTranslations[secretCurrentLanguage]?.error || 'Error loading secret pets data';
        const retryText = secretTranslations[secretCurrentLanguage]?.retry || 'Retry';
        
        container.innerHTML = `
            <div class="secret-error">
                ⚠️ ${errorText}
                <br>
                <button class="retry-btn" onclick="generateSecretContent()">${retryText}</button>
            </div>
        `;
    }
}

// Switch between secret types (rewards/names)
function switchSecretType(type) {
    console.log(`🔄 Switching secret type to: ${type}`);
    currentSecretType = type;
    
    // Update button states
    document.querySelectorAll('.secret-switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-secret-type="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.secret-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const activeSection = document.getElementById(`${type}Section`);
    if (activeSection) {
        activeSection.classList.add('active');
        console.log(`✅ Switched to section: ${type}Section`);
    } else {
        console.error(`❌ Section ${type}Section not found`);
    }
}

// Initialize secret pets page
async function initializeSecret() {
    console.log('🔮 Initializing Secret Pets...');
    
    const secretPage = document.getElementById('secretPage');
    if (!secretPage) {
        console.error('❌ Secret page not found');
        return;
    }
    
    // Check if already initialized
    if (secretInitialized && secretPage.querySelector('.secret-switcher')) {
        console.log('🔮 Secret already initialized with content');
        return;
    }
    
    // Get saved language
    secretCurrentLanguage = getCurrentLanguage();
    
    try {
        // Load translations
        await loadSecretTranslations();
        
        const data = secretTranslations[secretCurrentLanguage];
        if (!data) {
            throw new Error('Translation data not found');
        }
        
        // Create HTML structure
        secretPage.innerHTML = `
            <h1 class="title">${data.title}</h1>
            <div class="secret-container" id="secretContainer"></div>
        `;
        
        // Generate content
        await generateSecretContent();
        
        secretInitialized = true;
        window.secretInitialized = true;
        
        console.log('✅ Secret Pets page initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize secret pets:', error);
        secretPage.innerHTML = `
            <h1 class="title">Secret Pets</h1>
            <div class="secret-error">
                ⚠️ Failed to load secret pets data<br>
                <button class="retry-btn" onclick="initializeSecret()">Retry</button>
            </div>
        `;
    }
}

// Force reinitialize secret pets
function forceReinitializeSecret() {
    console.log('🔄 Force reinitializing secret pets...');
    secretInitialized = false;
    window.secretInitialized = false;
    initializeSecret();
}

// Debug function
function debugSecret() {
    console.log('=== SECRET PETS DEBUG ===');
    console.log('Initialized:', secretInitialized);
    console.log('Current language:', secretCurrentLanguage);
    console.log('Current type:', currentSecretType);
    console.log('Container exists:', !!document.getElementById('secretContainer'));
    console.log('Page exists:', !!document.getElementById('secretPage'));
    console.log('Page is active:', document.getElementById('secretPage')?.classList.contains('active'));
    console.log('Translations loaded:', !!secretTranslations);
    if (secretTranslations) {
        console.log('Available languages:', Object.keys(secretTranslations));
        if (secretTranslations[secretCurrentLanguage]) {
            console.log(`Rewards count for ${secretCurrentLanguage}:`, secretTranslations[secretCurrentLanguage].rewards?.length);
            console.log(`Pets count for ${secretCurrentLanguage}:`, secretTranslations[secretCurrentLanguage].pets?.length);
        }
    }
    const container = document.getElementById('secretContainer');
    if (container) {
        console.log('Container innerHTML length:', container.innerHTML.length);
        console.log('Has secret switcher:', !!container.querySelector('.secret-switcher'));
        console.log('Has reward cards:', !!container.querySelector('.hatch-reward-card'));
        console.log('Has pet items:', !!container.querySelector('.secret-pet-item'));
    }
    console.log('==========================');
}

// Listen for global language changes
document.addEventListener('languageChanged', function(e) {
    console.log('🔮 Secret received languageChanged event:', e.detail);
    if (e.detail && e.detail.language) {
        updateSecretLanguage(e.detail.language);
    }
});

// Enhanced DOM ready handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔮 DOM loaded, setting up secret pets...');
    
    // Initialize immediately if secret page is already active
    setTimeout(() => {
        const secretPage = document.getElementById('secretPage');
        if (secretPage && secretPage.classList.contains('active')) {
            console.log('🔮 Secret page is active, initializing...');
            initializeSecret();
        }
    }, 100);
});

// Enhanced click handler for secret page switching
document.addEventListener('click', function(e) {
    if (e.target && e.target.getAttribute && e.target.getAttribute('data-page') === 'secret') {
        console.log('🔮 Secret page clicked, will initialize...');
        setTimeout(() => {
            const secretPage = document.getElementById('secretPage');
            if (!secretInitialized || !secretPage || !secretPage.querySelector('.secret-switcher')) {
                console.log('🔮 Page switched to secret, initializing...');
                initializeSecret();
            } else {
                console.log('🔮 Secret already has content, skipping initialization');
            }
        }, 300);
    }
});

// Make functions globally available
window.initializeSecret = initializeSecret;
window.updateSecretLanguage = updateSecretLanguage;
window.switchSecretType = switchSecretType;
window.handleImageError = handleImageError;
window.generateSecretContent = generateSecretContent;
window.debugSecret = debugSecret;
window.forceReinitializeSecret = forceReinitializeSecret;
window.secretInitialized = secretInitialized;

console.log('✅ Fixed secret.js loaded with enhanced multilingual support');
