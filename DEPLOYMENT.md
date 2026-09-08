# 部署指南

本文档介绍如何将网站部署到 Vercel 或其他静态托管平台。

## 📋 前置准备

1. GitHub 账号
2. Vercel 账号（可用 GitHub 登录）
3. Git 已安装在本地

## 🚀 部署到 Vercel（推荐）

### 步骤 1: 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 `+` → `New repository`
3. 填写仓库信息：
   - Repository name: `sumire-site`（或其他名称）
   - Description: `明日堇sumire的个人网站`
   - 选择 `Public` 或 `Private`
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 `Create repository`

### 步骤 2: 推送代码到 GitHub

在项目目录下执行以下命令：

```bash
# 添加远程仓库（替换为你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/你的用户名/sumire-site.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 3: 在 Vercel 上部署

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 `Add New...` → `Project`
4. 从列表中选择 `sumire-site` 仓库
5. 点击 `Import`
6. 在配置页面：
   - Framework Preset: 选择 `Other`
   - Root Directory: `.`（保持默认）
   - Build Command: 留空
   - Output Directory: `.`
7. 点击 `Deploy`
8. 等待几分钟，部署完成！

### 步骤 4: 获取网站链接

部署完成后，Vercel 会提供一个免费域名，格式如：
- `https://sumire-site.vercel.app`

你也可以：
- 绑定自己的域名
- 分享这个链接给其他人访问

## 🔄 更新网站

当你修改了网站内容后：

```bash
# 1. 添加修改的文件
git add .

# 2. 提交更改
git commit -m "更新说明（如：添加新歌曲）"

# 3. 推送到 GitHub
git push
```

Vercel 会自动检测到更新并重新部署，无需手动操作。

## 🌐 其他部署选项

### GitHub Pages

1. 在 GitHub 仓库设置中找到 `Pages`
2. Source 选择 `main` 分支，目录选择 `/（root）`
3. 保存后等待部署
4. 访问 `https://你的用户名.github.io/sumire-site`

### Netlify

1. 访问 [Netlify](https://netlify.com)
2. 点击 `Add new site` → `Import an existing project`
3. 连接 GitHub 仓库
4. 保持默认设置，点击 `Deploy`

### Cloudflare Pages

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com)
2. 连接 GitHub 账号
3. 选择仓库并部署

## 📝 自定义域名

### 在 Vercel 上绑定域名

1. 在 Vercel 项目面板中点击 `Settings`
2. 选择 `Domains`
3. 输入你的域名（如 `sumire.example.com`）
4. 按照提示在域名提供商处添加 DNS 记录：
   - 类型: `CNAME`
   - 名称: `sumire`（或 `@` 用于根域名）
   - 值: `cname.vercel-dns.com`
5. 等待 DNS 生效（通常几分钟到几小时）

## 🔧 环境变量（如需要）

目前网站是纯静态的，不需要环境变量。如果将来添加了后端功能，可以在 Vercel 的 `Settings` → `Environment Variables` 中添加。

## 📊 监控和分析

### Vercel Analytics

1. 在项目设置中启用 `Analytics`
2. 查看访问量、页面性能等数据

### 添加 Google Analytics（可选）

在所有 HTML 文件的 `<head>` 标签中添加：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=你的GA ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '你的GA ID');
</script>
```

## ⚡ 性能优化建议

1. **图片优化**
   - 使用 WebP 格式
   - 压缩图片大小
   - 使用适当的分辨率

2. **视频优化**
   - 压缩视频文件
   - 使用 CDN 托管大文件

3. **代码优化**
   - 压缩 CSS 和 JS 文件
   - 使用浏览器缓存

4. **CDN 加速**
   - Vercel 自带全球 CDN
   - 或使用 Cloudflare CDN

## 🛠️ 故障排查

### 部署失败

- 检查 Git 仓库是否正确推送
- 查看 Vercel 部署日志
- 确认文件路径正确

### 页面显示异常

- 清除浏览器缓存
- 检查控制台错误信息
- 确认文件路径大小写正确

### 图片/视频不显示

- 确认文件已上传到正确位置
- 检查文件路径拼写
- 确认文件大小合理

## 📞 获取帮助

- 查看 [Vercel 文档](https://vercel.com/docs)
- 在 GitHub 仓库提交 Issue
- 通过 B站私信联系维护者

---

**部署愉快！** 🎉
