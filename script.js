// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add active link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Search content on the page
const searchForm = document.getElementById('searchForm');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-btn');
const searchableItems = document.querySelectorAll('.result-card, .model-item');
const noResultsMessage = document.querySelector('.no-results');
const searchPages = [
    { terms: ['ana sayfa', 'anasayfa', 'tekstil', 'kumas', 'kumaş'], href: 'index.html' },
    { terms: ['iletisim', 'iletişim', 'telefon', 'adres'], href: 'contact.html' },
    { terms: ['galeri', 'fotoğraf', 'fotograf', 'görsel', 'gorsel'], href: 'models.html' },
    { terms: ['model', 'modeller', 'gömlek', 'gomlek'], href: 'models.html' },
    { terms: ['marka', 'markalar'], href: 'brands.html' }
];

let searchFeedback = null;

if (searchForm) {
    searchFeedback = document.createElement('div');
    searchFeedback.className = 'search-feedback';
    searchFeedback.setAttribute('role', 'status');
    searchForm.appendChild(searchFeedback);
}

function runSearch() {
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    let anyMatch = false;

    searchableItems.forEach(item => {
        const text = (item.textContent || '').toLowerCase();
        const match = !query || text.includes(query);
        item.style.display = match ? '' : 'none';
        if (match) anyMatch = true;
    });

    if (noResultsMessage) {
        const showNoResults = query.length > 0 && !anyMatch;
        noResultsMessage.style.display = showNoResults ? 'block' : 'none';
        noResultsMessage.hidden = false;
    }
}

function searchSite() {
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const targetPage = searchPages.find(page => page.terms.some(term => query.includes(term)));

    if (targetPage) {
        window.location.href = targetPage.href;
        return;
    }

    if (searchFeedback) {
        searchFeedback.textContent = 'Aradığınız kelime bulunamadı.';
        searchFeedback.classList.add('visible');
    }
}

if (searchInput) {
    searchInput.value = '';
    runSearch();

    searchInput.addEventListener('input', runSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchSite();
        }
    });
}

if (searchForm) {
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        searchSite();
        if (searchInput) searchInput.focus();
    });
}

if (searchButton) {
    searchButton.addEventListener('click', (event) => {
        event.preventDefault();
        searchSite();
        if (searchInput) searchInput.focus();
    });
}

// Shared appearance and language controls.
const navbarContainer = document.querySelector('.navbar-container');

