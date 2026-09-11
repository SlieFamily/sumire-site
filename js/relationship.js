// 人物关系网 - 从JSON文件加载数据

let relationshipData = null;
let scale = 1;
let translateX = 0;
let translateY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;

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

    simulate(iterations = 50) {
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

// 全局变量存储节点和SVG
let positionedNodes = [];
let svg = null;
let containerRect = null;
let activeNodeId = null; // 当前激活的节点ID

// 高亮显示与指定节点相关的连线和节点
function highlightConnections(nodeId) {
    activeNodeId = nodeId;

    if (!nodeId) {
        // 清除高亮，恢复所有节点和边
        document.querySelectorAll('.network-node').forEach(node => {
            node.classList.remove('dimmed', 'highlighted');
        });
        document.querySelectorAll('.network-edge').forEach(edge => {
            edge.classList.remove('dimmed', 'highlighted');
        });
        return;
    }

    // 找到与当前节点相关的所有边和节点
    const connectedNodeIds = new Set([nodeId]);
    const connectedEdges = new Set();

    relationshipData.edges.forEach((edge, index) => {
        if (edge.from === nodeId || edge.to === nodeId) {
            connectedEdges.add(index);
            connectedNodeIds.add(edge.from);
            connectedNodeIds.add(edge.to);
        }
    });

    // 更新节点样式
    document.querySelectorAll('.network-node').forEach(node => {
        const id = node.dataset.nodeId;
        if (connectedNodeIds.has(id)) {
            node.classList.add('highlighted');
            node.classList.remove('dimmed');
        } else {
            node.classList.add('dimmed');
            node.classList.remove('highlighted');
        }
    });

    // 更新边样式
    document.querySelectorAll('.network-edge').forEach((edge, index) => {
        if (connectedEdges.has(index)) {
            edge.classList.add('highlighted');
            edge.classList.remove('dimmed');
        } else {
            edge.classList.add('dimmed');
            edge.classList.remove('highlighted');
        }
    });
}

// 更新所有连线
function updateEdges() {
    if (!svg) return;

    // 清空所有连线
    svg.innerHTML = '';

    // 重新绘制所有连线
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

        // 控制点偏移（产生弧度）
        const offset = dist * 0.3;
        const controlX = midX - dy / dist * offset;
        const controlY = midY + dx / dist * offset;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`;

        path.setAttribute('d', d);
        path.setAttribute('stroke', edge.color);
        path.setAttribute('stroke-width', edge.width);
        path.setAttribute('fill', 'none');
        path.setAttribute('class', 'network-edge');
        path.dataset.edgeIndex = relationshipData.edges.indexOf(edge);

        svg.appendChild(path);
    });

    // 重新应用高亮状态
    if (activeNodeId) {
        highlightConnections(activeNodeId);
    }
}

// 初始化关系网络
function initRelationshipNetwork() {
    const container = document.querySelector('.relations-network');
    if (!container) return;

    // 清空容器
    container.innerHTML = '';

    // 创建 SVG 画布用于绘制连线
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'network-svg');
    svg.style.position = 'absolute';
    svg.style.inset = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    container.appendChild(svg);

    const rect = container.getBoundingClientRect();
    containerRect = rect;
    const width = rect.width;
    const height = rect.height;

    // 使用力导向布局计算节点位置
    const layout = new ForceLayout(relationshipData.nodes, relationshipData.edges, width, height);
    positionedNodes = layout.simulate(50);

    // 初始绘制连线
    updateEdges();

    // 创建内容容器（用于缩放和平移）
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'network-content';
    contentWrapper.style.position = 'absolute';
    contentWrapper.style.inset = '0';
    contentWrapper.style.transformOrigin = 'center center';
    contentWrapper.style.transition = 'none';
    container.appendChild(contentWrapper);

    // 将SVG移到contentWrapper中
    contentWrapper.appendChild(svg);

    // 创建节点
    positionedNodes.forEach(node => {
        // 节点容器
        const nodeEl = document.createElement('div');
        nodeEl.className = 'network-node';
        nodeEl.style.left = node.x + 'px';
        nodeEl.style.top = node.y + 'px';
        nodeEl.style.cursor = 'grab';
        nodeEl.dataset.nodeId = node.id;

        // 头像容器（直接使用div，不使用链接）
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
            img.style.pointerEvents = 'none'; // 防止拖拽图片
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
        label.style.pointerEvents = 'none'; // 防止拖拽标签

        nodeEl.appendChild(avatar);
        nodeEl.appendChild(label);
        contentWrapper.appendChild(nodeEl);

        // 拖拽功能
        let isDragging = false;
        let startX, startY;
        let offsetX, offsetY;

        // 鼠标事件
        nodeEl.addEventListener('mousedown', (e) => {
            isDragging = true;
            nodeEl.style.cursor = 'grabbing';

            // 高亮显示连接
            highlightConnections(node.id);

            startX = e.clientX;
            startY = e.clientY;
            offsetX = node.x - startX;
            offsetY = node.y - startY;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const newX = e.clientX + offsetX;
            const newY = e.clientY + offsetY;

            // 边界约束
            const margin = 60;
            node.x = Math.max(margin, Math.min(containerRect.width - margin, newX));
            node.y = Math.max(margin, Math.min(containerRect.height - margin, newY));

            nodeEl.style.left = node.x + 'px';
            nodeEl.style.top = node.y + 'px';

            // 实时更新连线
            updateEdges();
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                nodeEl.style.cursor = 'grab';

                // 清除高亮
                setTimeout(() => {
                    highlightConnections(null);
                }, 300);
            }
        });

        // 触摸事件（移动端支持）
        nodeEl.addEventListener('touchstart', (e) => {
            isDragging = true;

            // 高亮显示连接
            highlightConnections(node.id);

            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            offsetX = node.x - startX;
            offsetY = node.y - startY;

            e.preventDefault();
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const touch = e.touches[0];
            const newX = touch.clientX + offsetX;
            const newY = touch.clientY + offsetY;

            // 边界约束
            const margin = 60;
            node.x = Math.max(margin, Math.min(containerRect.width - margin, newX));
            node.y = Math.max(margin, Math.min(containerRect.height - margin, newY));

            nodeEl.style.left = node.x + 'px';
            nodeEl.style.top = node.y + 'px';

            // 实时更新连线
            updateEdges();

            e.preventDefault();
        });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;

                // 清除高亮
                setTimeout(() => {
                    highlightConnections(null);
                }, 300);
            }
        });

        // 悬停效果
        nodeEl.addEventListener('mouseenter', () => {
            if (!isDragging) {
                nodeEl.style.transform = 'translate(-50%, -50%) scale(1.1)';
            }
        });

        nodeEl.addEventListener('mouseleave', () => {
            nodeEl.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // 缩放和平移功能
    function updateTransform() {
        contentWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // 鼠标滚轮缩放
    container.addEventListener('wheel', (e) => {
        e.preventDefault();

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = scale * delta;

        // 限制缩放范围 0.5x - 3x
        if (newScale >= 0.5 && newScale <= 3) {
            scale = newScale;
            updateTransform();
        }
    }, { passive: false });

    // 触摸双指缩放
    let initialDistance = 0;
    let initialScale = 1;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialDistance = Math.sqrt(dx * dx + dy * dy);
            initialScale = scale;
        }
    });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();

            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const newScale = initialScale * (distance / initialDistance);

            // 限制缩放范围 0.5x - 3x
            if (newScale >= 0.5 && newScale <= 3) {
                scale = newScale;
                updateTransform();
            }
        }
    }, { passive: false });

    // 响应式调整：只调整容器大小，不重新初始化
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newRect = container.getBoundingClientRect();
            containerRect = newRect;
        }, 250);
    });
}

// 页面加载后初始化
if (document.querySelector('.relations-network')) {
    window.addEventListener('load', loadRelationshipData);
}
