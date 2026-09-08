// 更新日志自动渲染

async function loadChangelog() {
    try {
        const response = await fetch('data/changelog.json');
        const data = await response.json();
        renderChangelog(data.changelogs);
    } catch (error) {
        console.error('加载更新日志失败:', error);
    }
}

function renderChangelog(changelogs) {
    const container = document.querySelector('.changelog-list');
    if (!container) return;

    container.innerHTML = '';

    changelogs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'changelog-item';

        const changesHTML = log.changes
            .map(change => `<li>${change}</li>`)
            .join('');

        item.innerHTML = `
            <div class="changelog-header">
                <div class="changelog-version">
                    <span class="version-number">v${log.version}</span>
                    <span class="version-date">${log.date}</span>
                </div>
                <h3 class="changelog-title">${log.title}</h3>
            </div>
            <div class="changelog-content">
                <ul class="changelog-list-items">
                    ${changesHTML}
                </ul>
            </div>
        `;

        container.appendChild(item);
    });
}

// 页面加载时自动加载更新日志
if (document.querySelector('.changelog-list')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadChangelog);
    } else {
        loadChangelog();
    }
}
