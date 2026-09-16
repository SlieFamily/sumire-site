# 人物关系网配置说明

## 核心特性

- 使用力导向布局算法自动计算节点位置
- 自动防止节点重叠
- 移动端和桌面端自动优化布局参数
- 使用贝塞尔曲线连接节点

## 如何修改关系网

编辑 `js/relationship.js` 文件修改人物关系网。

### 添加节点

在 `nodes` 数组中添加或修改：

```javascript
{
    id: 'unique_id',
    name: '显示名称',
    avatar: '头像表情或URL',
    url: 'https://...',
    size: 60,
    color: '#8B7DC8'
}
```

字段说明：
- `id` - 唯一标识符
- `name` - 显示在头像下方的名字
- `avatar` - 表情符号或图片 URL
- `url` - 点击跳转链接（B站空间）
- `size` - 头像大小（像素，推荐 40-70）
- `color` - 头像背景色

系统会自动计算节点位置，无需手动设置 x、y 坐标。

### 添加连线

在 `edges` 数组中添加或修改：

```javascript
{
    from: 'node_id_1',
    to: 'node_id_2',
    label: '关系描述',
    color: '#ff6b6b',
    width: 2
}
```

字段说明：
- `from` - 起始节点 ID
- `to` - 结束节点 ID
- `label` - 连线上的文字标签（可选）
- `color` - 连线颜色
- `width` - 连线宽度

### 使用真实头像

将 `avatar` 字段设为图片 URL：

```javascript
avatar: 'https://i0.hdslb.com/bfs/face/xxx.jpg'
```

## 颜色说明

- 主播（中心节点）：`#8B7DC8`（紫色）
- 好友节点：`#6B9FE8`（蓝色）
- 重要连线：`#ff6b6b`（红色）
- 普通连线：`rgba(255, 255, 255, 0.2)`（半透明白色）

## 布局算法参数

可修改 `ForceLayout` 类中的参数调整布局效果：

### 移动端优化参数

- 屏幕宽度 < 768px 自动切换移动端模式
- 移动端斥力：20000（更强，防止重叠）
- 桌面端斥力：15000
- 移动端安全间距：40px
- 桌面端安全间距：30px

### 关键参数说明

- `iterations` - 迭代次数（默认 100）
- 斥力强度 - 防止节点重叠
- 引力强度 - 连接的节点互相吸引
  - 移动端：`distance * 0.002`
  - 桌面端：`distance * 0.003`
- 向心力 - `dx * 0.0003`（节点向中心聚拢）
- 阻尼 - `0.85`（数值越小，节点移动越慢）
- 边界边距
  - 移动端：80px
  - 桌面端：120px

### 防重叠机制

- 计算节点半径，确保最小安全距离
- 距离小于安全距离时施加强斥力
- 碰撞检测防止节点完全重叠

## 配置示例

### 简单关系网（3个节点）

```javascript
nodes: [
    { id: 'sumire', name: '明日堇', avatar: '头像', url: 'https://...', size: 70, color: '#8B7DC8' },
    { id: 'friend1', name: '好友A', avatar: '头像', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'friend2', name: '好友B', avatar: '头像', url: 'https://...', size: 50, color: '#6B9FE8' }
],
edges: [
    { from: 'sumire', to: 'friend1', label: '好友', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'friend2', label: '好友', color: '#ff6b6b', width: 2 }
]
```

### 复杂关系网（多节点）

```javascript
nodes: [
    { id: 'sumire', name: '明日堇', avatar: '头像', url: 'https://...', size: 70, color: '#8B7DC8' },
    { id: 'f1', name: '好友1', avatar: '头像', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f2', name: '好友2', avatar: '头像', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f3', name: '好友3', avatar: '头像', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f4', name: '好友4', avatar: '头像', url: 'https://...', size: 50, color: '#6B9FE8' },
    { id: 'f5', name: '好友5', avatar: '头像', url: 'https://...', size: 50, color: '#6B9FE8' }
],
edges: [
    { from: 'sumire', to: 'f1', label: '联动', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f2', label: '合作', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f3', label: '好友', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f4', label: '好友', color: '#ff6b6b', width: 2 },
    { from: 'sumire', to: 'f5', label: '好友', color: '#ff6b6b', width: 2 },
    { from: 'f1', to: 'f2', color: 'rgba(255, 255, 255, 0.2)', width: 1 },
    { from: 'f3', to: 'f4', color: 'rgba(255, 255, 255, 0.2)', width: 1 }
]
```

## 注意事项

- 首次加载时自动计算布局，迭代 100 次
- 移动端自动使用更强的防重叠参数
- 响应式调整时会重新计算布局
- 节点数量超过 15 个时建议增加迭代次数
- 所有节点位置由算法自动计算
- 连线使用贝塞尔曲线，自动避开节点中心
