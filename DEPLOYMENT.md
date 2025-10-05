# Vercel 部署指南

## 项目概述
Alphabet 是一个语言学习工具合集，包括英语音标、希腊字母和编码查询功能。项目使用 Next.js 14、React 18、TypeScript 和 Tailwind CSS 构建。

## 部署到 Vercel

### 方法一：使用 Vercel CLI（推荐）

#### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 部署项目
```bash
# 在项目根目录执行
vercel

# 或者直接部署到生产环境
vercel --prod
```

#### 4. 后续更新部署
```bash
# 每次代码更新后，重新部署
vercel --prod
```

### 方法二：通过 GitHub 集成

#### 1. 推送代码到 GitHub
```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/yourusername/alphabet.git

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit: Alphabet language learning tool"

# 推送到 GitHub
git push -u origin main
```

#### 2. 在 Vercel 中导入项目
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Import Git Repository"
4. 选择你的 GitHub 仓库
5. 配置项目设置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### 3. 自动部署
- 每次推送到 `main` 分支会自动触发部署
- 推送到其他分支会创建预览部署

### 方法三：使用 Vercel Dashboard

#### 1. 准备项目
确保项目包含以下文件：
- `package.json`
- `next.config.js`
- `vercel.json`（可选，用于自定义配置）

#### 2. 上传项目
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Upload" 选项
4. 拖拽项目文件夹或选择项目目录
5. 配置项目设置并部署

## 项目配置

### 环境变量
项目目前不需要特殊的环境变量配置。

### 构建配置
- **Node.js 版本**: 18.x
- **包管理器**: pnpm（推荐）或 npm
- **构建命令**: `npm run build`
- **输出目录**: `.next`

### 静态资源
- 音频文件位于 `public/audio/` 目录
- 已配置缓存策略，音频文件缓存 1 年

## 部署命令总结

### 快速部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel --prod
```

### 开发环境部署
```bash
# 部署到预览环境
vercel
```

### 更新部署
```bash
# 重新部署到生产环境
vercel --prod
```

## 部署后检查

### 1. 检查部署状态
- 访问 Vercel Dashboard 查看部署状态
- 检查构建日志是否有错误

### 2. 测试功能
- 访问部署的 URL
- 测试音频播放功能
- 检查所有页面是否正常加载

### 3. 性能优化
- 检查 Lighthouse 分数
- 优化图片和音频文件大小
- 确保 CDN 缓存正常工作

## 常见问题

### 1. 构建失败
- 检查 Node.js 版本兼容性
- 确保所有依赖都正确安装
- 检查 TypeScript 类型错误

### 2. 音频文件无法播放
- 确保音频文件在 `public/audio/` 目录
- 检查文件路径是否正确
- 验证音频文件格式（MP3）

### 3. 样式问题
- 确保 Tailwind CSS 配置正确
- 检查 PostCSS 配置
- 验证 CSS 文件是否正确构建

## 自定义域名

### 1. 添加自定义域名
1. 在 Vercel Dashboard 中选择项目
2. 进入 "Settings" > "Domains"
3. 添加你的域名
4. 配置 DNS 记录

### 2. SSL 证书
- Vercel 自动为所有域名提供 SSL 证书
- 证书会自动续期

## 监控和分析

### 1. Vercel Analytics
- 在项目设置中启用 Analytics
- 查看访问统计和性能指标

### 2. 错误监控
- 集成 Sentry 或其他错误监控服务
- 设置告警通知

## 备份和恢复

### 1. 代码备份
- 使用 Git 版本控制
- 定期推送到远程仓库

### 2. 数据备份
- 项目主要使用静态资源
- 音频文件已包含在代码仓库中

## 成本估算

### Vercel 免费计划
- 每月 100GB 带宽
- 无限静态部署
- 适合个人项目和小型应用

### 升级计划
- Pro 计划：$20/月
- 更多带宽和功能
- 适合商业项目

## 技术支持

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [项目 GitHub Issues](https://github.com/yourusername/alphabet/issues)
