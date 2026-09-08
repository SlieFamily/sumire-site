# 网站维护文档

本文档为网站管理员提供内容更新和日常维护的详细指南。

## 📋 目录

- [更新主页内容](#更新主页内容)
- [更新歌单](#更新歌单)
- [添加新皮套](#添加新皮套)
- [上传画廊作品](#上传画廊作品)
- [更新个人信息](#更新个人信息)
- [更换视频背景](#更换视频背景)
- [常见问题](#常见问题)

---

## 更新主页内容

### 修改个人简介

**文件**: `index.html`

**位置**: 第 70-90 行左右，`<section class="section profile">` 部分

```html
<div class="profile-text">
    <p>大家好，我是明日堇sumire～</p>
    <p>一个喜欢玩游戏、唱歌的虚拟主播。</p>
    <p>希望能和大家一起度过快乐的时光！</p>
    <!-- 在这里修改个人简介文字 -->
</div>
```

### 更新个人数据

**文件**: `index.html`

**位置**: 个人简介下方的统计数据

```html
<div class="profile-stats">
    <div class="stat-item">
        <span class="stat-value">2020.05</span> <!-- 修改出道时间 -->
        <span class="stat-label">出道时间</span>
    </div>
    <div class="stat-item">
        <span class="stat-value">∞</span> <!-- 修改年龄 -->
        <span class="stat-label">年龄</span>
    </div>
    <div class="stat-item">
        <span class="stat-value">165cm</span> <!-- 修改身高 -->
        <span class="stat-label">身高</span>
    </div>
</div>
```

### 添加/修改游戏

**文件**: `index.html`

**位置**: `<section class="section games">` 部分

```html
<div class="game-card">
    <div class="game-icon">🎮</div> <!-- 修改表情符号 -->
    <h3>APEX Legends</h3> <!-- 修改游戏名称 -->
    <p>最喜欢的FPS游戏</p> <!-- 修改描述 -->
</div>
```

### 更新直播日历

**文件**: `index.html`

**位置**: `<section class="section calendar">` 部分

```html
<div class="calendar-notice">
    <p>📅 通常直播时间：周三、周五、周日 20:00-23:00</p>
    <!-- 修改直播时间 -->
    <p>具体时间请关注动态通知～</p>
</div>
```

---

## 更新歌单

### 添加新歌曲

**文件**: `music.html`

**位置**: `<div class="song-list">` 部分

**步骤**:

1. 复制一个现有的 `song-item` div
2. 修改序号、歌名、分类和时长
3. 更新 B站链接

```html
<div class="song-item">
    <div class="song-number">06</div> <!-- 修改序号 -->
    <div class="song-info">
        <h4 class="song-title">新歌名称</h4> <!-- 修改歌名 -->
        <p class="song-artist">明日堇sumire - 原创</p> <!-- 修改分类 -->
    </div>
    <div class="song-duration">03:45</div> <!-- 修改时长 -->
    <div class="song-actions">
        <a href="你的B站视频链接" class="song-link" title="在B站观看">
            <!-- SVG 图标保持不变 -->
        </a>
    </div>
</div>
```

### 更新歌单统计

**文件**: `music.html`

**位置**: 页面底部的统计卡片

```html
<div class="stat-number">45</div> <!-- 修改歌曲总数 -->
<div class="stat-number">3.2小时</div> <!-- 修改总时长 -->
<div class="stat-number">12.5万</div> <!-- 修改播放量 -->
<div class="stat-number">2024.09</div> <!-- 修改更新日期 -->
```

### 添加新歌单分类

**文件**: `music.html`

**位置**: `<div class="playlist-grid">` 部分

```html
<div class="playlist-card">
    <div class="playlist-cover">
        <div class="playlist-icon">🎵</div> <!-- 修改图标 -->
        <div class="playlist-overlay">
            <span class="play-icon">▶</span>
        </div>
    </div>
    <div class="playlist-info">
        <h3>新歌单名称</h3> <!-- 修改标题 -->
        <p class="playlist-desc">歌单描述</p> <!-- 修改描述 -->
        <span class="playlist-count">5首歌曲</span> <!-- 修改数量 -->
    </div>
</div>
```

---

## 添加新皮套

### 添加新皮套条目

**文件**: `costumes.html`

**位置**: `<div class="timeline">` 部分

**步骤**:

1. 在时间线顶部（第一个 timeline-item 之前）添加新条目
2. 如果是新年份，先添加年份标题

```html
<!-- 如果需要，先添加年份标题 -->
<div class="timeline-year">
    <h3>2025</h3>
</div>

<!-- 添加新皮套 -->
<div class="timeline-item">
    <div class="timeline-marker">
        <span class="marker-dot"></span>
    </div>
    <div class="timeline-content">
        <div class="costume-card">
            <div class="costume-image">
                <img src="assets/images/costume-2025-new.jpg" alt="新皮套名称">
                <div class="costume-badge new">NEW</div>
            </div>
            <div class="costume-info">
                <h3 class="costume-title">新皮套名称</h3>
                <p class="costume-date">2025年1月</p>
                <p class="costume-desc">这里写皮套的描述和特点...</p>
                <div class="costume-tags">
                    <span class="tag">标签1</span>
                    <span class="tag">标签2</span>
                    <span class="tag">标签3</span>
                </div>
            </div>
        </div>
    </div>
</div>
```

### 更新皮套统计

**文件**: `costumes.html`

**位置**: 页面底部统计区域

```html
<div class="stat-number">8</div> <!-- 修改皮套总数 -->
<div class="stat-number">3</div> <!-- 修改限定皮套数 -->
<div class="stat-number">5</div> <!-- 修改设计师合作数 -->
```

---

## 上传画廊作品

### 添加新作品

**文件**: `gallery.html`

**位置**: `<div class="gallery-grid">` 部分

**步骤**:

1. 准备图片并上传到 `assets/images/` 文件夹
2. 添加新的画廊项目

```html
<div class="gallery-item" data-category="fanart"> <!-- 修改分类: emoji/fanart/meme/comic -->
    <div class="gallery-card">
        <div class="gallery-image">
            <!-- 如果有真实图片 -->
            <img src="assets/images/your-image.jpg" alt="作品名称">
            
            <!-- 或使用占位符 -->
            <div class="placeholder-art">🎨</div>
        </div>
        <div class="gallery-info">
            <h3>作品名称</h3>
            <p class="gallery-author">by 作者名</p>
            <span class="gallery-category">二创插画</span> <!-- 修改标签 -->
        </div>
    </div>
</div>
```

### 分类说明

- `data-category="emoji"` - 表情包
- `data-category="fanart"` - 二创插画
- `data-category="meme"` - 梗图
- `data-category="comic"` - 漫画

### 更新画廊统计

**文件**: `gallery.html`

**位置**: 页面底部统计区域

```html
<div class="stat-number">150+</div> <!-- 修改总作品数 -->
<div class="stat-number">50+</div> <!-- 修改创作者数 -->
```

---

## 更新个人信息

### 更新社交媒体链接

**文件**: `index.html`

**位置**: 主页英雄区域的社交链接

```html
<a href="https://space.bilibili.com/13271481" target="_blank" class="social-btn bilibili">
    <!-- 修改链接 -->
</a>
<a href="https://weibo.com/u/6047824322" target="_blank" class="social-btn weibo">
    <!-- 修改链接 -->
</a>
```

### 更新ABOUT页面信息

**文件**: `about.html`

**位置**: 各个部分的文字内容

修改关于sumire、网站介绍、联系方式等信息。

---

## 更换视频背景

### 准备视频文件

1. 准备 MP4 格式的视频文件
2. 建议分辨率: 1920x1080 或更高
3. 建议时长: 10-30秒（循环播放）
4. 文件大小: 尽量控制在 10MB 以内以提升加载速度

### 替换视频

**步骤**:

1. 将新视频文件命名为 `background.mp4`
2. 上传到 `assets/videos/` 文件夹
3. 如果使用不同文件名，需修改 `index.html`:

```html
<video autoplay muted loop playsinline id="bg-video">
    <source src="assets/videos/你的视频文件名.mp4" type="video/mp4">
</video>
```

### 视频优化建议

- 使用视频压缩工具减小文件大小
- 可以使用 HandBrake 或在线工具进行压缩
- 推荐码率: 2-5 Mbps
- 推荐编码: H.264

---

## 更新颜色主题

如果需要调整网站配色，可以修改 CSS 变量。

**文件**: `css/style.css`

**位置**: 文件开头的 `:root` 部分

```css
:root {
    --primary-color: #8B7DC8;      /* 主色（紫色） */
    --secondary-color: #6B9FE8;    /* 辅色（蓝色） */
    --accent-color: #9B8DD9;       /* 强调色 */
    --dark-bg: #1a1625;            /* 深色背景 */
    --darker-bg: #0f0d15;          /* 更深背景 */
    --text-light: #ffffff;         /* 浅色文字 */
    --text-muted: #b8b4c8;         /* 柔和文字 */
    --card-bg: rgba(139, 125, 200, 0.1);      /* 卡片背景 */
    --card-border: rgba(139, 125, 200, 0.3);  /* 卡片边框 */
}
```

修改这些变量值即可改变整个网站的配色。

---

## 上传和替换图片

### 图片规格建议

- **个人头像/立绘**: 1000x1000px 以上，PNG 格式（透明背景）
- **皮套展示图**: 800x1200px，JPG/PNG 格式
- **画廊作品**: 800x800px 或更高，JPG/PNG 格式
- **表情包**: 512x512px，PNG 格式（透明背景）

### 上传步骤

1. 将图片文件放入 `assets/images/` 文件夹
2. 使用描述性的文件名，如: `costume-2024-summer.jpg`
3. 在相应的 HTML 文件中引用图片:

```html
<img src="assets/images/你的图片文件名.jpg" alt="描述文字">
```

### 优化建议

- 使用图片压缩工具（如 TinyPNG）减小文件大小
- JPG 适合照片类图片
- PNG 适合需要透明背景的图片
- 避免上传过大的原图（建议单个文件 < 500KB）

---

## 常见问题

### Q: 如何添加新页面？

A: 
1. 复制现有的 HTML 文件（如 `about.html`）
2. 修改内容
3. 在所有页面的导航栏中添加链接
4. 创建对应的 CSS 文件（如需要）

### Q: 移动端显示不正常怎么办？

A: 
- 检查是否有 `<meta name="viewport">` 标签
- 使用浏览器开发者工具的响应式模式测试
- 检查 CSS 媒体查询是否正确

### Q: 视频背景不显示怎么办？

A: 
1. 检查视频文件路径是否正确
2. 确认视频格式为 MP4
3. 检查浏览器控制台是否有错误
4. 确保视频文件不要太大（建议 < 10MB）

### Q: 如何更新网站到 Vercel？

A: 
1. 使用 Git 提交更改: `git add .` → `git commit -m "更新说明"` → `git push`
2. Vercel 会自动检测并重新部署
3. 部署完成后刷新网站查看更新

### Q: 如何备份网站？

A: 
- 使用 Git 进行版本控制（推荐）
- 定期下载整个项目文件夹
- 在 GitHub 上保持最新版本

---

## 联系支持

如果遇到技术问题，可以：

1. 查看项目的 `README.md`
2. 在 GitHub 提交 Issue
3. 通过 B站私信联系网站维护者

---

**最后更新**: 2024-09-08
**文档版本**: v1.0.0
