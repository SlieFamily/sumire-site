# 人物关系网配置说明

## 如何修改关系网

编辑 `js/relationship.js` 文件即可修改人物关系网。

**核心特性**：
- 使用力导向布局算法自动计算节点位置
- 自动防止节点重叠
- 移动端和桌面端自动优化布局参数
- 使用贝塞尔曲线连接节点


### 添加/修改节点

在 `nodes` 数组中添加或修改：

```javascript
{
    id: 'unique_id',        // 唯一标识符
    name: '显示名称',        // 显示在头像下方的名字
    avatar: '👤',           // 头像（可以是表情符号或图片URL）
    url: 'https://...',    // 点击跳转的链接（通常是B站空间）
    size: 60,              // 头像大小（像素，推荐40-70）
    color: '#8B7DC8'       // 头像背景色
}
```

**注意**：不再需要手动设置 x、y 坐标，系统会自动计算最优位置！

### 添加/修改连线

在 `edges` 数组中添加或修改：

```javascript
{
    from: 'node_id_1',              // 起始节点ID
    to: 'node_id_2',                // 结束节点ID
    label: '关系描述',               // 连线上的文字标签（可选）
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

**移动端优化参数**：
- 检测屏幕宽度 < 768px 自动切换为移动端模式
- 移动端斥力：20000（更强，防止重叠）
- 桌面端斥力：15000
- 移动端安全间距：40px
- 桌面端安全间距：30px

**关键参数说明**：
- `iterations`：迭代次数（默认100，数值越大越稳定）
- 斥力强度：防止节点重叠，距离太近时施加更强斥力
- 引力强度：连接的节点互相吸引
  - 移动端：`distance * 0.002`
  - 桌面端：`distance * 0.003`
- 向心力：`dx * 0.0003`（节点向中心聚拢）
- 阻尼：`0.85`（数值越小，节点移动越慢）
- 边界边距：
  - 移动端：80px
  - 桌面端：120px

**防重叠机制**：
- 计算节点半径，确保最小安全距离
- 距离小于安全距离时施加强斥力
- 碰撞检测防止节点完全重叠

## 示例

### 简单的关系网（3个节点）

```javascript
nodes: [
    { id: 'sumire', name: '明日堇', avatar: '👤', url: 'https://...', size: 70, color: '#8B7DC8' },
    { id: 'friend1', name: '好友A', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'friend2', name: '好友B', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' }
],
edges: [
    { from: 'sumire', to: 'friend1', label: '好友', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'friend2', label: '好友', color: '#ff6b6b', width: 2 }
]
```

### 复杂的关系网（多节点多连接）

```javascript
nodes: [
    { id: 'sumire', name: '明日堇', avatar: '👤', url: 'https://...', size: 70, color: '#8B7DC8' },
    { id: 'f1', name: '好友1', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f2', name: '好友2', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f3', name: '好友3', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f4', name: '好友4', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f5', name: '好友5', avatar: '👥', url: 'https://...', size: 50, color: '#6B9FE8' }
],
edges: [
    // 主播连接到所有好友
    { from: 'sumire', to: 'f1', label: '联动', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f2', label: '合作', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f3', label: '好友', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f4', label: '好友', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f5', label: '好友', color: '#ff6b6b', width: 2 },
    // 好友之间的关系
    { from: 'f1', to: 'f2', color: 'rgba(255, 255, 255, 0.2)', width: 1 },
    { from: 'f3', to: 'f4', color: 'rgba(255, 255, 255, 0.2)', width: 1 }
]
```

## 注意事项

- 首次加载时会自动计算布局，迭代100次
- 移动端自动使用更强的防重叠参数
- 响应式调整时会重新计算布局
- 节点数量过多（>15个）时建议增加迭代次数
- 所有节点位置由算法自动计算，无需手动设置坐标
- 连线使用贝塞尔曲线，自动避开节点中心
