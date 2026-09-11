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

// 简化版社区发现算法 - 用于聚类
function detectCommunities() {
    const nodes = relationshipData.nodes;
    const edges = relationshipData.edges;

    // 过滤掉与中心节点相关的边
    const filteredEdges = edges.filter(e => e.from !== 'sumire' && e.to !== 'sumire');

    // 初始化：每个节点自成一个社区（排除中心节点）
    const nodeToCommunity = {};
    nodes.forEach((node, idx) => {
        if (node.id !== 'sumire') {
            nodeToCommunity[node.id] = idx;
        }
    });

    // 构建邻接表（带权重，排除中心节点）
    const neighbors = {};
    nodes.forEach(n => {
        if (n.id !== 'sumire') {
            neighbors[n.id] = [];
        }
    });
    filteredEdges.forEach(e => {
        if (!neighbors[e.from]) neighbors[e.from] = [];
        if (!neighbors[e.to]) neighbors[e.to] = [];
        const weight = e.width || 1;
        neighbors[e.from].push({ node: e.to, weight });
        neighbors[e.to].push({ node: e.from, weight });
    });

    // 计算加权度数（只考虑过滤后的边）
    const degrees = {};
    nodes.forEach(n => {
        if (n.id !== 'sumire') {
            degrees[n.id] = 0;
        }
    });
    filteredEdges.forEach(e => {
        const weight = e.width || 1;
        degrees[e.from] = (degrees[e.from] || 0) + weight;
        degrees[e.to] = (degrees[e.to] || 0) + weight;
    });

    const totalWeight = filteredEdges.reduce((sum, e) => sum + (e.width || 1), 0);

    // 迭代优化社区划分
    let improved = true;
    let iterations = 0;
    const maxIterations = 10;

    while (improved && iterations < maxIterations) {
        improved = false;
        iterations++;

        // 随机顺序遍历节点（排除中心节点）
        const nodeOrder = nodes.filter(n => n.id !== 'sumire').sort(() => Math.random() - 0.5);

        nodeOrder.forEach(node => {
            const nodeId = node.id;
            const currentCommunity = nodeToCommunity[nodeId];

            // 统计邻居所属的社区及连接权重
            const communityWeights = {};
            neighbors[nodeId].forEach(neighbor => {
                const neighborCommunity = nodeToCommunity[neighbor.node];
                if (neighborCommunity !== undefined) {
                    communityWeights[neighborCommunity] = (communityWeights[neighborCommunity] || 0) + neighbor.weight;
                }
            });

            // 找到连接权重最大的社区
            let bestCommunity = currentCommunity;
            let maxWeight = communityWeights[currentCommunity] || 0;

            Object.entries(communityWeights).forEach(([community, weight]) => {
                const communityId = parseInt(community);
                if (communityId !== currentCommunity && weight > maxWeight) {
                    maxWeight = weight;
                    bestCommunity = communityId;
                }
            });

            // 如果找到更好的社区，移动节点
            if (bestCommunity !== currentCommunity) {
                nodeToCommunity[nodeId] = bestCommunity;
                improved = true;
            }
        });
    }

    // 构建社区映射（排除中心节点）
    const communityMap = {};
    nodes.forEach(n => {
        if (n.id !== 'sumire') {
            const comm = nodeToCommunity[n.id];
            if (!communityMap[comm]) communityMap[comm] = [];
            communityMap[comm].push(n.id);
        }
    });

    // 过滤出有效社区（至少2个成员）
    const communities = Object.entries(communityMap)
        .filter(([_, members]) => members.length >= 2)
        .map(([id, members]) => ({
            id: `community-${id}`,
            members: members
        }));

    console.log(`检测到 ${communities.length} 个社区 (不含中心节点):`, communities);
    return communities;
}

// 力导向布局算法
class ForceLayout {
    constructor(nodes, edges, communities, width, height) {
        const isMobile = width < 768;

        // 中心节点始终位于内容坐标系的正中心
        const centerX = width / 2;
        const centerY = height / 2;

        this.nodes = nodes.map(n => ({
            ...n,
            x: n.fixed ? centerX : Math.random() * width,
            y: n.fixed ? centerY : Math.random() * height,
            vx: 0,
            vy: 0
        }));
        this.edges = edges;
        this.communities = communities || [];
        this.width = width;
        this.height = height;
        this.centerX = centerX;
        this.centerY = centerY;
        // 根据屏幕宽度调整参数
        this.isMobile = isMobile;
        this.repulsionForce = this.isMobile ? 20000 : 15000;
        this.minDistanceExtra = this.isMobile ? 40 : 30;
    }

