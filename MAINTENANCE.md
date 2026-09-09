# 明日堇sumire 个人网站维护文档

## 📁 项目结构

```
sumire-site/
├── index.html              # 主页（人物设堇）
├── music.html              # 千千堇听（歌曲列表）
├── costumes.html           # 堇衣卫（历代皮套）
├── gallery.html            # 触堇生情（画廊）
├── about.html              # 关于页面
├── changelog.html          # 更新日志
├── css/
│   ├── style.css          # 全局样式（主页 + 基础组件）
│   ├── pages.css          # 子页面样式
│   ├── gallery.css        # 画廊页面专用样式
│   └── mobile.css         # 移动端适配样式
├── js/
│   ├── main.js            # 主要功能（视频切换、loading动画）
│   ├── music.js           # 音乐页面功能（搜索、筛选）
│   ├── gallery.js         # 画廊筛选功能
│   └── relationship.js    # 人物关系网（力导向布局算法）
├── assets/
│   ├── fonts/             # 本地字体文件
│   │   ├── fonts.css      # 字体定义
│   │   ├── inter-*.ttf    # Inter字体（400/500/600/700/900）
│   │   └── zcool-xiaowei.ttf # 站酷小薇体
│   ├── images/            # 图片资源
│   │   ├── avatar/        # 头像图片
│   │   └── signature.png  # 签名图片（需要添加）
│   └── videos/            # 视频资源
│       ├── background.mp4 # 主背景视频
│       ├── background2.mp4# 备用视频2
│       └── background3.mp4# 备用视频3
└── *.md                   # 维护文档
```

## 🎨 常见修改任务

### 1. 替换签名图片

**步骤**：
1. 准备透明背景PNG图片（推荐尺寸：200x200px）
2. 命名为 `signature.png`
3. 放入 `assets/images/` 文件夹
4. 修改所有HTML文件：

**找到**：
```html
<div class="signature-logo"><img src="assets/images/signature.png" alt="签名"></div>
<div class="page-signature">✨</div>
```

**改为**：
```html
<div class="signature-logo"><img src="assets/images/signature.png" alt="签名"></div>
<div class="page-signature"><img src="assets/images/signature.png" alt="签名"></div>
```

**需要修改的文件**：
- index.html
- music.html
- costumes.html
- gallery.html
- about.html
- changelog.html

### 2. 添加/更换背景视频

**步骤**：
1. 准备视频文件（推荐格式：MP4，H.264编码）
2. 命名规则：
   - 主视频：`background.mp4`
   - 备用视频：`background2.mp4`、`background3.mp4`
3. 放入 `assets/videos/` 文件夹

**如果需要更多视频**，编辑 `js/main.js`：
```javascript
const videos = [
    'assets/videos/background.mp4',
    'assets/videos/background2.mp4',
    'assets/videos/background3.mp4',
    'assets/videos/background4.mp4'  // 添加更多
];
```

### 3. 修改歌曲列表

编辑 `music.html`，找到 `<div class="song-row">` 部分：

```html
<div class="song-row" data-lang="zh">
    <div class="song-number">01</div>
    <div class="song-info">
        <h3 class="song-title">歌曲名称</h3>
        <p class="song-artist">明日堇sumire · 原创 · 中文</p>
    </div>
    <div class="song-duration">03:45</div>
    <div class="song-action">
        <a href="https://www.bilibili.com/video/BV..." class="song-link">
            <svg>...</svg>
        </a>
    </div>
</div>
```

**语言标签**：`data-lang="zh"` (zh=中文, ja=日语, en=英语)

### 4. 修改人物关系网

编辑 `js/relationship.js` 文件。

**重要特性**：
- 使用力导向布局算法自动排列节点，防止重叠
- 移动端和桌面端自动优化布局参数
- 节点间通过贝塞尔曲线连接

