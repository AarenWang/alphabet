# Alphabet 语言学习工具

一个使用 **Next.js 14 + TypeScript + Tailwind CSS** 构建的语言学习与查询站点，包含以下功能：

- **英语音标与发音对照**：按照辅音、元音分类展示音标、示例单词和中文提示。
- **希腊字母表**：列出全部 24 个字母的大小写、名称、发音和常见数学 / 科学用途。
- **UTF-8 / Unicode 编码查询**：输入任意字符即可查看其 Unicode 码点、UTF-8 字节和 HTML 实体。

## 开发与调试

```bash
pnpm install
pnpm dev
```

在浏览器访问 <http://localhost:3000> 查看页面。

## 构建

```bash
pnpm build
pnpm start
```

构建后的项目可直接部署到 Vercel 等主流前端托管平台。
