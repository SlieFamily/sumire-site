# 部署指南

本文档介绍如何将网站部署到 Vercel 或其他静态托管平台。

## 前置准备

1. Node.js 16.0+ 已安装
2. GitHub 账号
3. Vercel 账号（可用 GitHub 登录）
4. Git 已安装在本地

## 部署到 Vercel（推荐）

### 步骤 1: 构建项目

在项目目录下执行：

```bash
npm install
npm run build
```

构建输出在 `dist/` 目录。

### 步骤 2: 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 `+` → `New repository`
3. 填写仓库信息：
   - Repository name: `sumire-site`
   - Description: `明日堇sumire 个人网站`
   - 选择 `Public` 或 `Private`
4. 点击 `Create repository`

### 步骤 3: 推送代码到 GitHub

```bash
# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/username/sumire-site.git

# 推送代码
git branch -M main
git push -u origin main
```

### 步骤 4: 在 Vercel 上部署

1. 访问 [Vercel](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 `Add New...` → `Project`
4. 选择 `sumire-site` 仓库
5. 点击 `Import`
6. 构建配置：
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. 点击 `Deploy`

部署完成后获得免费域名：`https://sumire-site.vercel.app`

### 步骤 5: 自动部署

推送代码到 GitHub 后，Vercel 会自动检测并重新部署：

```bash
git add .
git commit -m "更新内容"
git push
```

## 其他部署选项

### Netlify

1. 访问 [Netlify](https://netlify.com)
2. 点击 `Add new site` → `Import an existing project`
3. 连接 GitHub 仓库
4. 构建配置：
   - Build command: `npm run build`
   - Publish directory: `dist`
5. 点击 `Deploy site`

### GitHub Pages

需要额外配置：

1. 安装 gh-pages：`npm install -D gh-pages`
2. 在 `package.json` 添加脚本：
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. 运行：`npm run deploy`
4. 在仓库设置中启用 GitHub Pages

### Cloudflare Pages

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com)
2. 连接 GitHub 账号
3. 选择仓库
4. 构建配置：
   - Build command: `npm run build`
   - Build output directory: `dist`
5. 点击 `Save and Deploy`

## 自定义域名

### Vercel 域名绑定

1. 在项目设置中选择 `Domains`
2. 输入自定义域名
3. 添加 DNS 记录：
   - 类型: `CNAME`
   - 名称: `@` 或子域名
   - 值: `cname.vercel-dns.com`
4. 等待 DNS 生效

## 性能优化

### 已实现的优化

- 文件名哈希（自动缓存失效）
- 代码分块加载
- 资源压缩
- Gzip 压缩

### 建议优化

1. 图片优化
   - 使用 WebP 格式
   - 压缩图片大小
   - 使用适当分辨率

2. CDN 加速
   - Vercel 自带全球 CDN
   - 或使用 Cloudflare CDN

3. 缓存策略
   - 已通过文件名哈希实现

## 监控分析

### Vercel Analytics

在项目设置中启用 `Analytics` 查看访问数据。

### Google Analytics（可选）

在 `index.html` 的 `<head>` 中添加：

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 故障排查

### 部署失败

- 检查构建日志
- 确认 Node.js 版本
- 验证 package.json 配置

### 页面显示异常

- 清除浏览器缓存（Ctrl+F5）
- 检查控制台错误
- 验证资源路径

### 资源加载失败

- 确认文件路径正确
- 检查文件大小限制
- 验证文件格式支持

## 环境要求

- Node.js: 16.0+
- npm: 8.0+
- 构建时间: 约 30-60 秒
- 输出大小: 约 8-10 MB（含字体）

## 相关文档

- [Vercel 文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [项目维护文档](MAINTENANCE.md)
