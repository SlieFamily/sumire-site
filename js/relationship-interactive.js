// 人物关系网 - 交互式画布版本

let relationshipData = null;
let positionedNodes = [];
let canvas, svg;
let scale = 1;
let translateX = 0;
let translateY = 0;
let isPanning = false;
let startX, startY;
let activeNodeId = null;

// 从JSON文件加载关系网数据
async function loadRelationshipData() {
    try {
        const response = await fetch('data/relationship.json');
        relationshipData = await response.json();
        initRelationshipNetwork();
    } catch (error) {
        console.error('加载关系网数据失败:', error);
    }
}

// 改进的社区发现算法 - 基于连通分量和共同邻居
function detectCommunities() {
    const nodes = relationshipData.nodes;
    const edges = relationshipData.edges;
    const filteredEdges = edges.filter(e => e.from !== 'sumire' && e.to !== 'sumire');

    // 构建邻接表（不考虑边权重）
    const adjacency = {};
    nodes.forEach(n => {
        if (n.id !== 'sumire') {
            adjacency[n.id] = new Set();
        }
    });

    filteredEdges.forEach(e => {
        if (!adjacency[e.from]) adjacency[e.from] = new Set();
        if (!adjacency[e.to]) adjacency[e.to] = new Set();
        adjacency[e.from].add(e.to);
        adjacency[e.to].add(e.from);
    });

    // 计算两个节点的相似度：共同邻居数量 + 直接连接
    function getSimilarity(nodeA, nodeB) {
        const neighborsA = adjacency[nodeA] || new Set();
        const neighborsB = adjacency[nodeB] || new Set();

        // 如果直接相连，基础分数为10
        let score = neighborsA.has(nodeB) ? 10 : 0;

        // 计算共同邻居数量
        let commonCount = 0;
        neighborsA.forEach(n => {
            if (neighborsB.has(n)) {
                commonCount++;
            }
        });

        // 共同邻居越多，相似度越高
        score += commonCount * 2;

        return score;
    }

    // 使用层次聚类方法
    const nodeToCommunity = {};
    let communityId = 0;

    // 初始化：每个节点自成一个社区
    nodes.forEach(n => {
        if (n.id !== 'sumire') {
            nodeToCommunity[n.id] = communityId++;
        }
    });

    // 迭代合并相似社区
    let improved = true;
    let iterations = 0;
    const maxIterations = 20;

    while (improved && iterations < maxIterations) {
        improved = false;
        iterations++;

        // 计算每对社区之间的相似度
        const communities = {};
        for (const nodeId in nodeToCommunity) {
            const comm = nodeToCommunity[nodeId];
            if (!communities[comm]) {
                communities[comm] = [];
            }
            communities[comm].push(nodeId);
        }

        const commList = Object.entries(communities);
        let bestPair = null;
        let bestScore = 0;

        for (let i = 0; i < commList.length; i++) {
            for (let j = i + 1; j < commList.length; j++) {
                const [comm1Id, comm1Nodes] = commList[i];
                const [comm2Id, comm2Nodes] = commList[j];

                // 计算两个社区之间的总相似度
                let totalSimilarity = 0;
                comm1Nodes.forEach(n1 => {
                    comm2Nodes.forEach(n2 => {
                        totalSimilarity += getSimilarity(n1, n2);
                    });
                });

                // 归一化（除以节点数量的乘积）
                const avgSimilarity = totalSimilarity / (comm1Nodes.length * comm2Nodes.length);

                if (avgSimilarity > bestScore && avgSimilarity > 3) { // 阈值：平均相似度>3才合并
                    bestScore = avgSimilarity;
                    bestPair = [parseInt(comm1Id), parseInt(comm2Id)];
                }
            }
        }

        // 如果找到可以合并的社区对
        if (bestPair) {
            const [comm1, comm2] = bestPair;
            // 将comm2的所有节点合并到comm1
            for (const nodeId in nodeToCommunity) {
                if (nodeToCommunity[nodeId] === comm2) {
                    nodeToCommunity[nodeId] = comm1;
                }
            }
            improved = true;
        }
    }

    // 构建最终社区列表
    const finalCommunities = {};
    for (const nodeId in nodeToCommunity) {
        const comm = nodeToCommunity[nodeId];
        if (!finalCommunities[comm]) {
            finalCommunities[comm] = [];
        }
        finalCommunities[comm].push(nodeId);
    }

    return Object.values(finalCommunities).filter(c => c.length > 0);
}

