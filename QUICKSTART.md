# 明日堇sumire个人网站 - 快速开始

## 🎯 项目概述

这是为哔哩哔哩虚拟主播"明日堇sumire"制作的个人网站，采用紫蓝渐变配色，展示主播的歌曲、皮套、二创作品等内容。

## 📦 已完成的内容

### ✅ 页面功能
- **人物设堇（主页）** - 带视频背景的主页，包含渐变炫光标题、个人简介、电竞历程、人物关系网（力导向算法）
- **千千堇听** - 歌单展示页面，支持搜索和语言筛选
- **堇衣卫** - 历代皮套展示，采用时间线设计
- **触堇生情** - 画廊页面，支持分类筛选（表情包、二创、梗图、漫画）
- **ABOUT** - 关于页面，带本地SVG图标系统
- **更新日志** - 记录网站更新历史

### ✅ 技术特性
- 完整响应式设计，移动端深度优化
- 视频背景效果（支持多视频切换）
- 渐变炫光文字效果
- 本地字体加载（Inter、ZCOOL XiaoWei）
- 力导向布局算法（人物关系网自动防重叠）
- 本地SVG图标系统
- 流畅的动画和过渡效果
- 紫蓝配色主题
- 纯静态，无后端依赖

## 🚀 下一步操作

### 1. 添加实际内容

**替换占位符内容：**

```bash
# 上传图片到 assets/images/
# - profile.jpg (个人头像)
# - costume-*.jpg (皮套图片)
# - gallery-*.jpg (画廊作品)

# 上传视频到 assets/videos/
# - background.mp4 (主页背景视频)
```

**参考文档：**
- `MAINTENANCE.md` - 详细的内容更新指南
- 每个 assets 子文件夹都有 README.md 说明

### 2. 推送到 GitHub

```bash
# 创建 GitHub 仓库后执行：
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 3. 部署到 Vercel

详细步骤请查看 `DEPLOYMENT.md` 文档。

简要流程：
1. 访问 vercel.com
2. 导入 GitHub 仓库
3. 点击部署
4. 获得网站链接

## 📁 项目结构

```
sumire-site/
├── index.html              # 主页
├── music.html              # 歌单
├── costumes.html           # 皮套
├── gallery.html            # 画廊
├── about.html              # 关于
├── changelog.html          # 更新日志
│
├── css/                    # 样式文件
│   ├── style.css          # 全局样式 + 主页
│   ├── pages.css          # 子页面样式
│   └── gallery.css        # 画廊专用样式
│
├── js/                     # JavaScript
│   ├── main.js            # 主要功能（视频切换、loading）
│   ├── music.js           # 音乐页面（搜索、筛选）
│   ├── gallery.js         # 画廊筛选
│   └── relationship.js    # 人物关系网（力导向算法）
│
├── assets/                 # 资源文件
│   ├── fonts/             # 本地字体
│   │   ├── fonts.css      # 字体定义
│   │   ├── inter-*.ttf    # Inter字体（5个权重）
│   │   └── zcool-xiaowei.ttf
│   ├── images/            # 图片
│   │   ├── avatar/        # 头像
│   │   └── README.md      # 图片说明
│   └── videos/            # 视频
│       └── README.md      # 视频说明
│
├── README.md              # 项目说明
├── MAINTENANCE.md         # 维护文档
├── DEPLOYMENT.md          # 部署指南
├── RELATIONSHIP.md        # 关系网配置说明
├── DATA_CONFIG.md         # 数据配置说明
├── QUICKSTART.md          # 本文件
└── .gitignore             # Git忽略文件
```

## 🎨 自定义配色

如需修改网站配色，编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #8B7DC8;      /* 主色（紫色） */
    --secondary-color: #6B9FE8;    /* 辅色（蓝色） */
    /* ... 其他颜色变量 */
}
```

## 📝 常见修改

### 更新个人信息
- 文件: `index.html`
- 位置: `<section class="section profile">` 部分

### 添加歌曲
- 文件: `music.html`
- 位置: `<div class="song-list">` 部分
- 详见: `MAINTENANCE.md`

### 添加皮套
- 文件: `costumes.html`
- 位置: `<div class="timeline">` 部分
- 详见: `MAINTENANCE.md`

### 添加画廊作品
- 文件: `gallery.html`
- 位置: `<div class="gallery-grid">` 部分
- 详见: `MAINTENANCE.md`

## 🔗 重要链接

- **B站空间**: https://space.bilibili.com/13271481
- **微博**: https://weibo.com/u/6047824322

## 📚 文档索引

| 文档 | 用途 |
|------|------|
| `README.md` | 项目总览和功能介绍 |
| `QUICKSTART.md` | 快速入门指南（本文件） |
| `MAINTENANCE.md` | 详细的内容维护文档 |
| `DEPLOYMENT.md` | 部署到 Vercel 的完整指南 |
| `RELATIONSHIP.md` | 人物关系网详细配置说明 |
| `DATA_CONFIG.md` | 数据配置说明 |

## ⚡ 本地预览

### 方法一：直接打开
双击 `index.html` 用浏览器打开

### 方法二：使用本地服务器

```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 🐛 遇到问题？

1. 查看对应的文档（MAINTENANCE.md / DEPLOYMENT.md）
2. 检查浏览器控制台的错误信息
3. 确认文件路径和拼写正确
4. 在 GitHub 提交 Issue

## ✨ 功能规划

- [ ] 画廊灯箱查看效果
- [ ] 深色模式切换
- [ ] 多语言支持
- [ ] 字体子集化优化
- [ ] PWA离线支持
- [ ] 关系网交互动画增强

## 🎉 开始使用

1. ✅ 网站文件已创建完成
2. ✅ 本地字体已配置
3. ✅ 响应式布局已优化
4. ⏳ 上传图片和视频资源
5. ⏳ 自定义内容
6. ⏳ 部署到线上

祝使用愉快！
