# 快速开始指南

## 项目概述

明日堇sumire 个人网站，基于 Vite 构建的现代化静态展示网站。采用紫蓝渐变配色，展示主播的歌曲、皮套、二创作品等内容。

## 环境要求

- Node.js 16.0+
- npm 或 yarn

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

开发服务器将在 `http://localhost:8000` 启动。

### 3. 生产构建

```bash
npm run build
```

构建输出在 `dist/` 目录。

### 4. 预览构建

```bash
npm run preview
```

## 技术特性

- Vite 8.3 构建系统
- ES Module 模块化
- D3.js 力导向布局算法
- 完整响应式设计
- 本地化字体资源
- 零后端依赖

## 页面结构

- **人物设堇** - 主页，包含个人简介、电竞历程、人物关系网
- **千千堇听** - 歌曲列表，支持搜索和语言筛选
- **堇衣卫** - 历代皮套时间线展示
- **触堇生情** - 二创作品画廊（插画、表情包、漫画）
- **关于** - 网站说明
- **更新日志** - 版本更新记录

## 项目结构

```
sumire-site/
├── public/data/           # JSON 数据文件
├── css/                   # 样式文件
├── js/                    # JavaScript 模块
├── assets/                # 静态资源（字体、图片）
├── scripts/               # 构建脚本
├── *.html                 # 页面文件
├── vite.config.js         # Vite 配置
└── package.json           # 项目配置
```

## 内容更新

所有内容通过 JSON 数据文件管理，位于 `public/data/` 目录：

- `songs.json` - 歌曲数据
- `costumes.json` - 皮套数据
- `gallery.json` - 画廊数据
- `relationship.json` - 人物关系网数据
- `changelog.json` - 更新日志数据

详细更新指南请查看 [MAINTENANCE.md](MAINTENANCE.md)。

## 部署

### Vercel（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 其他平台

构建后的 `dist/` 目录可部署到：
- GitHub Pages
- Netlify
- Cloudflare Pages
- 任何静态托管服务

详细部署指南请查看 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 自定义配置

### 修改配色

编辑 `css/style.css` 中的 CSS 变量：

```css
:root {
    --primary-color: #8B7DC8;      /* 主色（紫色）*/
    --secondary-color: #6B9FE8;    /* 辅助色（蓝色）*/
    --accent-color: #B794F6;       /* 强调色（淡紫）*/
}
```

### 修改字体

字体配置在 `assets/fonts/fonts.css`。项目使用：
- Inter - 界面字体
- ZCOOL XiaoWei - 标题字体
- Noto Serif SC - 正文字体

## 相关文档

- [README.md](README.md) - 项目说明
- [MAINTENANCE.md](MAINTENANCE.md) - 维护指南
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南
- [DATA_CONFIG.md](DATA_CONFIG.md) - 数据配置说明
- [RELATIONSHIP.md](RELATIONSHIP.md) - 人物关系网配置

## 常见问题

### 端口被占用

修改 `vite.config.js` 中的端口配置：

```javascript
server: {
  port: 8000  // 修改为其他端口
}
```

### 构建失败

1. 清除缓存：`rm -rf node_modules dist`
2. 重新安装：`npm install`
3. 重新构建：`npm run build`

### 热更新不生效

1. 检查文件是否正确保存
2. 重启开发服务器
3. 清除浏览器缓存（Ctrl+F5）