if (navbarContainer) {
    const controls = document.createElement('div');
    controls.className = 'site-controls';
    controls.innerHTML = '<button class="theme-toggle" type="button" aria-label="Tema değiştir"></button><button class="language-toggle" type="button" aria-label="Dili değiştir">EN</button>';
    navbarContainer.appendChild(controls);

    const themeToggle = controls.querySelector('.theme-toggle');
    const languageToggle = controls.querySelector('.language-toggle');
    const savedTheme = localStorage.getItem('karvel-theme');
    const savedLanguage = localStorage.getItem('karvel-language') || 'tr';

    const updateThemeButton = () => {
        const darkMode = document.body.classList.contains('dark-mode');
        themeToggle.textContent = darkMode ? '☀' : '☾';
        themeToggle.title = darkMode ? 'Gündüz modu' : 'Gece modu';
    };

    const translations = {
        nav: {
            tr: ['Anasayfa', 'Hakkımızda', 'İletişim', 'Modeller', 'Markalar'],
            en: ['Home', 'About us', 'Contact', 'Models', 'Brands']
        },
        footer: {
            tr: ['Anasayfa', 'Hakkımızda', 'Modeller', 'İletişim', 'Demo Paneli'],
            en: ['Home', 'About us', 'Models', 'Contact', 'Demo Panel']
        }
    };

    const setLanguage = language => {
        const navLabels = document.querySelectorAll('.nav-link span:last-child');
        const footerLabels = document.querySelectorAll('.footer-links a');
        const navText = translations.nav[language];
        const footerText = translations.footer[language];

        navLabels.forEach((label, index) => {
            if (navText[index]) label.textContent = navText[index];
        });
        footerLabels.forEach((label, index) => {
            if (footerText[index]) label.textContent = footerText[index];
        });

        const input = document.querySelector('.search-input');
        if (input) input.placeholder = language === 'en' ? 'Type a word to search...' : 'Aramak istediğiniz kelimeyi yazınız...';

        const heroTitle = document.querySelector('.slider-content h1');
        const heroText = document.querySelector('.slider-content p:last-child');
        if (heroTitle) heroTitle.textContent = language === 'en' ? 'Wholesale and contract production' : 'Toptan imalat ve fason üretim';
        if (heroText) heroText.textContent = language === 'en' ? 'Contact us for wholesale and contract production.' : 'Toptan ve fason üretim için bizimle iletişime geçin.';

        const homeCards = document.querySelectorAll('.home-info .result-card');
        const homeCardText = language === 'en'
            ? [['Models', 'Browse examples of shirts and textile products.', 'See models'], ['Production', 'We provide wholesale and contract production.', 'About us'], ['Contact', 'You can contact us for product and production details.', 'Contact us']]
            : [['Modeller', 'Gömlek ve tekstil ürünlerinden bazı örnekleri inceleyebilirsiniz.', 'Modellere bak'], ['Üretim', 'Toptan imalat ve fason üretim yapıyoruz.', 'Hakkımızda'], ['İletişim', 'Ürün ve üretim bilgileri için bize ulaşabilirsiniz.', 'Bize ulaşın']];
        homeCards.forEach((card, index) => {
            const content = homeCardText[index];
            if (!content) return;
            card.querySelector('h2').textContent = content[0];
            card.querySelector('p').textContent = content[1];
            card.querySelector('a').childNodes[0].textContent = `${content[2]} `;
        });

        const aboutIntro = document.querySelector('.about-intro > p:last-child');
        if (aboutIntro) aboutIntro.textContent = language === 'en' ? 'We provide wholesale, contract, and garment production.' : 'Toptan imalat, fason üretim ve giyim üretimi yapıyoruz.';

        const modelIntro = document.querySelector('.gallery-heading > p:last-child');
        if (modelIntro) modelIntro.textContent = language === 'en' ? 'Examples of shirts and textile models.' : 'Gömlek ve tekstil modellerinden örnekler.';

        const title = document.querySelector('#about-title, .contact-card-heading h1, .gallery-heading h1');
        if (title && language === 'en') {
            if (title.id === 'about-title') title.textContent = 'About KARVEL TEKSTİL';
            if (title.closest('.contact-card')) title.textContent = 'Contact';
            if (title.closest('.image-gallery')) title.textContent = 'Models';
        }

        document.documentElement.lang = language;
        languageToggle.textContent = language === 'en' ? 'TR' : 'EN';
        localStorage.setItem('karvel-language', language);
    };

    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
    updateThemeButton();
    setLanguage(savedLanguage);

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('karvel-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        updateThemeButton();
    });

    languageToggle.addEventListener('click', () => {
        const nextLanguage = document.documentElement.lang === 'en' ? 'tr' : 'en';
        setLanguage(nextLanguage);
    });
}

// WhatsApp Siparis Butonu - Statik HTML'de yoksa dinamik bagla
document.querySelectorAll('.model-item').forEach((model, index) => {
    // Zaten HTML icinde .model-order-btn varsa tekrar ekleme
    if (model.querySelector('.model-order-btn')) return;

    const image = model.querySelector('img');
    const titleEl = model.querySelector('.model-title, figcaption');
    const modelName = (titleEl ? titleEl.textContent.trim() : '') || (image ? image.alt : '') || `Model ${index + 1}`;

    const orderButton = document.createElement('a');
    orderButton.className = 'model-order-btn';
    orderButton.target = '_blank';
    orderButton.rel = 'noopener';

    const orderText = `Merhaba, sitenizdeki ${modelName} hakkında sipariş vermek / bilgi almak istiyorum.`;
    const whatsappUrl = `https://wa.me/905315534189?text=${encodeURIComponent(orderText)}`;
    orderButton.href = whatsappUrl;

    orderButton.innerHTML = '<i class="fa-brands fa-whatsapp"></i> WhatsApp ile Sipariş Et';
    orderButton.addEventListener('click', event => {
        event.stopPropagation();
    });

    const info = model.querySelector('.model-info') || model;
    info.appendChild(orderButton);
});

const galleryImages = document.querySelectorAll('.gallery-grid img');

if (galleryImages.length) {
    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Kapat">&times;</button><button class="lightbox-prev" type="button" aria-label="Önceki fotoğraf">&#10094;</button><img alt=""><button class="lightbox-next" type="button" aria-label="Sonraki fotoğraf">&#10095;</button>';
    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('img');
    let currentImageIndex = 0;

    const showImage = index => {
        currentImageIndex = (index + galleryImages.length) % galleryImages.length;
        const image = galleryImages[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
    };

    const closeLightbox = () => lightbox.classList.remove('open');

    galleryImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            showImage(index);
            lightbox.classList.add('open');
        });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentImageIndex - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentImageIndex + 1));
    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') showImage(currentImageIndex - 1);
        if (event.key === 'ArrowRight') showImage(currentImageIndex + 1);
    });
}

