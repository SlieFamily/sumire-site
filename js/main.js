// 主要 JavaScript 功能

// 视频切换功能
const videos = [
    'assets/videos/background.mp4',
    'assets/videos/background2.mp4',
    'assets/videos/background3.mp4'
];

// 从 localStorage 读取用户上次选择的视频索引
let currentVideoIndex = parseInt(localStorage.getItem('selectedVideoIndex')) || 0;

// 确保索引有效
if (currentVideoIndex >= videos.length) {
    currentVideoIndex = 0;
}

// 页面加载动画
window.addEventListener('load', () => {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const signatureLogo = document.querySelector('.signature-logo');
    const pageSignature = document.querySelector('.page-signature');

    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');

            // 如果存在页面签名，触发过渡动画
            if (pageSignature && signatureLogo) {
                // 获取 loading 中签名的位置
                const loadingRect = signatureLogo.getBoundingClientRect();
                // 获取目标位置
                const targetRect = pageSignature.getBoundingClientRect();

                // 计算偏移量和缩放比例
                const deltaX = targetRect.left - loadingRect.left;
                const deltaY = targetRect.top - loadingRect.top;
                const scaleX = targetRect.width / loadingRect.width;
                const scaleY = targetRect.height / loadingRect.height;

                // 克隆签名元素用于过渡动画
                const clonedSignature = signatureLogo.cloneNode(true);
                clonedSignature.style.position = 'fixed';
                clonedSignature.style.left = loadingRect.left + 'px';
                clonedSignature.style.top = loadingRect.top + 'px';
                clonedSignature.style.width = loadingRect.width + 'px';
                clonedSignature.style.height = loadingRect.height + 'px';
                clonedSignature.style.zIndex = '10000';
                clonedSignature.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                clonedSignature.style.animation = 'none'; // 停止淡入淡出动画
                document.body.appendChild(clonedSignature);

                // 触发过渡
                setTimeout(() => {
                    clonedSignature.style.left = targetRect.left + 'px';
                    clonedSignature.style.top = targetRect.top + 'px';
                    clonedSignature.style.width = targetRect.width + 'px';
                    clonedSignature.style.height = targetRect.height + 'px';
                    clonedSignature.style.opacity = '0';
                }, 100);

                // 显示真正的页面签名
                setTimeout(() => {
                    pageSignature.style.opacity = '1';
                    clonedSignature.remove();
                }, 900);
            }
        }, 1500);
    }
});

// 视频加载处理
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.background-video');

    if (video) {
        // 设置初始视频为用户上次选择的视频
        video.src = videos[currentVideoIndex];

        // 确保视频播放
        video.addEventListener('loadeddata', () => {
            video.play().catch(err => {
                console.log('视频自动播放失败:', err);
            });
        });

        // 视频加载失败时的处理
        video.addEventListener('error', () => {
            console.log('视频加载失败，尝试加载下一个视频');
            // 如果当前视频加载失败，尝试下一个
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            if (currentVideoIndex < videos.length) {
                video.src = videos[currentVideoIndex];
                video.load();
            } else {
                // 所有视频都失败，使用静态背景
                const container = document.querySelector('.video-container');
                if (container) {
                    container.style.background = 'linear-gradient(135deg, #0c0505 0%, #1a1625 50%, #2d2540 100%)';
                }
            }
        });
    }

    // 视频切换按钮
    const videoToggleBtn = document.querySelector('.video-toggle-btn');
    if (videoToggleBtn && video) {
        videoToggleBtn.addEventListener('click', () => {
            // 检查是否有多个视频
            if (videos.length <= 1) {
                console.log('只有一个视频，无需切换');
                return;
            }

            // 切换到下一个视频
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            const newVideo = videos[currentVideoIndex];

            // 保存用户选择到 localStorage
            localStorage.setItem('selectedVideoIndex', currentVideoIndex);

            // 淡出效果
            video.style.opacity = '0';

            setTimeout(() => {
                video.src = newVideo;
                video.load();

                // 监听视频加载完成
                const loadHandler = () => {
                    video.play().catch(err => {
                        console.log('视频切换播放失败:', err);
                    });
                    // 淡入效果
                    video.style.opacity = '1';
                    video.removeEventListener('loadeddata', loadHandler);
                };

                video.addEventListener('loadeddata', loadHandler);

                // 如果5秒后还没加载完成，强制淡入
                setTimeout(() => {
                    video.style.opacity = '1';
                }, 5000);
            }, 500);
        });
    }
});

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

// 人物关系网络图
function initRelationshipNetwork() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // 节点数据
    const nodes = [
        { id: 'sumire', x: canvas.width / 2, y: canvas.height / 2, label: '明日堇', color: '#8B7DC8', radius: 40 },
        { id: 'friend1', x: canvas.width * 0.3, y: canvas.height * 0.3, label: '好友A', color: '#6B9FE8', radius: 30 },
        { id: 'friend2', x: canvas.width * 0.7, y: canvas.height * 0.3, label: '好友B', color: '#6B9FE8', radius: 30 },
        { id: 'friend3', x: canvas.width * 0.3, y: canvas.height * 0.7, label: '好友C', color: '#6B9FE8', radius: 30 },
        { id: 'friend4', x: canvas.width * 0.7, y: canvas.height * 0.7, label: '好友D', color: '#6B9FE8', radius: 30 }
    ];

    // 连接关系
    const edges = [
        { from: 'sumire', to: 'friend1' },
        { from: 'sumire', to: 'friend2' },
        { from: 'sumire', to: 'friend3' },
        { from: 'sumire', to: 'friend4' },
        { from: 'friend1', to: 'friend2' },
        { from: 'friend3', to: 'friend4' }
    ];

    function drawNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制连接线
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        edges.forEach(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);

            ctx.beginPath();
            ctx.moveTo(fromNode.x, fromNode.y);
            ctx.lineTo(toNode.x, toNode.y);
            ctx.stroke();
        });

        // 绘制节点
        nodes.forEach(node => {
            // 外圈光晕
            const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius + 10);
            gradient.addColorStop(0, node.color + '40');
            gradient.addColorStop(1, node.color + '00');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius + 10, 0, Math.PI * 2);
            ctx.fill();

            // 节点圆圈
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fill();

            // 节点边框
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // 节点文字
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y);
        });
    }

    // 鼠标交互
    let hoveredNode = null;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        hoveredNode = nodes.find(node => {
            const dx = mouseX - node.x;
            const dy = mouseY - node.y;
            return Math.sqrt(dx * dx + dy * dy) < node.radius;
        });

        canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
        drawNetwork();
    });

    // 初始绘制
    drawNetwork();

    // 窗口大小改变时重绘
    window.addEventListener('resize', () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // 重新计算节点位置
        nodes[0].x = canvas.width / 2;
        nodes[0].y = canvas.height / 2;
        nodes[1].x = canvas.width * 0.3;
        nodes[1].y = canvas.height * 0.3;
        nodes[2].x = canvas.width * 0.7;
        nodes[2].y = canvas.height * 0.3;
        nodes[3].x = canvas.width * 0.3;
        nodes[3].y = canvas.height * 0.7;
        nodes[4].x = canvas.width * 0.7;
        nodes[4].y = canvas.height * 0.7;

        drawNetwork();
    });
}

// 页面加载完成后初始化关系网络
if (document.getElementById('network-canvas')) {
    window.addEventListener('load', initRelationshipNetwork);
}
