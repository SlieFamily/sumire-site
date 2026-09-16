# 数据配置说明

## 数据文件位置

所有数据配置文件位于 `public/data/` 目录：

```
public/data/
├── songs.json          # 歌曲列表
├── costumes.json       # 皮套列表
├── gallery.json        # 画廊作品
├── relationship.json   # 人物关系网
├── creators.json       # 创作者信息
├── games.json          # 游戏列表
└── changelog.json      # 更新日志
```

## 歌曲列表（songs.json）

### 数据结构

```json
{
  "songs": [
    {
      "id": 1,
      "title": "歌曲名称",
      "artist": "明日堇sumire",
      "type": "原创",
      "language": "zh",
      "duration": "03:45",
      "url": "https://www.bilibili.com/video/BV..."
    }
  ]
}
```

### 字段说明

- `id` - 唯一标识符（数字）
- `title` - 歌曲名称
- `artist` - 演唱者
- `type` - 类型（原创、翻唱、合唱）
- `language` - 语言代码（zh=中文, ja=日语, en=英语）
- `duration` - 时长（格式：MM:SS）
- `url` - B站视频链接

## 皮套列表（costumes.json）

### 数据结构

```json
{
  "costumes": [
    {
      "id": 1,
      "name": "皮套名称",
      "date": "2024-08",
      "year": 2024,
      "image": "/assets/images/costumes/costume1.jpg",
      "tags": ["标签1", "标签2"],
      "isNew": true,
      "description": "描述文字"
    }
  ]
}
```

### 字段说明

- `id` - 唯一标识符
- `name` - 皮套名称
- `date` - 发布日期（YYYY-MM 格式）
- `year` - 年份（用于时间线分组）
- `image` - 图片路径（相对于网站根目录）
- `tags` - 标签数组
- `isNew` - 是否显示 NEW 徽章（可选）
- `description` - 描述文字（可选）

### 图片要求

- 位置：`assets/images/costumes/`
- 格式：JPG、PNG、WebP
- 推荐尺寸：宽度 800px 以上
- 建议比例：3:4（竖图）

## 画廊作品（gallery.json）

### 数据结构

```json
{
  "gallery": [
    {
      "id": 1,
      "title": "作品标题",
      "author": "作者名",
      "date": "2024-08-15",
      "category": "illustration",
      "image": "/assets/images/gallery/image1.jpg",
      "authorUrl": "https://space.bilibili.com/..."
    }
  ]
}
```

### 字段说明

- `id` - 唯一标识符
- `title` - 作品标题
- `author` - 作者名称
- `date` - 发布日期（YYYY-MM-DD 格式）
- `category` - 分类（illustration=插画, emoji=表情包, comic=漫画）
- `image` - 图片路径
- `authorUrl` - 作者主页链接（可选）

### 图片要求

- 位置：`assets/images/gallery/`
- 格式：JPG、PNG、WebP
- 推荐尺寸：最大边 1200px

## 人物关系网（relationship.json）

### 数据结构

```json
{
  "nodes": [
    {
      "id": "sumire",
      "name": "明日堇",
      "avatar": "https://...",
      "url": "https://space.bilibili.com/...",
      "type": "center"
    }
  ],
  "links": [
    {
      "source": "sumire",
      "target": "friend1",
      "relationship": "关系描述"
    }
  ]
}
```

### 字段说明

**节点（nodes）**：
- `id` - 唯一标识符
- `name` - 显示名称
- `avatar` - 头像 URL
- `url` - B站空间链接
- `type` - 节点类型（center=中心节点, person=普通节点）

**连线（links）**：
- `source` - 起始节点 ID
- `target` - 目标节点 ID
- `relationship` - 关系描述文字

力导向布局算法会自动计算节点位置和连线路径。

## 创作者信息（creators.json）

### 数据结构

```json
{
  "creators": [
    {
      "id": "creator1",
      "name": "创作者名称",
      "role": "角色/职位",
      "avatar": "https://...",
      "url": "https://space.bilibili.com/..."
    }
  ]
}
```

## 游戏列表（games.json）

### 数据结构

```json
{
  "games": [
    {
      "id": "valorant",
      "name": "瓦罗兰特",
      "nameEn": "VALORANT",
      "category": "FPS",
      "icon": "🎮"
    }
  ]
}
```

## 更新日志（changelog.json）

### 数据结构

```json
{
  "versions": [
    {
      "version": "1.1.0",
      "date": "2024-09-16",
      "title": "版本标题",
      "sections": [
        {
          "type": "新增",
          "items": ["新功能描述"]
        },
        {
          "type": "优化",
          "items": ["优化内容描述"]
        },
        {
          "type": "修复",
          "items": ["修复问题描述"]
        }
      ]
    }
  ]
}
```

### 字段说明

- `version` - 版本号（语义化版本）
- `date` - 发布日期（YYYY-MM-DD 格式）
- `title` - 版本标题
- `sections` - 更新内容分组
  - `type` - 更新类型（新增、优化、修复、变更）
  - `items` - 更新条目数组

## 数据更新流程

### 修改数据后

1. 编辑对应的 JSON 文件
2. 保存文件
3. 运行 `npm run build` 重新构建
4. 部署更新后的 `dist/` 目录

### 本地测试

```bash
npm run dev
```

访问 `http://localhost:8000` 查看效果。

## 注意事项

1. JSON 格式必须正确，建议使用 JSON 验证工具检查
2. 文件名使用英文和数字，避免特殊字符
3. 图片路径确保正确，使用相对路径或绝对路径
4. ID 必须唯一，避免重复
5. 修改前建议备份原文件
6. 日期格式统一使用 ISO 8601 标准

## 优点

- 数据与页面分离，便于维护
- 无需修改 HTML 代码
- 支持批量操作
- 易于版本控制
- 自动容错处理