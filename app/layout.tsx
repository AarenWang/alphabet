import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

const navigation = [
  { href: '/', label: '首页' },
  { href: '/phonetics', label: '英语音标' },
  { href: '/greek', label: '希腊字母' },
  { href: '/encoding', label: '编码查询' }
];

export const metadata: Metadata = {
  title: 'Alphabet 语言学习工具',
  description: '英语音标、希腊字母和字符编码的交互式学习工具。'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
          <header className="mb-12 flex flex-col gap-6 border-b border-slate-800 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/" className="text-2xl font-semibold text-brand-light transition-colors hover:text-brand">
                Alphabet
              </Link>
              <p className="mt-2 text-sm text-slate-300">
                综合的语言学习与参考工具，覆盖英语音标、希腊字母和字符编码。
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-300">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-transparent px-4 py-2 transition-all hover:border-brand-light hover:bg-brand/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          <main className="flex-1 pb-16">{children}</main>
          <footer className="mt-auto border-t border-slate-800 pt-6 text-xs text-slate-500">
            数据来源于公开的语言与编码资料，适用于日常学习和快速查询。
          </footer>
        </div>
      </body>
    </html>
  );
}
