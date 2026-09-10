// 皮套页面自动渲染

async function loadCostumes() {
    try {
        const response = await fetch('data/costumes.json');
        const data = await response.json();
        renderCostumes(data.costumes);
        initLightbox();
    } catch (error) {
        console.error('加载皮套数据失败:', error);
    }
}

function renderCostumes(costumes) {
    const container = document.querySelector('.costumes-masonry');
    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    // 创建Intersection Observer用于懒加载
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const actualSrc = img.dataset.src;
                img.src = actualSrc;
                img.classList.remove('lazy');
                img.classList.add('lazy-loading');

                // 图片加载完成后移除loading类
                img.onload = function() {
                    img.classList.remove('lazy-loading');
                };

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '100px' // 提前100px开始加载
    });

    // 渲染皮套卡片
    costumes.forEach(costume => {
        const card = document.createElement('div');
        card.className = 'costume-card';

        // 判断图片是否存在，不存在则使用占位符
        const imagePath = `assets/images/costumes/${costume.image}`;
        const imageContent = costume.image
            ? `<img class="lazy" src="assets/images/signature.png" data-src="${imagePath}" alt="${costume.title}" data-lightbox="${imagePath}">`
            : `<span class="placeholder-icon">👗</span>`;

        const badgeHTML = costume.badge
            ? `<span class="costume-badge ${costume.badgeType}">${costume.badge}</span>`
            : '';

        const tagsHTML = costume.tags
            .map(tag => `<span class="tag">${tag}</span>`)
            .join('');

        card.innerHTML = `
            <div class="costume-card-image">
                <div class="image-placeholder">
                    ${imageContent}
                </div>
                ${badgeHTML}
            </div>
            <div class="costume-card-info">
                <h3 class="costume-card-title">${costume.title}</h3>
                <p class="costume-card-date">${costume.date}</p>
                <div class="costume-card-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;

        container.appendChild(card);

        // 观察懒加载图片
        if (costume.image) {
            const img = card.querySelector('img.lazy');
            if (img) {
                imageObserver.observe(img);
            }
        }
    });
}

// 图片灯箱功能
function initLightbox() {
    // 创建灯箱容器
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="关闭">×</button>
            <img src="" alt="">
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // 点击图片打开灯箱
    document.addEventListener('click', (e) => {
        const img = e.target.closest('[data-lightbox]');
        if (img) {
            const src = img.getAttribute('data-lightbox');
            lightboxImg.src = src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // 关闭灯箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// 页面加载时自动加载皮套
if (document.querySelector('.costumes-masonry')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCostumes);
    } else {
        loadCostumes();
    }
}
