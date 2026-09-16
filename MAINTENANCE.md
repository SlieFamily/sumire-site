# 网站维护文档

## 项目结构

```
sumire-site/
├── public/
│   └── data/                      # 静态数据文件（JSON）
│       ├── gallery.json           # 画廊数据
│       ├── costumes.json          # 皮套数据
│       ├── songs.json             # 歌曲数据
│       ├── creators.json          # 创作者数据
│       ├── games.json             # 游戏数据
│       ├── relationship.json      # 人物关系数据
│       └── changelog.json         # 更新日志数据
├── css/
│   ├── style.css                  # 全局样式和主页样式
│   ├── pages.css                  # 通用页面样式
│   ├── mobile.css                 # 移动端响应式样式
│   ├── about.css                  # 关于页面样式
│   ├── changelog.css              # 更新日志页面样式
│   ├── costumes.css               # 皮套页面样式
│   ├── gallery.css                # 画廊页面样式
│   └── music.css                  # 音乐页面样式
├── js/
│   ├── main.js                    # 核心功能
│   ├── changelog-loader.js        # 更新日志加载器
│   ├── costumes-loader.js         # 皮套数据加载器
│   ├── gallery-loader.js          # 画廊数据加载器
│   ├── music-loader.js            # 音乐数据加载器
│   └── relationship-interactive.js # 人物关系网（D3.js 力导向布局）
├── assets/
│   ├── fonts/                     # 本地字体资源
│   │   ├── fonts.css
│   │   ├── inter-*.ttf            # Interface 字体
│   │   ├── zcool-xiaowei.ttf      # 标题字体
│   │   └── noto-serif-sc-*.otf    # 正文字体
│   └── images/
│       ├── avatar/                # 头像图片
│       ├── gallery/               # 画廊图片
│       └── costumes/              # 皮套图片
├── scripts/
│   ├── generate-thumbnails.js     # 缩略图生成脚本
│   └── compress_avatars.js        # 头像压缩脚本
├── index.html                     # 主页
├── music.html                     # 歌曲页面
├── costumes.html                  # 皮套页面
├── gallery.html                   # 画廊页面
├── about.html                     # 关于页面
├── changelog.html                 # 更新日志页面
├── relationship-interactive.html  # 人物关系网页面
├── architecture-interactive.html  # 架构图页面
├── vite.config.js                 # Vite 构建配置
├── vercel.json                    # Vercel 部署配置
└── package.json                   # 项目依赖配置
```

## 内容更新指南

### 1. 更新歌曲列表

编辑 `public/data/songs.json`：

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

语言代码：`zh` (中文)、`ja` (日语)、`en` (英语)

### 2. 更新皮套展示

编辑 `public/data/costumes.json`：

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

### 3. 更新画廊作品

编辑 `public/data/gallery.json`：

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

分类类型：`illustration` (插画)、`emoji` (表情包)、`comic` (漫画)

### 4. 更新人物关系网

编辑 `public/data/relationship.json`：

```json
{
  "nodes": [
    {
      "id": "friend1",
      "name": "UP主名字",
      "avatar": "https://...",
      "url": "https://space.bilibili.com/...",
      "type": "person"
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

力导向布局算法会自动计算节点位置，无需手动指定坐标。

### 5. 更新创作者信息

编辑 `public/data/creators.json`：

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

### 6. 更新游戏信息

编辑 `public/data/games.json`：

```json
{
  "games": [
    {
      "id": "game1",
      "name": "游戏名称",
      "icon": "🎮",
      "category": "类型"
    }
  ]
}
```

### 7. 添加更新日志

编辑 `public/data/changelog.json`：

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
          "items": [
            "新功能描述"
          ]
        },
        {
          "type": "优化",
          "items": [
            "优化内容描述"
          ]
        },
        {
          "type": "修复",
          "items": [
            "修复问题描述"
          ]
        }
      ]
    }
  ]
}
```

## 开发与构建

### 开发环境

```bash
# 启动开发服务器（端口 8000）
npm run dev

# 访问
http://localhost:8000
```

开发模式特性：
- 热更新（修改代码自动刷新）
- 源码调试支持
- 快速编译

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

构建输出在 `dist/` 目录，包含：
- 文件名哈希（自动缓存失效）
- 代码压缩和优化
- 资源分块加载

### 图片处理

```bash
# 生成缩略图
npm run thumbnails

# 压缩头像
npm run avatars
```

## 样式配置

### 颜色主题

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #8B7DC8;      /* 主色（紫色）*/
    --secondary-color: #6B9FE8;    /* 辅助色（蓝色）*/
    --accent-color: #B794F6;       /* 强调色（淡紫）*/
    --dark-bg: #0c0505;            /* 深色背景 */
    --darker-bg: #000000;          /* 更深背景 */
}
```

### 字体配置

项目使用三种字体系统：

- **标题字体**（`--font-title`）：ZCOOL XiaoWei
  - 用于页面标题、章节标题、卡片标题
  
- **正文字体**（`--font-body`）：Noto Serif SC
  - 用于正文内容、段落、描述文字

- **界面字体**（`--font-interface`）：Inter
  - 用于按钮、标签、导航栏

字体定义在 `assets/fonts/fonts.css`，所有字体文件本地化存储。

### 响应式断点

```css
/* 移动端 */
@media (max-width: 768px) { }

/* 平板 */
@media (max-width: 1024px) { }

/* 超小屏幕 */
@media (max-width: 480px) { }
```