// 力导向布局算法
class ForceLayout {
    constructor(nodes, edges, communities, width, height) {
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

        // 为每个社区预分配目标角度，让社区均匀分布在中心节点四周
        this.communityAngles = {};
        const numCommunities = this.communities.length;
        this.communities.forEach((community, index) => {
            // 360° 均匀分配，从0°开始
            const targetAngle = (index * 2 * Math.PI) / numCommunities;
            community.forEach(nodeId => {
                this.communityAngles[nodeId] = targetAngle;
            });
        });
    }

    simulate(iterations = 100) {
        const centerNode = this.nodes.find(n => n.fixed);
        if (centerNode) {
            centerNode.x = this.centerX;
            centerNode.y = this.centerY;
        }

        // 为每个社区计算质心引力方向
        const getCommunityCenter = (community) => {
            const communityNodes = community.map(id => this.nodes.find(n => n.id === id)).filter(n => n && !n.fixed);
            if (communityNodes.length === 0) return null;

            let cx = 0, cy = 0;
            communityNodes.forEach(n => {
                cx += n.x;
                cy += n.y;
            });
            return {
                x: cx / communityNodes.length,
                y: cy / communityNodes.length
            };
        };

        for (let iter = 0; iter < iterations; iter++) {
            // 1. 边缘引力 - 有连线的节点互相吸引
            this.edges.forEach(edge => {
                const source = this.nodes.find(n => n.id === edge.from);
                const target = this.nodes.find(n => n.id === edge.to);

                if (!source || !target) return;

                const dx = target.x - source.x;
                const dy = target.y - source.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const optimalDist = 80; // 期望距离
                const force = (dist - optimalDist) * 0.2;
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                if (!source.fixed) {
                    source.vx += fx;
                    source.vy += fy;
                }
                if (!target.fixed) {
                    target.vx -= fx;
                    target.vy -= fy;
                }
            });

            // 2. 社区内聚力 - 同一社区的节点向社区质心聚集
            this.communities.forEach(community => {
                const center = getCommunityCenter(community);
                if (!center) return;

                community.forEach(nodeId => {
                    const node = this.nodes.find(n => n.id === nodeId);
                    if (!node || node.fixed) return;

                    const dx = center.x - node.x;
                    const dy = center.y - node.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                    // 社区内聚力：根据距离调节强度
                    const cohesionStrength = 0.15 * Math.min(1, dist / 100);
                    node.vx += (dx / dist) * cohesionStrength * dist * 0.05;
                    node.vy += (dy / dist) * cohesionStrength * dist * 0.05;
                });
            });

            // 3. 斥力 - 所有节点之间互相排斥，防止重叠
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const n1 = this.nodes[i];
                    const n2 = this.nodes[j];

                    const dx = n2.x - n1.x;
                    const dy = n2.y - n1.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const minDist = (n1.size + n2.size) / 2 + 20;

                    // 使用更强的斥力确保不重叠
                    if (dist < minDist * 2.5) {
                        const repelForce = Math.pow(minDist / dist, 2) * 15;
                        const fx = (dx / dist) * repelForce;
                        const fy = (dy / dist) * repelForce;

                        if (!n1.fixed) {
                            n1.vx -= fx;
                            n1.vy -= fy;
                        }
                        if (!n2.fixed) {
                            n2.vx += fx;
                            n2.vy += fy;
                        }
                    }
                }
            }

            // 4. 径向布局力 - 让节点围绕中心节点环形排列
            this.nodes.forEach(n => {
                if (n.fixed) return;

                const dx = n.x - this.centerX;
                const dy = n.y - this.centerY;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;

                // 理想距离：根据节点数量动态调整，形成合理的环形半径
                const idealRadius = 180 + (this.nodes.length - 1) * 8;

                // 径向力：推动节点到理想半径上
                const radialForce = (dist - idealRadius) * 0.08;
                n.vx -= (dx / dist) * radialForce;
                n.vy -= (dy / dist) * radialForce;

                // 微弱的切向力：让节点沿环形分散，避免堆积
                const tangentX = -dy / dist;
                const tangentY = dx / dist;
                n.vx += tangentX * 0.5;
                n.vy += tangentY * 0.5;
            });

            // 5. 社区角度引导力 - 将每个社区推向其预定的角度方向
            this.nodes.forEach(n => {
                if (n.fixed) return;

                const targetAngle = this.communityAngles[n.id];
                if (targetAngle === undefined) return;

                // 计算节点当前相对中心的角度
                const dx = n.x - this.centerX;
                const dy = n.y - this.centerY;
                const currentAngle = Math.atan2(dy, dx);

                // 计算角度差（考虑周期性）
                let angleDiff = targetAngle - currentAngle;
                // 归一化到 [-π, π]
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

                // 角度引导力：在切向上施加力，让节点朝目标角度移动
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const tangentX = -dy / dist;
                const tangentY = dx / dist;

                // 根据角度差施加切向力
                const angleForce = angleDiff * 2.0; // 调整强度
                n.vx += tangentX * angleForce;
                n.vy += tangentY * angleForce;
            });

