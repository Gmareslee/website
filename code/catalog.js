// --- DECAP CMS ÜRÜNLERİNİ DİNAMİK YÜKLEME VE LIGHTBOX SCRIPTİ ---
document.addEventListener("DOMContentLoaded", async () => {
    const galleryGrid = document.querySelector(".gallery-grid");
    if (!galleryGrid) return;

    const repoOwner = "Gmareslee";
    const repoName = "website";
    const folderPath = "content/katalog";

    function parseFrontmatter(text) {
        const result = {};
        const lines = text.split('\n');
        let inFrontmatter = false;

        for (let line of lines) {
            line = line.trim();
            if (line === '---') {
                if (inFrontmatter) break;
                inFrontmatter = true;
                continue;
            }
            if (inFrontmatter && line.includes(':')) {
                const colonIndex = line.indexOf(':');
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.substring(1, value.length - 1);
                }
                result[key] = value;
            }
        }
        return result;
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folderPath}?t=${Date.now()}`);
        if (!response.ok) return;

        const files = await response.json();
        const mdFiles = files.filter(file => file.name.endsWith('.md'));

        for (const file of mdFiles) {
            const res = await fetch(file.download_url);
            const rawText = await res.text();
            const data = parseFrontmatter(rawText);

            if (!data.title) continue;

            const modelCard = document.createElement("div");
            modelCard.className = "model-item";

            const waText = encodeURIComponent(`Merhaba, sitenizdeki ${data.title} hakkında bilgi almak istiyorum.`);
            const waUrl = `https://wa.me/905315534189?text=${waText}`;

            let imageSrc = data.image || '';
            if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
                imageSrc = data.image;
            } else {
                imageSrc = imageSrc.replace(/^(\/code\/|\/|\/images\/)/, '');
                imageSrc = `../${imageSrc}`;
            }

            modelCard.innerHTML = `
                <div class="model-media" style="cursor: pointer;">
                    <img src="${imageSrc}" alt="${data.title}">
                    <span class="model-badge">YENİ</span>
                </div>
                <div class="model-info">
                    <h3 class="model-title">${data.title}</h3>
                    <p class="model-fabric"><i class="fa-solid fa-layer-group"></i> %100 Pamuklu Kumaş</p>
                    <p class="model-desc">${data.description || ''}</p>
                    <a href="${waUrl}" class="model-order-btn" target="_blank" rel="noopener">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp ile Sipariş Et
                    </a>
                </div>
            `;

            galleryGrid.prepend(modelCard);
        }

        // --- DINAMIK YÜKLENEN RESIMLERE TIKLAMA (LIGHTBOX) DESTEGI EKLENIYOR ---
        setupDynamicLightbox();

    } catch (err) {
        console.error("Katalog çekilirken hata oluştu:", err);
    }
});

function setupDynamicLightbox() {
    // Sayfadaki tüm model görsellerini al
    const images = document.querySelectorAll('.model-media img');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');

    if (!modal || !modalImg) return;

    let currentIndex = 0;

    function openModal(index) {
        currentIndex = index;
        const targetImg = images[currentIndex];
        if (targetImg) {
            modalImg.src = targetImg.src;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    images.forEach((img, index) => {
        // Zaten dinleyicisi varsa tekrar eklemeyelim
        const parent = img.closest('.model-media');
        if (parent && !parent.dataset.lightboxActive) {
            parent.dataset.lightboxActive = "true";
            parent.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(index);
            });
        }
    });
}