**添加新节点**：
```javascript
{
    id: 'friend5',                              // 唯一ID
    name: 'UP主名字',                           // 显示名称
    avatar: 'https://...',                     // 头像URL或表情符号
    url: 'https://space.bilibili.com/...',    // B站链接
    size: 50,                                  // 头像大小（推荐40-70）
    color: '#6B9FE8'                          // 背景色
}
```

**注意**：移除了手动的 x、y 坐标，系统会自动计算最优位置。

**添加连线**：
```javascript
{
    from: 'sumire',
    to: 'friend5',
    label: '关系描述',                         // 连线上的文字标签
    color: '#ff6b6b',
    width: 2
}
```

**算法说明**：
- 自动防止节点重叠
- 根据屏幕大小调整斥力和安全间距
- 移动端（<768px）使用更强斥力确保不重叠

详细说明见 `RELATIONSHIP.md`

### 5. 修改皮套展示

编辑 `costumes.html`，找到 `<div class="costume-card">` 部分：

```html
<div class="costume-card">
    <div class="costume-card-image">
        <div class="image-placeholder">
            <span class="placeholder-icon">👗</span>
        </div>
        <span class="costume-badge new">NEW</span>
    </div>
    <div class="costume-card-info">
        <h3 class="costume-card-title">皮套名称</h3>
        <p class="costume-card-date">2024.08</p>
        <div class="costume-card-tags">
            <span class="tag">标签1</span>
            <span class="tag">标签2</span>
        </div>
    </div>
</div>
```

**替换图片**：将 `<span class="placeholder-icon">👗</span>` 改为 `<img src="...">`

### 6. 修改画廊图片

编辑 `gallery.html`，找到 `<div class="gallery-item">` 部分：

```html
<div class="gallery-item" data-category="fanart">
    <div class="gallery-card">
        <div class="gallery-image">
            <img src="assets/images/gallery/image1.jpg" alt="">
        </div>
    </div>
</div>
```

**分类标签**：`data-category="fanart"` (fanart=插画, emoji=表情包, comic=漫画)

### 7. 移除子页面的视频切换按钮

如果不需要子页面的视频切换按钮，编辑各子页面HTML，删除：

```html
<button class="video-toggle-btn">
    <svg>...</svg>
    <span>切换背景</span>
</button>
```

只保留主页的视频切换按钮。

## 🎯 配色方案

```css
--primary-color: #8B7DC8;    /* 主色（紫色）*/
--secondary-color: #6B9FE8;  /* 辅助色（蓝色）*/
--accent-color: #B794F6;     /* 强调色（淡紫）*/
--dark-bg: #0c0505;          /* 深色背景 */
```

修改颜色：编辑 `css/style.css` 的 `:root` 部分

## 📱 响应式断点

- 手机：< 768px
- 平板：768px - 1024px
- 桌面：> 1024px

## 🔧 字体

项目使用本地字体文件，确保在任何网络环境下都能正常显示：

- **界面文字**：Inter（400/500/600/700/900）
- **标题/中文**：ZCOOL XiaoWei（站酷小薇体）
- **系统字体回退**：SimSun、STSong、PingFang SC、Microsoft YaHei

所有字体文件位于 `assets/fonts/` 目录，通过 `assets/fonts/fonts.css` 引入。

### 特殊效果

主页标题"sumire"采用：
- 渐变色效果（紫色→蓝色→淡紫）
- 外发光效果（炫光边缘）
- 使用Unicode数学字母字符：𝓼𝓾𝓶𝓲𝓻𝓮

## 📝 更新日志

修改网站后，记得更新 `changelog.html` 添加版本记录。

## ⚠️ 注意事项

1. 修改HTML后务必测试loading动画
2. 添加图片时注意优化文件大小
3. 视频文件建议压缩后上传
4. 修改配置文件后刷新浏览器缓存（Ctrl+F5）
5. 所有"堇"字保持紫色高亮（使用 `<span class="highlight-jin">堇</span>`）

## 🚀 部署

项目是纯静态网站，可部署到：
- GitHub Pages
- Vercel
- Netlify
- 任何静态托管服务

推荐使用 Vercel，步骤见 README.md