            // 6. 应用速度和阻尼
            this.nodes.forEach(n => {
                if (n.fixed) return;

                n.x += n.vx;
                n.y += n.vy;
                n.vx *= 0.8;
                n.vy *= 0.8;

                const margin = 100;
                n.x = Math.max(margin, Math.min(this.width - margin, n.x));
                n.y = Math.max(margin, Math.min(this.height - margin, n.y));
            });

            // 7. 碰撞修正 - 每次迭代都确保不重叠
            for (let collisionIter = 0; collisionIter < 2; collisionIter++) {
                for (let i = 0; i < this.nodes.length; i++) {
                    for (let j = i + 1; j < this.nodes.length; j++) {
                        const n1 = this.nodes[i];
                        const n2 = this.nodes[j];

                        const dx = n2.x - n1.x;
                        const dy = n2.y - n1.y;
                        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                        const minDist = (n1.size + n2.size) / 2 + 15;

                        if (dist < minDist) {
                            const angle = Math.atan2(dy, dx);
                            const overlap = minDist - dist;

                            if (!n1.fixed && !n2.fixed) {
                                const pushDist = overlap / 2;
                                n1.x -= Math.cos(angle) * pushDist;
                                n1.y -= Math.sin(angle) * pushDist;
                                n2.x += Math.cos(angle) * pushDist;
                                n2.y += Math.sin(angle) * pushDist;
                            } else if (n1.fixed && !n2.fixed) {
                                n2.x += Math.cos(angle) * overlap;
                                n2.y += Math.sin(angle) * overlap;
                            } else if (!n1.fixed && n2.fixed) {
                                n1.x -= Math.cos(angle) * overlap;
                                n1.y -= Math.sin(angle) * overlap;
                            }
                        }
                    }
                }
            }
        }

        return this.nodes;
    }
}

// 初始化关系网络
function initRelationshipNetwork() {
    canvas = document.getElementById('network-canvas');
    svg = document.getElementById('network-svg');

    const width = 1000;
    const height = 1000;

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const communities = detectCommunities();
    const layout = new ForceLayout(relationshipData.nodes, relationshipData.edges, communities, width, height);
    positionedNodes = layout.simulate(100);

    renderNetwork();
    setupInteractions();

    // 初始缩放和居中
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        scale = 0.6; // 移动端从0.5改为0.6，配合更小的画布
    } else {
        scale = 0.9; // 桌面端从0.7改为0.9
    }
    centerView();
}

