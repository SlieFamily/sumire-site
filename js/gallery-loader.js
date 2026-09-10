// 画廊数据加载器
let galleryItems = [];
let columnCount = 3;

// 分类中英文映射
function getCategoryName(category) {
    const categoryMap = {
        'fanart': '插画',
        'emoji': '表情包',
        'comic': '漫画'
    };
    return categoryMap[category] || category;
}

async function loadGallery() {
    try {
        const response = await fetch('data/gallery.json');
        const data = await response.json();

        // 按日期倒序排列（最新的在前）
        galleryItems = data.gallery.sort((a, b) => {
            // 处理空日期，放到最后
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;

            // 将日期字符串转换为可比较的格式
            const dateA = parseDateString(a.date);
            const dateB = parseDateString(b.date);

            return dateB - dateA; // 倒序：新的在前
        });

        await renderGalleryItems(galleryItems);
        initGalleryLightbox();

        // 响应式列数调整
        updateColumnCount();
        window.addEventListener('resize', debounce(async () => {
            updateColumnCount();
            await renderGalleryItems(galleryItems);
            initGalleryLightbox();
        }, 250));
    } catch (error) {
        console.error('加载画廊数据失败:', error);
    }
}

// 解析日期字符串为时间戳
function parseDateString(dateStr) {
    if (!dateStr) return 0;

    // 处理 "2026.7.31" 或 "2026" 格式
    const parts = dateStr.split('.');
    if (parts.length === 3) {
        // 完整日期 "2026.7.31"
        return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
    } else if (parts.length === 1) {
        // 仅年份 "2026"
        return new Date(parts[0], 0, 1).getTime();
    }

    return 0;
}

function updateColumnCount() {
    const width = window.innerWidth;
    if (width <= 768) {
        columnCount = 1;
    } else if (width <= 1024) {
        columnCount = 2;
    } else {
        columnCount = 3;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function renderGalleryItems(items) {
    const container = document.querySelector('.gallery-grid');
    if (!container) return;

    container.innerHTML = '';

    // 创建列容器
    const columns = [];
    for (let i = 0; i < columnCount; i++) {
        const column = document.createElement('div');
        column.className = 'gallery-column';
        columns.push({ element: column, height: 0 });
        container.appendChild(column);
    }

    // 创建Intersection Observer用于懒加载
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('lazy-loading');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px' // 提前50px开始加载
    });

    // 为所有图片创建Promise，但使用懒加载
    const promises = items.map((item) => {
        return new Promise((resolve) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.dataset.category = item.category;
            card.dataset.id = item.id;
            card.dataset.title = item.title;
            card.dataset.description = item.description || '';
            card.dataset.author = item.author || '';
            card.dataset.date = item.date || '';
            // 存储漫画的多图数据
            if (item.images && item.images.length > 0) {
                card.dataset.images = JSON.stringify(item.images);
            }

            const img = document.createElement('img');
            img.className = 'gallery-card-image lazy';
            img.alt = item.title;
            img.dataset.src = `assets/images/gallery/${item.image}`; // 使用data-src而不是直接src

            // 使用占位图或者加载占位样式
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%238b7dc8" width="800" height="600"/%3E%3C/svg%3E';

            // 预加载图片获取尺寸
            const tempImg = new Image();
            tempImg.onload = function() {
                card.appendChild(img);

                // 找到最短的列
                const shortestColumn = columns.reduce((prev, curr) =>
                    prev.height < curr.height ? prev : curr
                );

                shortestColumn.element.appendChild(card);
                shortestColumn.height += tempImg.naturalHeight / tempImg.naturalWidth;

                // 开始观察这个图片
                imageObserver.observe(img);

                resolve();
            };

            tempImg.onerror = function() {
                console.error(`图片加载失败: ${item.image}`);
                resolve();
            };

            tempImg.src = `assets/images/gallery/${item.image}`;
        });
    });

    await Promise.all(promises);
}

// 灯箱功能
function initGalleryLightbox() {
    const cards = document.querySelectorAll('.gallery-card');

    cards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const itemId = this.dataset.id;

            // 如果是漫画类别且有多图，使用漫画查看器
            if (category === 'comic') {
                const item = galleryItems.find(item => item.id === itemId);
                if (item && item.images && item.images.length > 0) {
                    showComicLightbox(item);
                    return;
                }
            }

            // 其他类别使用普通灯箱
            const imgSrc = this.querySelector('.gallery-card-image').src;
            const title = this.dataset.title;
            const description = this.dataset.description;
            const author = this.dataset.author;
            const date = this.dataset.date;

            showGalleryLightbox(imgSrc, title, description, author, date, category);
        });
    });
}

// 漫画灯箱查看器
let currentComicData = null;
let currentComicPage = 0;

