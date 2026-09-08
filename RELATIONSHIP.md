# 人物关系网配置说明

## 如何修改关系网

编辑 `js/relationship.js` 文件即可修改人物关系网。

## ✨ 新特性：自动布局

**不需要手动设置 x, y 坐标！**

系统会使用力导向图算法自动计算每个节点的最佳位置：
- 节点之间会自动保持适当距离
- 有连接关系的节点会相互靠近
- 主播节点可以固定在中心
- 其他节点自动环绕分布

### 添加/修改节点

在 `nodes` 数组中添加或修改：

```javascript
{
    id: 'unique_id',        // 唯一标识符
    name: '显示名称',        // 显示在头像下方的名字
    avatar: '👤',           // 头像（可以是表情符号或图片URL）
    url: 'https://...',    // 点击跳转的链接（通常是B站空间）
    size: 60,              // 头像大小（像素）
    color: '#8B7DC8',      // 头像背景色
    fixed: false           // 是否固定在中心（可选，默认false）
}
```

**不再需要设置 `x` 和 `y` 坐标！**

### 固定主播在中心

设置 `fixed: true` 可以让节点固定在中心位置：

```javascript
{
    id: 'sumire',
    name: '明日堇sumire',
    avatar: '👤',
    url: 'https://space.bilibili.com/13271481',
    size: 70,
    color: '#8B7DC8',
    fixed: true  // 固定在中心
}
```

### 添加/修改连线

在 `edges` 数组中添加或修改：

```javascript
{
    from: 'node_id_1',              // 起始节点ID
    to: 'node_id_2',                // 结束节点ID
    color: '#ff6b6b',               // 连线颜色
    width: 2                        // 连线宽度
}
```

### 使用真实头像

将 `avatar` 字段改为图片URL：

```javascript
avatar: 'https://i0.hdslb.com/bfs/face/xxx.jpg'
```

### 颜色说明

- 主播（中心节点）：`#8B7DC8`（紫色）
- 好友节点：`#6B9FE8`（蓝色）
- 重要连线：`#ff6b6b`（红色）
- 普通连线：`rgba(255, 255, 255, 0.2)`（半透明白色）

### 调整布局算法参数

如果需要调整自动布局的效果，可以修改 `ForceLayout` 类中的参数：

- `iterations`：迭代次数（默认150，数值越大越稳定但计算时间越长）
- 斥力强度：`5000 / (distance * distance)`（数值越大，节点间距越大）
- 引力强度：`distance * 0.01`（数值越大，连接的节点越靠近）
- 向心力：`dx * 0.001`（数值越大，节点越向中心聚拢）
- 阻尼：`0.8`（数值越小，节点移动越慢，越稳定）

## 示例

### 简单的关系网（3个节点）

```javascript
nodes: [
    { id: 'sumire', name: '明日堇', avatar: '👤', url: 'https://...', size: 70, color: '#8B7DC8', fixed: true },
    { id: 'friend1', name: '好友A', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'friend2', name: '好友B', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' }
],
edges: [
    { from: 'sumire', to: 'friend1', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'friend2', color: '#ff6b6b', width: 2 }
]
```

### 复杂的关系网（多节点多连接）

```javascript
nodes: [
    { id: 'sumire', name: '明日堇', avatar: '👤', url: 'https://...', size: 70, color: '#8B7DC8', fixed: true },
    { id: 'f1', name: '好友1', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f2', name: '好友2', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f3', name: '好友3', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f4', name: '好友4', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f5', name: '好友5', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' }
],
edges: [
    // 主播连接到所有好友
    { from: 'sumire', to: 'f1', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f2', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f3', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f4', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f5', color: '#ff6b6b', width: 2 },
    // 好友之间的关系
    { from: 'f1', to: 'f2', color: 'rgba(255, 255, 255, 0.2)', width: 1 },
    { from: 'f3', to: 'f4', color: 'rgba(255, 255, 255, 0.2)', width: 1 }
]
```

## 注意事项

- 第一次加载时会计算布局，可能需要几毫秒
- 节点数量过多（>20个）时可能需要增加迭代次数
- 响应式调整时会重新计算布局，有轻微延迟
- 建议主播节点设置 `fixed: true` 以保持中心位置
