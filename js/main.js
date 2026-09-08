// 主要 JavaScript 功能

// 页面加载动画
window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 800);
    }
});

// 视频加载处理
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.background-video');

    if (video) {
        // 确保视频播放
        video.addEventListener('loadeddata', () => {
            video.play().catch(err => {
                console.log('视频自动播放失败:', err);
            });
        });

        // 视频加载失败时的处理
        video.addEventListener('error', () => {
            console.log('视频加载失败，使用静态背景');
            const container = document.querySelector('.video-container');
            if (container) {
                container.style.background = 'linear-gradient(135deg, #0c0505 0%, #1a1625 50%, #2d2540 100%)';
            }
        });
    }
});

// 移动端菜单处理
const setupMobileMenu = () => {
    // 如果需要移动端汉堡菜单，在这里添加
};

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