function showComicLightbox(item) {
    currentComicData = item;
    currentComicPage = 0;

    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox comic-lightbox';
    lightbox.id = 'comicLightbox';

    const content = document.createElement('div');
    content.className = 'gallery-lightbox-content';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'gallery-lightbox-image-container';

    const img = document.createElement('img');
    img.id = 'comicCurrentImage';
    img.alt = item.title;

    // 导航按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = 'comic-nav-btn comic-prev';
    prevBtn.innerHTML = '&larr;';
    prevBtn.onclick = () => navigateComic(-1);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'comic-nav-btn comic-next';
    nextBtn.innerHTML = '&rarr;';
    nextBtn.onclick = () => navigateComic(1);

    imageContainer.appendChild(prevBtn);
    imageContainer.appendChild(img);
    imageContainer.appendChild(nextBtn);

    const info = document.createElement('div');
    info.className = 'gallery-lightbox-info';

    const titleEl = document.createElement('h3');
    titleEl.className = 'gallery-lightbox-title';
    titleEl.textContent = item.title;

    const pageIndicator = document.createElement('p');
    pageIndicator.className = 'comic-page-indicator';
    pageIndicator.id = 'comicPageIndicator';

    info.appendChild(titleEl);
    info.appendChild(pageIndicator);

    if (item.description) {
        const descEl = document.createElement('p');
        descEl.className = 'gallery-lightbox-description';
        descEl.textContent = item.description;
        info.appendChild(descEl);
    }

    const metaEl = document.createElement('div');
    metaEl.className = 'gallery-lightbox-meta';

    if (item.author) {
        const authorSpan = document.createElement('span');
        authorSpan.textContent = `作者: ${item.author}`;
        metaEl.appendChild(authorSpan);
    }

    if (item.date) {
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `日期: ${item.date}`;
        metaEl.appendChild(dateSpan);
    }

    const categorySpan = document.createElement('span');
    categorySpan.textContent = `分类: 漫画`;
    metaEl.appendChild(categorySpan);

    info.appendChild(metaEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'gallery-lightbox-close';
    closeBtn.innerHTML = '&times;';

    content.appendChild(imageContainer);
    content.appendChild(info);
    lightbox.appendChild(content);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    updateComicImage();

    setTimeout(() => lightbox.classList.add('active'), 10);

    closeBtn.addEventListener('click', () => closeComicLightbox(lightbox));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeComicLightbox(lightbox);
    });

    document.addEventListener('keydown', comicKeyHandler);
}

function navigateComic(direction) {
    const newPage = currentComicPage + direction;
    if (newPage >= 0 && newPage < currentComicData.images.length) {
        currentComicPage = newPage;
        updateComicImage();
    }
}

function updateComicImage() {
    const img = document.getElementById('comicCurrentImage');
    const pageIndicator = document.getElementById('comicPageIndicator');
    const prevBtn = document.querySelector('.comic-prev');
    const nextBtn = document.querySelector('.comic-next');

    if (img && currentComicData) {
        img.src = `assets/images/gallery/${currentComicData.images[currentComicPage]}`;
    }

    if (pageIndicator && currentComicData) {
        pageIndicator.textContent = `第 ${currentComicPage + 1} 页 / 共 ${currentComicData.images.length} 页`;
    }

    if (prevBtn) {
        prevBtn.style.opacity = currentComicPage === 0 ? '0.3' : '1';
        prevBtn.style.cursor = currentComicPage === 0 ? 'not-allowed' : 'pointer';
    }

    if (nextBtn) {
        nextBtn.style.opacity = currentComicPage === currentComicData.images.length - 1 ? '0.3' : '1';
        nextBtn.style.cursor = currentComicPage === currentComicData.images.length - 1 ? 'not-allowed' : 'pointer';
    }
}

function comicKeyHandler(e) {
    if (!currentComicData) return;

    if (e.key === 'Escape') {
        const lightbox = document.getElementById('comicLightbox');
        if (lightbox) closeComicLightbox(lightbox);
    } else if (e.key === 'ArrowLeft') {
        navigateComic(-1);
    } else if (e.key === 'ArrowRight') {
        navigateComic(1);
    }
}

function closeComicLightbox(lightbox) {
    lightbox.classList.remove('active');
    setTimeout(() => {
        lightbox.remove();
        document.removeEventListener('keydown', comicKeyHandler);
        currentComicData = null;
        currentComicPage = 0;
    }, 300);
}

function showGalleryLightbox(imgSrc, title, description, author, date, category) {
    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';

    const content = document.createElement('div');
    content.className = 'gallery-lightbox-content';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'gallery-lightbox-image-container';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;

    const info = document.createElement('div');
    info.className = 'gallery-lightbox-info';

    const titleEl = document.createElement('h3');
    titleEl.className = 'gallery-lightbox-title';
    titleEl.textContent = title;

    info.appendChild(titleEl);

    if (description) {
        const descEl = document.createElement('p');
        descEl.className = 'gallery-lightbox-description';
        descEl.textContent = description;
        info.appendChild(descEl);
    }

    const metaEl = document.createElement('div');
    metaEl.className = 'gallery-lightbox-meta';

    if (author) {
        const authorSpan = document.createElement('span');
        authorSpan.textContent = `作者: ${author}`;
        metaEl.appendChild(authorSpan);
    }

    if (date) {
        const dateSpan = document.createElement('span');
        dateSpan.textContent = `日期: ${date}`;
        metaEl.appendChild(dateSpan);
    }

    if (category) {
        const categorySpan = document.createElement('span');
        categorySpan.textContent = `分类: ${getCategoryName(category)}`;
        metaEl.appendChild(categorySpan);
    }

    info.appendChild(metaEl);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'gallery-lightbox-close';
    closeBtn.innerHTML = '&times;';

    imageContainer.appendChild(img);
    content.appendChild(imageContainer);
    content.appendChild(info);
    lightbox.appendChild(content);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    setTimeout(() => lightbox.classList.add('active'), 10);

    closeBtn.addEventListener('click', () => closeLightbox(lightbox));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox(lightbox);
    });

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function closeLightbox(lightbox) {
    lightbox.classList.remove('active');
    setTimeout(() => lightbox.remove(), 300);
}

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGallery);
} else {
    loadGallery();
}
