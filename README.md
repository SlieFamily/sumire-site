# 明日堇sumire 个人网站

这是为哔哩哔哩虚拟主播"明日堇sumire"制作的个人网站。

## 🌐 网站链接

- **B站空间**: https://space.bilibili.com/13271481
- **微博**: https://weibo.com/u/6047824322

## 📁 项目结构

```
sumire-site/
├── index.html              # 主页（人物设堇）
├── music.html              # 歌单页面（千千堇听）
├── costumes.html           # 皮套页面（堇衣卫）
├── gallery.html            # 画廊页面（触堇生情）
├── guestbook.html          # 留言板页面（堇言慎行）
├── about.html              # 关于页面
├── changelog.html          # 更新日志
├── css/                    # 样式文件
│   ├── style.css          # 全局样式
│   ├── home.css           # 主页样式
│   ├── music.css          # 歌单样式
│   ├── costumes.css       # 皮套样式
│   ├── gallery.css        # 画廊样式
│   ├── guestbook.css      # 留言板样式
│   ├── about.css          # 关于页面样式
│   └── changelog.css      # 更新日志样式
├── js/                     # JavaScript文件
│   ├── main.js            # 主要功能
│   ├── home.js            # 主页特定功能
│   └── gallery.js         # 画廊特定功能
├── assets/                 # 资源文件
│   ├── images/            # 图片资源
│   └── videos/            # 视频资源
├── README.md              # 项目说明
└── MAINTENANCE.md         # 维护文档
```

## ✨ 功能特点

- 🎨 **紫蓝渐变配色**: 符合角色形象的配色方案
- 📱 **响应式设计**: 完美支持移动端和桌面端
- 🎬 **视频背景**: 主页采用视频背景效果
- ⚡ **流畅动画**: 平滑的过渡和交互效果
- 🎵 **歌单展示**: 展示原创和翻唱歌曲
- 👗 **皮套时间线**: 按时间展示历代皮套
- 🖼️ **画廊分类**: 表情包、二创作品分类展示

## 🚀 部署指南

### Vercel 部署

1. 将项目推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 导入 GitHub 仓库
4. Vercel 会自动检测为静态网站并部署
5. 部署完成后获得访问链接

### 本地预览

直接用浏览器打开 `index.html` 即可预览。

或使用本地服务器：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve
```

然后访问 `http://localhost:8000`

## 🛠️ 技术栈

- **HTML5**: 语义化标签
- **CSS3**: Grid、Flexbox、渐变、动画
- **JavaScript**: 原生 JS，无依赖框架
- **响应式**: 媒体查询适配多端

## 📝 维护说明

详细的内容更新和维护说明请查看 [MAINTENANCE.md](MAINTENANCE.md)

## 🎯 待开发功能

- [ ] 留言板功能完整实现
- [ ] 画廊图片灯箱查看
- [ ] 搜索功能
- [ ] 深色模式
- [ ] 多语言支持

## 📄 许可

本项目为粉丝自发制作的非官方网站，所有内容版权归原作者所有。

## 🙏 鸣谢

感谢所有为sumire创作二创作品的画师和粉丝们！
