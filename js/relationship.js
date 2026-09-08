// 人物关系网 - 从JSON文件加载数据

let relationshipData = null;

// 从JSON文件加载关系网数据
async function loadRelationshipData() {
    try {
        const response = await fetch('data/relationship.json');
        relationshipData = await response.json();
        initRelationshipNetwork();
    } catch (error) {
        console.error('加载关系网数据失败:', error);
        // 使用默认数据
        relationshipData = getDefaultData();
        initRelationshipNetwork();
    }
}

// 默认数据（作为后备）
function getDefaultData() {
    return {
        nodes: [
            {
                id: 'sumire',
                name: '明日堇sumire',
                avatar: '👤',
                url: 'https://space.bilibili.com/13271481',
                size: 70,
                color: '#8B7DC8',
                fixed: true
            },
            {
                id: 'friend1',
                name: '好友A',
                avatar: '👥',
                url: 'https://space.bilibili.com/example1',
                size: 50,
                color: '#6B9FE8'
            }
        ],
        edges: [
            {
                from: 'sumire',
                to: 'friend1',
                color: '#ff6b6b',
                width: 2
            }
        ]
    };
}

// 力导向布局算法
class ForceLayout {
    constructor(nodes, edges, width, height) {
        this.nodes = nodes.map(n => ({
            ...n,
            x: n.fixed ? width / 2 : Math.random() * width,
            y: n.fixed ? height / 2 : Math.random() * height,
            vx: 0,
            vy: 0
        }));
        this.edges = edges;
        this.width = width;
        this.height = height;
        // 根据屏幕宽度调整参数
        this.isMobile = width < 768;
        this.repulsionForce = this.isMobile ? 20000 : 15000;
        this.minDistanceExtra = this.isMobile ? 40 : 30;
    }

    simulate(iterations = 100) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        for (let i = 0; i < iterations; i++) {
            // 斥力：节点之间互相排斥（增大斥力防止重叠）
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const nodeA = this.nodes[i];
                    const nodeB = this.nodes[j];

                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                    // 计算节点半径，防止重叠
                    const minDistance = (nodeA.size + nodeB.size) / 2 + this.minDistanceExtra;

                    let force;
                    if (distance < minDistance) {
                        // 如果距离太近，施加更强的斥力
                        force = this.repulsionForce / (distance * distance);
                    } else {
                        force = 8000 / (distance * distance);
                    }

                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;

                    if (!nodeA.fixed) {
                        nodeA.vx -= fx;
                        nodeA.vy -= fy;
                    }
                    if (!nodeB.fixed) {
                        nodeB.vx += fx;
                        nodeB.vy += fy;
                    }
                }
            }

            // 引力：连接的节点互相吸引（减小引力让节点更分散）
            this.edges.forEach(edge => {
                const source = this.nodes.find(n => n.id === edge.from);
                const target = this.nodes.find(n => n.id === edge.to);

                if (source && target) {
                    const dx = target.x - source.x;
                    const dy = target.y - source.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = distance * (this.isMobile ? 0.002 : 0.003); // 移动端进一步减小引力

                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;

                    if (!source.fixed) {
                        source.vx += fx;
                        source.vy += fy;
                    }
                    if (!target.fixed) {
                        target.vx -= fx;
                        target.vy -= fy;
                    }
                }
            });

            // 向中心的吸引力（减小向心力）
            this.nodes.forEach(node => {
                if (!node.fixed) {
                    const dx = centerX - node.x;
                    const dy = centerY - node.y;
                    node.vx += dx * 0.0003;
                    node.vy += dy * 0.0003;
                }
            });

            // 更新位置
            this.nodes.forEach(node => {
                if (!node.fixed) {
                    node.vx *= 0.85;
                    node.vy *= 0.85;
                    node.x += node.vx;
                    node.y += node.vy;

                    // 边界约束（移动端边距更大）
                    const margin = this.isMobile ? 80 : 120;
                    node.x = Math.max(margin, Math.min(this.width - margin, node.x));
                    node.y = Math.max(margin, Math.min(this.height - margin, node.y));
                }
            });
        }

        return this.nodes;
    }
}

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
    const width = rect.width;
    const height = rect.height;

    // 使用力导向布局计算节点位置
    const layout = new ForceLayout(relationshipData.nodes, relationshipData.edges, width, height);
    const positionedNodes = layout.simulate(150);

    // 绘制连线（使用贝塞尔曲线）
    relationshipData.edges.forEach(edge => {
        const fromNode = positionedNodes.find(n => n.id === edge.from);
        const toNode = positionedNodes.find(n => n.id === edge.to);

        if (!fromNode || !toNode) return;

        const fromPos = { x: fromNode.x, y: fromNode.y };
        const toPos = { x: toNode.x, y: toNode.y };

        // 计算控制点（创建弧线效果）
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 控制点偏移（产生弧度，增大偏移让弧线更长）
        const offset = dist * 0.3; // 从0.2增加到0.3
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
    positionedNodes.forEach(node => {
        // 节点容器
        const nodeEl = document.createElement('div');
        nodeEl.className = 'network-node';
        nodeEl.style.left = node.x + 'px';
        nodeEl.style.top = node.y + 'px';

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
        if (node.avatar && (node.avatar.startsWith('http') || node.avatar.startsWith('assets/') || node.avatar.startsWith('./'))) {
            // 使用图片
            const img = document.createElement('img');
            img.src = node.avatar;
            img.alt = node.name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '50%';
            // 图片加载失败时显示表情符号
            img.onerror = function() {
                this.style.display = 'none';
                avatar.textContent = '👤';
                avatar.style.fontSize = (node.size * 0.5) + 'px';
            };
            avatar.appendChild(img);
        } else {
            // 使用表情符号或默认图标
            avatar.textContent = node.avatar || '👤';
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
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initRelationshipNetwork();
        }, 250);
    });
}

// 页面加载后初始化
if (document.querySelector('.relations-network')) {
    window.addEventListener('load', loadRelationshipData);
}
