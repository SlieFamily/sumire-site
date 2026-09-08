# 数据自动化配置说明

## 📁 数据文件位置

所有数据配置文件都在 `data/` 文件夹中：

```
data/
├── songs.json          # 音乐列表
├── costumes.json       # 皮套列表
├── gallery.json        # 画廊列表
└── relationship.json   # 人物关系网
```

## 🎵 音乐列表（songs.json）

### 添加歌曲

编辑 `data/songs.json`，添加新歌曲：

```json
{
  "id": 9,
  "title": "歌曲名称",
  "artist": "明日堇sumire",
  "type": "原创",
  "lang": "zh",
  "duration": "03:45",
  "url": "https://www.bilibili.com/video/BV..."
}
```

### 字段说明

- `id`: 唯一ID（数字）
- `title`: 歌曲名称
- `artist`: 演唱者
- `type`: 类型（原创/翻唱/合唱）
- `lang`: 语言（zh=中文, ja=日语, en=英语）
- `duration`: 时长（格式：MM:SS）
- `url`: B站视频链接

## 👗 皮套列表（costumes.json）

### 添加皮套

编辑 `data/costumes.json`，添加新皮套：

```json
{
  "id": "costume-2024-09",
  "title": "秋日套装",
  "date": "2024.09",
  "year": 2024,
  "image": "costume-2024-autumn.jpg",
  "badge": "NEW",
  "badgeType": "new",
  "tags": ["秋季", "限定"]
}
```

### 字段说明

- `id`: 唯一ID
- `title`: 皮套名称
- `date`: 发布日期
- `year`: 年份（用于分组）
- `image`: 图片文件名（放在 `assets/images/costumes/` 文件夹）
- `badge`: 徽章文字（可选）
- `badgeType`: 徽章类型（new/hot/classic，可选）
- `tags`: 标签数组

### 图片要求

- 位置：`assets/images/costumes/`
- 格式：JPG/PNG
- 推荐尺寸：宽度800px以上
- 比例：3:4（竖图）

## 🖼️ 画廊列表（gallery.json）

### 添加图片

编辑 `data/gallery.json`，添加新图片：

```json
{
  "id": "fanart-006",
  "image": "fanart-006.jpg",
  "category": "fanart",
  "title": "插画作品6"
}
```

### 字段说明

- `id`: 唯一ID
- `image`: 图片文件名（放在 `assets/images/gallery/` 文件夹）
- `category`: 分类（fanart=插画, emoji=表情包, comic=漫画）
- `title`: 图片标题

### 图片要求

- 位置：`assets/images/gallery/`
- 格式：JPG/PNG
- 推荐尺寸：正方形或宽图
- 文件名：使用英文和数字

## 🌐 人物关系网（relationship.json）

### 添加节点

编辑 `data/relationship.json`，在 `nodes` 数组中添加：

```json
{
  "id": "friend5",
  "name": "好友E",
  "avatar": "https://i0.hdslb.com/bfs/face/xxx.jpg",
  "url": "https://space.bilibili.com/12345",
  "size": 50,
  "color": "#6B9FE8"
}
```

### 添加连线

在 `edges` 数组中添加：

```json
{
  "from": "sumire",
  "to": "friend5",
  "color": "#ff6b6b",
  "width": 2
}
```

### 字段说明

**节点（nodes）**：
- `id`: 唯一ID
- `name`: 显示名称
- `avatar`: 头像URL（B站头像链接）
- `url`: B站空间链接
- `size`: 头像大小（像素）
- `color`: 背景色
- `fixed`: 是否固定在中心（可选，默认false）

**连线（edges）**：
- `from`: 起始节点ID
- `to`: 目标节点ID
- `color`: 连线颜色
- `width`: 连线宽度

## 🔄 自动更新机制

### 页面加载时自动读取

所有页面会在加载时自动读取对应的JSON文件：

- `music.html` → 读取 `data/songs.json`
- `costumes.html` → 读取 `data/costumes.json`
- `gallery.html` → 读取 `data/gallery.json`
- `index.html` → 读取 `data/relationship.json`

### 图片不存在时的处理

- 皮套页面：显示 👗 占位符
- 画廊页面：显示对应分类的表情符号
- 关系网：使用URL中的头像

## ✅ 维护流程

### 添加新歌曲

1. 编辑 `data/songs.json`
2. 添加歌曲信息
3. 刷新页面即可看到

### 添加新皮套

1. 准备图片，放入 `assets/images/costumes/`
2. 编辑 `data/costumes.json`
3. 添加皮套信息（包括图片文件名）
4. 刷新页面即可看到

### 添加画廊图片

1. 准备图片，放入 `assets/images/gallery/`
2. 编辑 `data/gallery.json`
3. 添加图片信息
4. 刷新页面即可看到

### 修改人物关系网

1. 编辑 `data/relationship.json`
2. 添加或修改节点和连线
3. 刷新页面即可看到

## ⚠️ 注意事项

1. **JSON格式**：确保JSON格式正确，可用在线工具验证
2. **文件名**：使用英文和数字，避免特殊字符
3. **图片路径**：确保图片文件存在且路径正确
4. **ID唯一性**：每个项目的ID必须唯一
5. **备份**：修改前建议备份JSON文件

## 🚀 优点

✅ 无需修改HTML代码  
✅ 数据与页面分离  
✅ 易于维护和更新  
✅ 支持批量操作  
✅ 自动容错处理  


## 🎮 游戏列表（games.json）

### 添加游戏

编辑 `data/games.json`，添加新游戏：

```json
{
  "id": "game-id",
  "name": "游戏中文名",
  "nameEn": "Game English Name",
  "description": "游戏类型或描述",
  "image": "game-image.jpg"
}
```

### 字段说明

- `id`: 唯一ID（英文）
- `name`: 游戏中文名
- `nameEn`: 游戏英文名（悬停时显示）
- `description`: 游戏描述或类型
- `image`: 图片文件名（放在 `assets/images/games/` 文件夹）

### 图片要求

- 位置：`assets/images/games/`
- 格式：JPG/PNG
- 推荐尺寸：正方形（500x500px 或更大）
- 文件名：使用英文和数字，如 `valorant.jpg`

### 如何获取游戏图片

1. **官方素材**：从游戏官网下载高清图片
2. **Steam/Epic**：从游戏商店页面下载封面图
3. **搜索引擎**：搜索"游戏名 logo"或"游戏名 wallpaper"
4. **裁剪处理**：使用图片编辑工具裁剪为正方形

### 悬停效果

- 默认：只显示游戏图片
- 悬停：显示半透明遮罩 + 游戏名 + 英文名 + 描述
- 过渡动画：平滑淡入淡出

