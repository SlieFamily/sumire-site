// 皮套页面自动渲染

async function loadCostumes() {
    try {
        const response = await fetch('data/costumes.json');
        const data = await response.json();
        renderCostumes(data.costumes);
    } catch (error) {
        console.error('加载皮套数据失败:', error);
    }
}

function renderCostumes(costumes) {
    const container = document.querySelector('.costumes-masonry');
    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    // 渲染皮套卡片
    costumes.forEach(costume => {
        const card = document.createElement('div');
        card.className = 'costume-card';

        // 判断图片是否存在，不存在则使用占位符
        const imagePath = `assets/images/costumes/${costume.image}`;
        const imageContent = costume.image
            ? `<img src="${imagePath}" alt="${costume.title}" onerror="this.parentElement.innerHTML='<span class=\\'placeholder-icon\\'>👗</span>'">`
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
    });
}

// 页面加载时自动加载皮套
if (document.querySelector('.costumes-masonry')) {
    document.addEventListener('DOMContentLoaded', loadCostumes);
}
