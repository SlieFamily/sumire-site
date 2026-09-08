# 明日堇sumire 个人网站

一个为虚拟主播明日堇sumire打造的个人展示网站。

## ✨ 特性

- 🎬 **全屏视频背景** - 沉浸式视觉体验
- 🎨 **紫蓝配色** - 符合主播形象的配色方案
- 📱 **完全响应式** - 支持手机、平板、桌面
- ⚡ **Loading动画** - 签名图片平滑过渡效果
- 🎵 **音乐列表** - 搜索、筛选、语言分类
- 👗 **皮套展示** - 瀑布流布局
- 🖼️ **画廊** - 纯图片展示
- 🌐 **关系网** - 可配置的人物关系图

## 🎯 页面结构

- **人物设堇**（index.html）- 主页，包含个人简介、游戏、电竞历程、关系网
- **千千堇听**（music.html）- 歌曲列表，支持搜索和语言筛选
- **堇衣卫**（costumes.html）- 历代皮套展示
- **触堇生情**（gallery.html）- 二创作品画廊
- **关于**（about.html）- 关于页面
- **更新日志**（changelog.html）- 版本更新记录

## 🚀 快速开始

### 本地预览

1. 克隆或下载项目
2. 双击打开 `index.html`
3. 在浏览器中查看

### 部署到 Vercel

1. 注册 [Vercel](https://vercel.com) 账号
2. 点击 "New Project"
3. 导入 GitHub 仓库
4. 点击 "Deploy"
5. 完成！

### 部署到 GitHub Pages

1. 将代码推送到 GitHub
2. 进入仓库 Settings → Pages
3. Source 选择 `main` 分支
4. 保存，等待部署完成

## 🛠️ 维护指南

详细的维护文档请查看 [MAINTENANCE.md](MAINTENANCE.md)

### 常见任务

#### 替换签名图片
1. 准备 `signature.png` (透明背景，200x200px)
2. 放入 `assets/images/` 文件夹
3. 替换所有页面中的 `✨` 为 `<img src="assets/images/signature.png">`

#### 添加背景视频
1. 准备视频文件（MP4格式）
2. 命名为 `background.mp4`、`background2.mp4` 等
3. 放入 `assets/videos/` 文件夹

#### 修改人物关系网
编辑 `js/relationship.js` 文件，详见 [RELATIONSHIP.md](RELATIONSHIP.md)

## 📁 项目结构

```
sumire-site/
├── index.html              # 主页
├── music.html              # 音乐页面
├── costumes.html           # 皮套页面
├── gallery.html            # 画廊页面
├── about.html              # 关于页面
├── changelog.html          # 更新日志
├── css/
│   ├── style.css          # 全局样式
│   └── pages.css          # 子页面样式
├── js/
│   ├── main.js            # 主功能
│   ├── music.js           # 音乐功能
│   ├── gallery.js         # 画廊功能
│   └── relationship.js    # 关系网配置
├── assets/
│   ├── images/            # 图片资源
│   └── videos/            # 视频资源
└── *.md                   # 文档
```

## 🎨 技术栈

- **纯前端** - HTML5 + CSS3 + JavaScript
- **字体** - Inter + ZCOOL XiaoWei + Noto Serif SC
- **图标** - SVG
- **视频** - HTML5 Video
- **动画** - CSS Transitions + JavaScript

## 🎯 设计特点

- **简洁现代** - 参考 komichi-vup.com 风格
- **深色主题** - 紫蓝配色方案
- **粗宋体** - 优雅的中文字体
- **长方形边框** - 统一的卡片样式
- **"堇"字高亮** - 紫色强调色

## 📝 配置文件

- `js/relationship.js` - 人物关系网配置
- `js/main.js` - 视频切换配置
- `css/style.css` - 颜色和样式配置

## 🔧 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 许可

本项目仅供学习交流使用。

## 🙏 致谢

- 设计参考：[komichi-vup.com](https://komichi-vup.com)
- 字体：Google Fonts
- 主播：明日堇sumire

## 📞 联系

- B站：[@明日堇sumire](https://space.bilibili.com/13271481)
- 微博：[@明日堇sumire](https://weibo.com/u/6047824322)

---

Made with ❤️ for 明日堇sumire
