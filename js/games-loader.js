// 游戏列表自动渲染

async function loadGames() {
    try {
        const response = await fetch('data/games.json');
        const data = await response.json();
        renderGames(data.games);
    } catch (error) {
        console.error('加载游戏数据失败:', error);
    }
}

function renderGames(games) {
    const container = document.querySelector('.games-grid');
    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    // 渲染游戏卡片
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        const imagePath = `assets/images/games/${game.image}`;

        card.innerHTML = `
            <div class="game-image">
                <img src="${imagePath}" alt="${game.name}"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="game-placeholder" style="display: none;">🎮</div>
            </div>
            <div class="game-overlay">
                <h3>${game.name}</h3>
                <p class="game-name-en">${game.nameEn}</p>
                <p class="game-desc">${game.description}</p>
            </div>
        `;

        container.appendChild(card);
    });
}

// 页面加载时自动加载游戏
if (document.querySelector('.games-grid')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadGames);
    } else {
        loadGames();
    }
}
