// 音乐页面自动渲染

let allSongs = [];

async function loadSongs() {
    try {
        const response = await fetch('data/songs.json');
        const data = await response.json();
        allSongs = data.songs;
        renderSongs(allSongs);
        initMusicFilters();
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
        row.setAttribute('data-title', song.title.toLowerCase());
        row.setAttribute('data-artist', song.artist.toLowerCase());

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

// 初始化筛选功能
function initMusicFilters() {
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.querySelectorAll('.filter-tag');
    let currentLang = 'all';

    // 搜索功能
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterSongs(searchTerm, currentLang);
        });
    }

    // 语言筛选
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentLang = tag.getAttribute('data-lang');

            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            filterSongs(searchTerm, currentLang);
        });
    });

    function filterSongs(searchTerm, lang) {
        const songRows = document.querySelectorAll('.song-row:not(.song-header)');

        songRows.forEach(row => {
            const title = row.getAttribute('data-title') || '';
            const artist = row.getAttribute('data-artist') || '';
            const rowLang = row.getAttribute('data-lang');

            const matchesSearch = title.includes(searchTerm) || artist.includes(searchTerm);
            const matchesLang = lang === 'all' || rowLang === lang;

            if (matchesSearch && matchesLang) {
                row.style.display = 'grid';
            } else {
                row.style.display = 'none';
            }
        });
    }
}

// 页面加载时自动加载歌曲
if (document.querySelector('.songs-table')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSongs);
    } else {
        loadSongs();
    }
}
