# 🚀 快速部署指南

## 一键部署命令

### 1. 安装 Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 部署项目
```bash
# 使用部署脚本（推荐）
./deploy.sh

# 或直接使用 Vercel CLI
vercel --prod
```

## 部署脚本使用

### 生产环境部署
```bash
./deploy.sh
# 或
npm run deploy:prod
```

### 预览环境部署
```bash
./deploy.sh dev
# 或
npm run deploy:dev
```

## 部署后访问

1. 部署完成后，Vercel 会提供一个 URL
2. 访问该 URL 测试应用功能
3. 在 Vercel Dashboard 中管理项目

## 常见问题

### 构建失败
```bash
# 清理缓存重新构建
rm -rf .next
npm run build
```

### 音频文件问题
确保 `public/audio/` 目录包含所有音频文件：
```bash
ls -la public/audio/greek_*.mp3
```

### 依赖问题
```bash
# 使用 npm 安装依赖
npm install

# 或使用 pnpm
pnpm install
```

## 环境要求

- Node.js 18+
- npm 或 pnpm
- Vercel CLI
- 已登录 Vercel 账户

## 部署检查清单

- [ ] 所有音频文件存在且非空
- [ ] 项目构建成功
- [ ] 所有页面正常加载
- [ ] 音频播放功能正常
- [ ] 响应式设计正常

## 获取帮助

```bash
# 查看部署脚本帮助
./deploy.sh --help

# 查看 Vercel 帮助
vercel --help
```