    simulate(iterations = 50) {
        // 使用保存的中心位置（已根据移动端/桌面端动态计算）
        const centerX = this.centerX;
        const centerY = this.centerY;

        // 确保中心节点的初始位置就在正确的中心
        const centerNode = this.nodes.find(n => n.fixed);
        if (centerNode) {
            centerNode.x = centerX;
            centerNode.y = centerY;
        }

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

            // 社区内聚力：同一社区的节点互相吸引
            if (this.communities && this.communities.length > 0) {
                this.communities.forEach(community => {
                    const communityNodes = this.nodes.filter(n => community.members.includes(n.id));
                    if (communityNodes.length < 2) return;

                    // 计算社区中心
                    let centerX = 0, centerY = 0;
                    communityNodes.forEach(n => {
                        centerX += n.x;
                        centerY += n.y;
                    });
                    centerX /= communityNodes.length;
                    centerY /= communityNodes.length;

                    // 社区内节点向社区中心聚集
                    communityNodes.forEach(node => {
                        if (!node.fixed) {
                            const dx = centerX - node.x;
                            const dy = centerY - node.y;
                            // 减小社区聚集力，让节点更分散
                            node.vx += dx * 0.008;
                            node.vy += dy * 0.008;
                        }
                    });
                });
            }

            // 社区间排斥力：不同社区的节点互相推开
            if (this.communities && this.communities.length > 1) {
                // 构建节点到社区的映射
                const nodeToCommunity = {};
                this.communities.forEach((community, idx) => {
                    community.members.forEach(nodeId => {
                        nodeToCommunity[nodeId] = idx;
                    });
                });

                // 对不同社区的节点施加额外排斥力
                for (let i = 0; i < this.nodes.length; i++) {
                    for (let j = i + 1; j < this.nodes.length; j++) {
                        const nodeA = this.nodes[i];
                        const nodeB = this.nodes[j];

                        const commA = nodeToCommunity[nodeA.id];
                        const commB = nodeToCommunity[nodeB.id];

                        // 只对不同社区的节点施加额外排斥
                        if (commA !== undefined && commB !== undefined && commA !== commB) {
                            const dx = nodeB.x - nodeA.x;
                            const dy = nodeB.y - nodeA.y;
                            const distance = Math.sqrt(dx * dx + dy * dy) || 1;

                            // 额外的社区间排斥力
                            const force = 5000 / (distance * distance);
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
                }
            }

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

                    // 边界约束（移动端边距更小，确保内容在可视区域内）
                    const margin = this.isMobile ? 40 : 80;
                    const nodeRadius = node.size / 2;
                    node.x = Math.max(margin + nodeRadius, Math.min(this.width - margin - nodeRadius, node.x));
                    node.y = Math.max(margin + nodeRadius, Math.min(this.height - margin - nodeRadius, node.y));
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

// 计算头像圆心位置（节点容器使用 flex column 且 transform: translate(-50%, -50%)）
function getAvatarCenter(node) {
    // 节点容器已经用 translate(-50%, -50%) 居中，node.x/node.y 是容器中心点
    // gap 是 0.75rem = 12px，标签高度约 28px
    // 头像在容器上半部分，需要向上偏移
    const labelHeight = 28;
    const gap = 12;
    const containerHeight = node.size + gap + labelHeight;
    // 头像圆心相对于容器中心的偏移量：向上偏移半个容器高度，再向下偏移半个头像高度
    const avatarCenterOffset = -(containerHeight / 2) + (node.size / 2);

    return {
        x: node.x,
        y: node.y + avatarCenterOffset
    };
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

        // 使用头像圆心作为连接点
        const fromPos = getAvatarCenter(fromNode);
        const toPos = getAvatarCenter(toNode);

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

    // 获取容器的 padding
    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

    // 使用完整尺寸进行布局（包含 padding）
    const width = rect.width;
    const height = rect.height;

    // 调试信息
    console.log('Container dimensions:', {
        width,
        height,
        windowWidth: window.innerWidth,
        isMobile: width < 768,
        centerX: width / 2,
        centerY: height / 2
    });

    // 检测社区
    const communities = detectCommunities();

    // 使用力导向布局计算节点位置（传入社区信息）
    const layout = new ForceLayout(relationshipData.nodes, relationshipData.edges, communities, width, height);
    positionedNodes = layout.simulate(50);

    // 调试：检查中心节点位置
    const centerNode = positionedNodes.find(n => n.id === 'sumire');
    console.log('Center node position:', centerNode ? { x: centerNode.x, y: centerNode.y } : 'not found');

    // 初始绘制连线
    updateEdges();

    // 缩放和平移变量
    let scale = 1;
    let translateX = 0;
    let translateY = 0;

    // 创建内容容器（用于缩放和平移）
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'network-content';
    contentWrapper.style.position = 'absolute';
    contentWrapper.style.inset = '0';
    contentWrapper.style.transformOrigin = '0 0'; // 从左上角开始缩放
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

        // 为中心节点添加旋转弧线
        if (node.id === 'sumire') {
            // 获取头像圆心位置
            const avatarCenter = getAvatarCenter(node);

            // 创建旋转弧线容器（内圈）
            const orbitRing = document.createElement('div');
            orbitRing.className = 'center-orbit-ring';
            orbitRing.style.position = 'absolute';
            orbitRing.style.left = avatarCenter.x + 'px';
            orbitRing.style.top = avatarCenter.y + 'px';
            orbitRing.style.width = (node.size + 60) + 'px';
            orbitRing.style.height = (node.size + 60) + 'px';
            orbitRing.style.transform = 'translate(-50%, -50%)';
            orbitRing.style.border = '3px solid transparent';
            orbitRing.style.borderTopColor = 'rgba(139, 125, 200, 0.8)';
            orbitRing.style.borderRightColor = 'rgba(139, 125, 200, 0.5)';
            orbitRing.style.borderBottomColor = 'rgba(139, 125, 200, 0.3)';
            orbitRing.style.borderRadius = '50%';
            orbitRing.style.pointerEvents = 'none';
            orbitRing.style.zIndex = '5';
            orbitRing.style.animation = 'rotateOrbit 8s linear infinite';
            orbitRing.style.boxShadow = '0 0 20px rgba(139, 125, 200, 0.6), inset 0 0 20px rgba(139, 125, 200, 0.4)';
            orbitRing.style.filter = 'drop-shadow(0 0 10px rgba(139, 125, 200, 0.8))';

            contentWrapper.appendChild(orbitRing);

            // 添加第二圈（更大、更慢）
            const orbitRing2 = document.createElement('div');
            orbitRing2.className = 'center-orbit-ring';
            orbitRing2.style.position = 'absolute';
            orbitRing2.style.left = avatarCenter.x + 'px';
            orbitRing2.style.top = avatarCenter.y + 'px';
            orbitRing2.style.width = (node.size + 100) + 'px';
            orbitRing2.style.height = (node.size + 100) + 'px';
            orbitRing2.style.transform = 'translate(-50%, -50%)';
            orbitRing2.style.border = '2px solid transparent';
            orbitRing2.style.borderTopColor = 'rgba(139, 125, 200, 0.6)';
            orbitRing2.style.borderLeftColor = 'rgba(139, 125, 200, 0.3)';
            orbitRing2.style.borderRadius = '50%';
            orbitRing2.style.pointerEvents = 'none';
            orbitRing2.style.zIndex = '5';
            orbitRing2.style.animation = 'rotateOrbit 12s linear infinite reverse';
            orbitRing2.style.boxShadow = '0 0 15px rgba(139, 125, 200, 0.4)';
            orbitRing2.style.filter = 'drop-shadow(0 0 8px rgba(139, 125, 200, 0.5))';

            contentWrapper.appendChild(orbitRing2);
        }

        // 拖拽功能
        let isDragging = false;
        let startX, startY;
        let offsetX, offsetY;

        // 鼠标事件
        nodeEl.addEventListener('mousedown', (e) => {
            // 如果是中心节点，只高亮连接，不允许拖动
            if (node.id === 'sumire') {
                highlightConnections(node.id);
                e.preventDefault();

                // 监听 mouseup 事件来恢复
                const clearHighlight = () => {
                    highlightConnections(null);
                    document.removeEventListener('mouseup', clearHighlight);
                };
                document.addEventListener('mouseup', clearHighlight);
                return;
            }

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

            // 边界约束（考虑缩放，缩小时范围更大）
            const baseMargin = containerRect.width < 768 ? 80 : 120;
            const effectiveWidth = containerRect.width / scale;
            const effectiveHeight = containerRect.height / scale;
            const margin = baseMargin;
            node.x = Math.max(margin, Math.min(effectiveWidth - margin, newX));
            node.y = Math.max(margin, Math.min(effectiveHeight - margin, newY));

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
            // 如果是中心节点，不允许拖动
            if (node.id === 'sumire') return;

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

            // 边界约束（考虑缩放，缩小时范围更大）
            const baseMargin = containerRect.width < 768 ? 80 : 120;
            const effectiveWidth = containerRect.width / scale;
            const effectiveHeight = containerRect.height / scale;
            const margin = baseMargin;
            node.x = Math.max(margin, Math.min(effectiveWidth - margin, newX));
            node.y = Math.max(margin, Math.min(effectiveHeight - margin, newY));

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
        // 同时更新SVG尺寸以匹配缩放后的空间
        const effectiveWidth = containerRect.width / scale;
        const effectiveHeight = containerRect.height / scale;
        svg.setAttribute('width', effectiveWidth);
        svg.setAttribute('height', effectiveHeight);
        svg.setAttribute('viewBox', `0 0 ${effectiveWidth} ${effectiveHeight}`);
    }

    // 移动端初始缩放和居中调整
    const isMobile = containerRect.width < 768;
    if (isMobile) {
        scale = 0.7; // 移动端初始缩放到70%，让节点适当分散

        // 计算偏移量，使得缩放后中心节点的头像圆心位于视口中心
        const centerNode = positionedNodes.find(n => n.id === 'sumire');
        if (centerNode) {
            // 获取头像圆心位置（而不是节点容器中心）
            const avatarCenter = getAvatarCenter(centerNode);

            // 缩放后，头像圆心的屏幕位置 = avatarCenter.x * scale + translateX
            // 我们希望它等于 containerRect.width / 2
            // 所以 translateX = containerRect.width / 2 - avatarCenter.x * scale
            translateX = containerRect.width / 2 - avatarCenter.x * scale;
            translateY = containerRect.height / 2 - avatarCenter.y * scale;

            console.log('Mobile initial adjustment:', {
                scale,
                nodeX: centerNode.x,
                nodeY: centerNode.y,
                avatarCenterX: avatarCenter.x,
                avatarCenterY: avatarCenter.y,
                translateX,
                translateY,
                viewportWidth: containerRect.width,
                viewportHeight: containerRect.height,
                expectedScreenX: avatarCenter.x * scale + translateX,
                expectedScreenY: avatarCenter.y * scale + translateY
            });
        }

        updateTransform();
    }

    // 鼠标滚轮缩放
    container.addEventListener('wheel', (e) => {
        e.preventDefault();

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = scale * delta;

        // 限制缩放范围 0.5x - 3x
        if (newScale >= 0.5 && newScale <= 3) {
            // 移动端：以中心节点为缩放中心
            const isMobile = containerRect.width < 768;
            if (isMobile) {
                const centerNode = positionedNodes.find(n => n.id === 'sumire');
                if (centerNode) {
                    // 保持头像圆心在视口中心
                    const avatarCenter = getAvatarCenter(centerNode);
                    scale = newScale;
                    translateX = containerRect.width / 2 - avatarCenter.x * scale;
                    translateY = containerRect.height / 2 - avatarCenter.y * scale;
                }
            } else {
                scale = newScale;
            }
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

                // 移动端：保持头像圆心在视口中心
                const centerNode = positionedNodes.find(n => n.id === 'sumire');
                if (centerNode) {
                    const avatarCenter = getAvatarCenter(centerNode);
                    translateX = containerRect.width / 2 - avatarCenter.x * scale;
                    translateY = containerRect.height / 2 - avatarCenter.y * scale;
                }

                updateTransform();
            }
        }
    }, { passive: false });

    // 响应式调整：重新计算中心位置并调整transform
    let resizeTimer;
    let isResizing = false;

    window.addEventListener('resize', () => {
        // 避免resize期间的重复计算
        if (isResizing) return;

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            isResizing = true;

            const newRect = container.getBoundingClientRect();
            containerRect = newRect;

            // 检测是否为移动端
            const isMobile = containerRect.width < 768;

            // 找到中心节点
            const centerNode = positionedNodes.find(n => n.id === 'sumire');

            if (isMobile && centerNode) {
                // 移动端：重新计算偏移量，保持头像圆心在视口中心
                scale = 0.7;
                const avatarCenter = getAvatarCenter(centerNode);
                translateX = containerRect.width / 2 - avatarCenter.x * scale;
                translateY = containerRect.height / 2 - avatarCenter.y * scale;

                console.log('Resize to mobile:', {
                    viewportWidth: containerRect.width,
                    nodeX: centerNode.x,
                    avatarCenterX: avatarCenter.x,
                    translateX,
                    expectedScreenX: avatarCenter.x * scale + translateX
                });

                updateTransform();
            } else if (!isMobile) {
                // 桌面端：重置为默认
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateTransform();
            }

            isResizing = false;
        }, 100); // 减少防抖时间，更快响应
    });
}

// 页面加载后初始化
if (document.querySelector('.relations-network')) {
    window.addEventListener('load', loadRelationshipData);
}
