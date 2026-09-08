// 画廊页面自动渲染

async function loadGallery() {
    try {
        const response = await fetch('data/gallery.json');
        const data = await response.json();
        renderGallery(data.gallery);
    } catch (error) {
        console.error('加载画廊数据失败:', error);
    }
}

function renderGallery(items) {
    const container = document.querySelector('.gallery-grid');
    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    // 渲染画廊项目
    items.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.setAttribute('data-category', item.category);

        // 判断图片是否存在，不存在则使用占位符
        const imagePath = `assets/images/gallery/${item.image}`;
        const placeholderMap = {
            'fanart': '🎨',
            'emoji': '😊',
            'comic': '📖'
        };
        const placeholder = placeholderMap[item.category] || '🖼️';

        galleryItem.innerHTML = `
            <div class="gallery-card">
                <div class="gallery-image">
                    <img src="${imagePath}" alt="${item.title}"
                         onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>${placeholder}</div>'">
                </div>
            </div>
        `;

        container.appendChild(galleryItem);
    });
}

// 页面加载时自动加载画廊
if (document.querySelector('.gallery-grid')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadGallery);
    } else {
        loadGallery();
    }
}
