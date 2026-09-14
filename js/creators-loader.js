// 创作者推荐自动渲染

async function loadCreators() {
    try {
        const response = await fetch('data/creators.json');
        const data = await response.json();
        renderCreators(data.creators);
    } catch (error) {
        console.error('加载创作者数据失败:', error);
    }
}

function renderCreators(creators) {
    const container = document.querySelector('.creators-grid');
    if (!container) return;

    container.innerHTML = '';

    creators.forEach(creator => {
        const card = document.createElement('a');
        card.className = 'creator-card';
        card.href = creator.url;
        card.target = '_blank';

        const tagsHTML = creator.tags
            .map(tag => `<span class="creator-tag">${tag}</span>`)
            .join('');

        // 将头像路径转换为webp缩略图
        const avatarPath = creator.avatar
            .replace('./assets/images/avatar/', 'assets/images/avatar/thumbnails/')
            .replace(/\.(jpg|png)$/, '.webp');

        card.innerHTML = `
            <div class="creator-avatar">
                <img src="${avatarPath}" alt="${creator.name}"
                     onerror="this.src='assets/images/avatar/thumbnails/951.webp'">
            </div>
            <div class="creator-info">
                <div class="creator-name">
                    ${creator.name}
                </div>
                <p class="creator-description">${creator.description}</p>
                <div class="creator-tags">
                    ${tagsHTML}
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// 页面加载时自动加载创作者
if (document.querySelector('.creators-grid')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCreators);
    } else {
        loadCreators();
    }
}
