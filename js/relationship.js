// 人物关系网配置文件
// 管理员可以编辑此文件来添加/修改关系网

const relationshipData = {
    // 节点配置
    nodes: [
        {
            id: 'sumire',
            name: '明日堇sumire',
            avatar: '👤', // 可替换为头像URL
            url: 'https://space.bilibili.com/13271481',
            x: 50, // 百分比位置
            y: 50,
            size: 60, // 节点大小
            color: '#8B7DC8' // 节点颜色
        },
        {
            id: 'friend1',
            name: '好友A',
            avatar: '👥',
            url: 'https://space.bilibili.com/example1',
            x: 30,
            y: 25,
            size: 50,
            color: '#6B9FE8'
        },
        {
            id: 'friend2',
            name: '好友B',
            avatar: '👥',
            url: 'https://space.bilibili.com/example2',
            x: 70,
            y: 25,
            size: 50,
            color: '#6B9FE8'
        },
        {
            id: 'friend3',
            name: '好友C',
            avatar: '👥',
            url: 'https://space.bilibili.com/example3',
            x: 20,
            y: 70,
            size: 50,
            color: '#6B9FE8'
        },
        {
            id: 'friend4',
            name: '好友D',
            avatar: '👥',
            url: 'https://space.bilibili.com/example4',
            x: 75,
            y: 75,
            size: 50,
            color: '#6B9FE8'
        }
    ],

    // 连接关系配置
    edges: [
        {
            from: 'sumire',
            to: 'friend1',
            color: '#ff6b6b', // 红色连线
            width: 2
        },
        {
            from: 'sumire',
            to: 'friend2',
            color: '#ff6b6b',
            width: 2
        },
        {
            from: 'sumire',
            to: 'friend3',
            color: '#ff6b6b',
            width: 2
        },
        {
            from: 'sumire',
            to: 'friend4',
            color: '#ff6b6b',
            width: 2
        },
        {
            from: 'friend1',
            to: 'friend2',
            color: 'rgba(255, 255, 255, 0.2)', // 灰色连线
            width: 1
        },
        {
            from: 'friend3',
            to: 'friend4',
            color: 'rgba(255, 255, 255, 0.2)',
            width: 1
        }
    ]
};

// 初始化关系网络
function initRelationshipNetwork() {
    const container = document.querySelector('.relations-network');
    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    // 创建 SVG 画布用于绘制连线
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'network-svg');
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    container.appendChild(svg);

    const rect = container.getBoundingClientRect();

    // 计算节点的实际像素位置
    const calculatePosition = (node) => ({
        x: (node.x / 100) * rect.width,
        y: (node.y / 100) * rect.height
    });

    // 绘制连线（使用贝塞尔曲线）
    relationshipData.edges.forEach(edge => {
        const fromNode = relationshipData.nodes.find(n => n.id === edge.from);
        const toNode = relationshipData.nodes.find(n => n.id === edge.to);

        if (!fromNode || !toNode) return;

        const fromPos = calculatePosition(fromNode);
        const toPos = calculatePosition(toNode);

        // 计算控制点（创建弧线效果）
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 控制点偏移（产生弧度）
        const offset = dist * 0.2;
        const controlX = midX - dy / dist * offset;
        const controlY = midY + dx / dist * offset;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`;

        path.setAttribute('d', d);
        path.setAttribute('stroke', edge.color);
        path.setAttribute('stroke-width', edge.width);
        path.setAttribute('fill', 'none');
        path.setAttribute('class', 'network-edge');

        svg.appendChild(path);
    });

    // 创建节点
    relationshipData.nodes.forEach(node => {
        const pos = calculatePosition(node);

        // 节点容器
        const nodeEl = document.createElement('div');
        nodeEl.className = 'network-node';
        nodeEl.style.left = pos.x + 'px';
        nodeEl.style.top = pos.y + 'px';

        // 节点链接
        const link = document.createElement('a');
        link.href = node.url;
        link.target = '_blank';
        link.className = 'node-link';

        // 头像容器
        const avatar = document.createElement('div');
        avatar.className = 'node-avatar';
        avatar.style.width = node.size + 'px';
        avatar.style.height = node.size + 'px';
        avatar.style.backgroundColor = node.color;

        // 头像内容（表情符号或图片）
        if (node.avatar.startsWith('http')) {
            const img = document.createElement('img');
            img.src = node.avatar;
            img.alt = node.name;
            avatar.appendChild(img);
        } else {
            avatar.textContent = node.avatar;
            avatar.style.fontSize = (node.size * 0.5) + 'px';
        }

        // 名字标签
        const label = document.createElement('div');
        label.className = 'node-label';
        label.textContent = node.name;

        link.appendChild(avatar);
        nodeEl.appendChild(link);
        nodeEl.appendChild(label);
        container.appendChild(nodeEl);

        // 悬停效果
        nodeEl.addEventListener('mouseenter', () => {
            nodeEl.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });

        nodeEl.addEventListener('mouseleave', () => {
            nodeEl.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // 响应式调整
    window.addEventListener('resize', () => {
        initRelationshipNetwork();
    });
}

// 页面加载后初始化
if (document.querySelector('.relations-network')) {
    window.addEventListener('load', initRelationshipNetwork);
}
