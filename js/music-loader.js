// 音乐页面自动渲染

async function loadSongs() {
    try {
        const response = await fetch('data/songs.json');
        const data = await response.json();
        renderSongs(data.songs);
    } catch (error) {
        console.error('加载歌曲数据失败:', error);
    }
}

function renderSongs(songs) {
    const songsTable = document.querySelector('.songs-table');
    if (!songsTable) return;

    // 清空现有内容（保留表头）
    const rows = songsTable.querySelectorAll('.song-row:not(.song-header)');
    rows.forEach(row => row.remove());

    // 渲染歌曲
    songs.forEach((song, index) => {
        const row = document.createElement('div');
        row.className = 'song-row';
        row.setAttribute('data-lang', song.lang);

        row.innerHTML = `
            <div class="song-number">${String(index + 1).padStart(2, '0')}</div>
            <div class="song-info">
                <h3 class="song-title">${song.title}</h3>
                <p class="song-artist">${song.artist} · ${song.type} · ${getLangName(song.lang)}</p>
            </div>
            <div class="song-duration">${song.duration}</div>
            <div class="song-action">
                <a href="${song.url}" target="_blank" class="song-link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m8 4-2 2"></path>
                        <path d="m16 4 2 2"></path>
                        <rect x="3" y="6" width="18" height="13" rx="3"></rect>
                        <path d="m9 11-.01 3"></path>
                        <path d="m15 11-.01 3"></path>
                    </svg>
                </a>
            </div>
        `;

        songsTable.appendChild(row);
    });
}

function getLangName(lang) {
    const langMap = {
        'zh': '中文',
        'ja': '日语',
        'en': '英语'
    };
    return langMap[lang] || lang;
}

// 页面加载时自动加载歌曲
if (document.querySelector('.songs-table')) {
    document.addEventListener('DOMContentLoaded', loadSongs);
}