// 渲染网络
function renderNetwork() {
    // 渲染连线
    svg.innerHTML = '';
    relationshipData.edges.forEach((edge, index) => {
        const fromNode = positionedNodes.find(n => n.id === edge.from);
        const toNode = positionedNodes.find(n => n.id === edge.to);

        if (!fromNode || !toNode) return;

        const fromX = fromNode.x;
        const fromY = fromNode.y;
        const toX = toNode.x;
        const toY = toNode.y;

        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const offset = dist * 0.1; // 进一步减小到0.1，弧线更平缓紧凑
        const controlX = midX - dy / dist * offset;
        const controlY = midY + dx / dist * offset;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

        path.setAttribute('d', d);
        path.setAttribute('class', 'edge-line');
        path.setAttribute('data-from', edge.from);
        path.setAttribute('data-to', edge.to);
        path.setAttribute('data-index', index);

        svg.appendChild(path);
    });

    // 渲染节点
    positionedNodes.forEach(node => {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'node';
        nodeEl.dataset.nodeId = node.id;
        if (node.fixed) {
            nodeEl.dataset.type = 'center';
        }
        nodeEl.style.left = node.x + 'px';
        nodeEl.style.top = node.y + 'px';

        const avatar = document.createElement('div');
        avatar.className = 'node-avatar';
        avatar.style.width = node.size + 'px';
        avatar.style.height = node.size + 'px';

        if (node.avatar) {
            const img = document.createElement('img');
            img.src = node.avatar;
            img.alt = node.name;
            img.draggable = false; // 禁止图片拖动
            img.style.pointerEvents = 'none'; // 禁止图片拦截鼠标事件
            img.onerror = () => {
                // 如果图片加载失败，显示占位符
                avatar.innerHTML = '👤';
                avatar.style.fontSize = (node.size * 0.5) + 'px';
                avatar.style.display = 'flex';
                avatar.style.alignItems = 'center';
                avatar.style.justifyContent = 'center';
            };
            avatar.appendChild(img);
        } else {
            avatar.textContent = '👤';
            avatar.style.fontSize = (node.size * 0.5) + 'px';
        }

        const label = document.createElement('div');
        label.className = 'node-label';
        label.textContent = node.name;

        nodeEl.appendChild(avatar);
        nodeEl.appendChild(label);

        // 移除URL跳转功能，节点不再点击跳转

        canvas.appendChild(nodeEl);

        // 为中心节点添加旋转光环（围绕头像圆心，不包括下方文字）
        if (node.fixed) {
            const labelHeight = 30; // 估算label的高度

            const orbitRing1 = document.createElement('div');
            orbitRing1.className = 'center-orbit-ring ring-1';
            orbitRing1.style.left = node.x + 'px';
            orbitRing1.style.top = (node.y - labelHeight / 2) + 'px'; // 向上偏移label一半高度
            orbitRing1.style.width = (node.size + 60) + 'px';
            orbitRing1.style.height = (node.size + 60) + 'px';

            canvas.appendChild(orbitRing1);

            const orbitRing2 = document.createElement('div');
            orbitRing2.className = 'center-orbit-ring ring-2';
            orbitRing2.style.left = node.x + 'px';
            orbitRing2.style.top = (node.y - labelHeight / 2) + 'px'; // 向上偏移label一半高度
            orbitRing2.style.width = (node.size + 100) + 'px';
            orbitRing2.style.height = (node.size + 100) + 'px';

            canvas.appendChild(orbitRing2);
        }

        // 节点拖动
        setupNodeDrag(nodeEl, node);
    });
}

// 设置节点拖动
function setupNodeDrag(nodeEl, node) {
    if (node.fixed) {
        // 中心节点只高亮连接
        nodeEl.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            highlightConnections(node.id);
        });
        nodeEl.addEventListener('mouseup', () => {
            highlightConnections(null);
        });
        return;
    }

    let isDragging = false;
    let dragStartX, dragStartY;
    let nodeStartX, nodeStartY;

    nodeEl.style.cursor = 'grab'; // 默认显示可抓取光标
    nodeEl.style.userSelect = 'none'; // 禁止选中文本
    nodeEl.style.webkitUserSelect = 'none';

    // PC端鼠标拖动
    nodeEl.addEventListener('mousedown', (e) => {
        e.preventDefault(); // 阻止默认拖动行为
        e.stopPropagation();
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        nodeStartX = node.x;
        nodeStartY = node.y;
        nodeEl.style.cursor = 'grabbing';
        highlightConnections(node.id);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const dx = (e.clientX - dragStartX) / scale;
        const dy = (e.clientY - dragStartY) / scale;

        let newX = nodeStartX + dx;
        let newY = nodeStartY + dy;

        // 碰撞检测 - 防止节点重叠（包括与中心节点和所有其他节点）
        positionedNodes.forEach(otherNode => {
            if (otherNode.id === node.id) return;

            const dx = newX - otherNode.x;
            const dy = newY - otherNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = (node.size + otherNode.size) / 2 + 15; // 最小间距，确保不重叠

            if (dist < minDist) {
                // 产生碰撞，推开被拖动的节点
                const angle = Math.atan2(dy, dx);
                newX = otherNode.x + Math.cos(angle) * minDist;
                newY = otherNode.y + Math.sin(angle) * minDist;
            }
        });

        node.x = newX;
        node.y = newY;

        nodeEl.style.left = node.x + 'px';
        nodeEl.style.top = node.y + 'px';

        updateEdges();
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            nodeEl.style.cursor = 'grab';
            highlightConnections(null);
        }
    });

    // 移动端触摸拖动
    nodeEl.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        isDragging = true;
        const touch = e.touches[0];
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;
        nodeStartX = node.x;
        nodeStartY = node.y;
        highlightConnections(node.id);
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        const touch = e.touches[0];
        const dx = (touch.clientX - dragStartX) / scale;
        const dy = (touch.clientY - dragStartY) / scale;

        let newX = nodeStartX + dx;
        let newY = nodeStartY + dy;

        // 碰撞检测 - 防止节点重叠（包括与中心节点和所有其他节点）
        positionedNodes.forEach(otherNode => {
            if (otherNode.id === node.id) return;

            const dx = newX - otherNode.x;
            const dy = newY - otherNode.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = (node.size + otherNode.size) / 2 + 15; // 最小间距，确保不重叠

            if (dist < minDist) {
                // 产生碰撞，推开被拖动的节点
                const angle = Math.atan2(dy, dx);
                newX = otherNode.x + Math.cos(angle) * minDist;
                newY = otherNode.y + Math.sin(angle) * minDist;
            }
        });

        node.x = newX;
        node.y = newY;

        nodeEl.style.left = node.x + 'px';
        nodeEl.style.top = node.y + 'px';

        updateEdges();
    });

    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            highlightConnections(null);
        }
    });
}

