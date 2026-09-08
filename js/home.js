// 主页特定 JavaScript

// 视频背景自动播放处理
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('bg-video');

    if (video) {
        // 确保视频在加载后播放
        video.addEventListener('loadeddata', () => {
            video.play().catch(err => {
                console.log('视频自动播放失败:', err);
            });
        });

        // 视频加载失败时的处理
        video.addEventListener('error', () => {
            console.log('视频加载失败，使用静态背景');
            const videoBackground = document.querySelector('.video-background');
            videoBackground.style.background = 'linear-gradient(135deg, #1a1625 0%, #2d2540 50%, #3d3560 100%)';
        });
    }

    // 滚动指示器点击事件
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const firstSection = document.querySelector('.section');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// 视差滚动效果
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 1.5;
    }
});
