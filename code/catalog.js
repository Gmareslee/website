// --- DECAP CMS DİNAMİK KATALOG VE LIGHTBOX GRID FIXED SCRİPTİ ---
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

            // Orijinal kart kapsayıcısı
            const modelCard = document.createElement("article");
            modelCard.className = "model-item result-card"; 

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
                  <img src="/images/${imageSrc}" ...>  alt="${data.title}" loading="lazy">
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

        // Lightbox sistemini yeniden bağla ve boyutlandırmayı düzelt
        initCustomLightbox();

    } catch (err) {
        console.error("Katalog çekilirken hata oluştu:", err);
    }
});

function initCustomLightbox() {
    const allImages = Array.from(document.querySelectorAll('.gallery-grid img'));
    let lightbox = document.querySelector('.image-lightbox');

    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Kapat">&times;</button><button class="lightbox-prev" type="button" aria-label="Önceki fotoğraf">&#10094;</button><img alt=""><button class="lightbox-next" type="button" aria-label="Sonraki fotoğraf">&#10095;</button>';
        document.body.appendChild(lightbox);
    }

    // Lightbox stilini doğrudan zorla uygulayarak resmi ekranda devasa boyuta getiriyoruz
    lightbox.style.display = 'none';
    lightbox.style.alignItems = 'center';
    lightbox.style.justifyContent = 'center';

    const lightboxImage = lightbox.querySelector('img');
    if (lightboxImage) {
        lightboxImage.style.maxWidth = '85vw';
        lightboxImage.style.maxHeight = '85vh';
        lightboxImage.style.width = 'auto';
        lightboxImage.style.height = 'auto';
        lightboxImage.style.objectFit = 'contain';
        lightboxImage.style.borderRadius = '8px';
        lightboxImage.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    }

    let currentIndex = 0;

    const showImage = (index) => {
        currentIndex = (index + allImages.length) % allImages.length;
        const targetImg = allImages[currentIndex];
        if (targetImg && lightboxImage) {
            lightboxImage.src = targetImg.src;
            lightboxImage.alt = targetImg.alt || 'Model Resim';
        }
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.style.display = 'none';
    };

    allImages.forEach((img, idx) => {
        const cardMedia = img.closest('.model-media') || img;
        cardMedia.onclick = (e) => {
            e.stopPropagation();
            showImage(idx);
            lightbox.classList.add('open');
            lightbox.style.display = 'flex';
        };
    });

    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    if (closeBtn) closeBtn.onclick = closeLightbox;
    if (prevBtn) prevBtn.onclick = (e) => { e.stopPropagation(); showImage(currentIndex - 1); };
    if (nextBtn) nextBtn.onclick = (e) => { e.stopPropagation(); showImage(currentIndex + 1); };

    lightbox.onclick = (event) => {
        if (event.target === lightbox) closeLightbox();
    };
}