// 高亮显示连接
function highlightConnections(nodeId) {
    activeNodeId = nodeId;

    const edges = svg.querySelectorAll('.edge-line');
    edges.forEach(edge => {
        const from = edge.getAttribute('data-from');
        const to = edge.getAttribute('data-to');

        edge.classList.remove('highlighted', 'dimmed');

        if (nodeId && (from === nodeId || to === nodeId)) {
            edge.classList.add('highlighted');
        } else if (nodeId) {
            edge.classList.add('dimmed');
        }
    });
}

// 更新连线
function updateEdges() {
    relationshipData.edges.forEach((edge, index) => {
        const fromNode = positionedNodes.find(n => n.id === edge.from);
        const toNode = positionedNodes.find(n => n.id === edge.to);

        if (!fromNode || !toNode) return;

        const fromX = fromNode.x;
        const fromY = fromNode.y;
        const toX = toNode.x;
        const toY = toNode.y;

        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const offset = dist * 0.1; // 进一步减小到0.1，弧线更平缓紧凑
        const controlX = midX - dy / dist * offset;
        const controlY = midY + dx / dist * offset;

        const path = svg.querySelector(`[data-index="${index}"]`);
        if (path) {
            const d = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
            path.setAttribute('d', d);
        }
    });
}

// 设置交互
function setupInteractions() {
    const container = document.getElementById('canvas-container');

    // 画布拖动
    container.addEventListener('mousedown', (e) => {
        if (e.target === container || e.target === canvas || e.target === svg) {
            isPanning = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            container.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isPanning) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            container.style.cursor = 'grab';
        }
    });

    // 鼠标滚轮缩放
    container.addEventListener('wheel', (e) => {
        e.preventDefault();

        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = scale * delta;

        if (newScale >= 0.3 && newScale <= 3) {
            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            translateX = mouseX - (mouseX - translateX) * (newScale / scale);
            translateY = mouseY - (mouseY - translateY) * (newScale / scale);
            scale = newScale;

            updateTransform();
        }
    }, { passive: false });

    // 触摸拖动
    let touchStartX = 0;
    let touchStartY = 0;
    let isTouching = false;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            // 单指拖动
            isTouching = true;
            touchStartX = e.touches[0].clientX - translateX;
            touchStartY = e.touches[0].clientY - translateY;
        } else if (e.touches.length === 2) {
            // 双指缩放
            isTouching = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialDistance = Math.sqrt(dx * dx + dy * dy);
            initialScale = scale;
        }
    });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isTouching) {
            // 单指拖动
            e.preventDefault();
            translateX = e.touches[0].clientX - touchStartX;
            translateY = e.touches[0].clientY - touchStartY;
            updateTransform();
        } else if (e.touches.length === 2) {
            // 双指缩放
            e.preventDefault();

            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const newScale = initialScale * (distance / initialDistance);

            if (newScale >= 0.3 && newScale <= 3) {
                scale = newScale;
                updateTransform();
            }
        }
    }, { passive: false });

    container.addEventListener('touchend', () => {
        isTouching = false;
    });

    // 缩放按钮
    document.getElementById('zoom-in').addEventListener('click', () => {
        const newScale = scale * 1.2;
        if (newScale <= 3) {
            scale = newScale;
            updateTransform();
        }
    });

    document.getElementById('zoom-reset').addEventListener('click', () => {
        centerView();
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        const newScale = scale * 0.8;
        if (newScale >= 0.3) {
            scale = newScale;
            updateTransform();
        }
    });
}

// 更新变换
function updateTransform() {
    canvas.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// 居中视图
function centerView() {
    const container = document.getElementById('canvas-container');
    const rect = container.getBoundingClientRect();

    const centerNode = positionedNodes.find(n => n.fixed);
    if (centerNode) {
        const isMobile = window.innerWidth < 768;
        scale = isMobile ? 0.6 : 0.8;
        translateX = rect.width / 2 - centerNode.x * scale;
        translateY = rect.height / 2 - centerNode.y * scale;
        updateTransform();
    }
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', loadRelationshipData);
