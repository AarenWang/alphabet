import Link from 'next/link';

const features = [
  {
    title: '英语音标与发音',
    description: '按发音部位分类的音标表格、发音提示与示例单词。',
    href: '/phonetics',
    badge: '语音'
  },
  {
    title: '希腊字母参考',
    description: '字母名称、发音、常见数学和科学用法一览。',
    href: '/greek',
    badge: '字母'
  },
  {
    title: 'UTF-8 / Unicode 查询',
    description: '输入字符即可查看 Unicode 码点、UTF-8 字节和 HTML 转义序列。',
    href: '/encoding',
    badge: '编码'
  },
  {
    title: '机械键盘布局',
    description: '比较 100% 至 60% 各类配列，支持切换 Windows / Mac 键位并实时高亮按键输入。',
    href: '/keyboards',
    badge: '输入'
  },
  {
    title: '爱因斯坦之谜',
    description: '经典的逻辑推理谜题，通过线索逐步推理出每个房子的主人特征。',
    href: '/einstein',
    badge: '逻辑'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="table-card">
        <h1 className="text-3xl font-bold text-white">Alphabet 语言学习工具箱</h1>
        <p className="mt-4 text-slate-300">
          通过交互式卡片快速掌握英语音标、希腊字母的读音与用途，并能即时查询任意字符的 Unicode 与 UTF-8 编码。还包含逻辑推理谜题和键盘布局参考。
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="table-card transition-transform hover:-translate-y-1">
            <span className="badge">{feature.badge}</span>
            <h2 className="mt-3 text-xl font-semibold text-white">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-light">
              进入查看
              <svg
                className="ml-1 h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 5H15M15 5V12.5M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
