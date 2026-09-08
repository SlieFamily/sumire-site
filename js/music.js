// 音乐页面功能

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.querySelectorAll('.filter-tag');
    const songRows = document.querySelectorAll('.song-row:not(.song-header)');

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
        songRows.forEach(row => {
            const title = row.querySelector('.song-title')?.textContent.toLowerCase() || '';
            const artist = row.querySelector('.song-artist')?.textContent.toLowerCase() || '';
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
});
