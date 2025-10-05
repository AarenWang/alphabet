const greekLetters = [
  {
    upper: 'Α',
    lower: 'α',
    name: 'Alpha',
    pronunciation: '发音近似 /ˈæl-fə/，中文“阿尔法”。',
    usage: '常表示角度、系数，或统计学中的显著性水平。'
  },
  {
    upper: 'Β',
    lower: 'β',
    name: 'Beta',
    pronunciation: '发音近似 /ˈbeɪ-tə/，中文“贝塔”。',
    usage: '金融中的系统风险系数、试验版本、粒子β。'
  },
  {
    upper: 'Γ',
    lower: 'γ',
    name: 'Gamma',
    pronunciation: '发音 /ˈɡæm-ə/，中文“伽马”。',
    usage: '电磁谱γ射线、欧拉伽马函数 Γ(n)。'
  },
  {
    upper: 'Δ',
    lower: 'δ',
    name: 'Delta',
    pronunciation: '发音 /ˈdɛl-tə/，中文“德尔塔”。',
    usage: '表示变化量 Δx、矩阵行列式、导数δ。'
  },
  {
    upper: 'Ε',
    lower: 'ε',
    name: 'Epsilon',
    pronunciation: '发音 /ˈɛp-sə-ˌlɑːn/，中文“艾普西隆”。',
    usage: '极小量 ε→0，微积分极限、介电常数。'
  },
  {
    upper: 'Ζ',
    lower: 'ζ',
    name: 'Zeta',
    pronunciation: '发音 /ˈzeɪ-tə/，中文“泽塔”。',
    usage: '黎曼 ζ(s) 函数、阻尼比。'
  },
  {
    upper: 'Η',
    lower: 'η',
    name: 'Eta',
    pronunciation: '发音 /ˈeɪ-tə/，中文“伊塔”。',
    usage: '效率系数 η、电荷密度符号。'
  },
  {
    upper: 'Θ',
    lower: 'θ',
    name: 'Theta',
    pronunciation: '发音 /ˈθiː-tə/，中文“西塔”。',
    usage: '数学中角度、贝叶斯参数、渐进复杂度 Θ(n)。'
  },
  {
    upper: 'Ι',
    lower: 'ι',
    name: 'Iota',
    pronunciation: '发音 /aɪˈoʊ-tə/，中文“约塔”。',
    usage: '表示极小量“一点点”，电流密度。'
  },
  {
    upper: 'Κ',
    lower: 'κ',
    name: 'Kappa',
    pronunciation: '发音 /ˈkæp-ə/，中文“卡帕”。',
    usage: '曲率 κ、显著性检验卡帕统计量。'
  },
  {
    upper: 'Λ',
    lower: 'λ',
    name: 'Lambda',
    pronunciation: '发音 /ˈlæm-də/，中文“拉姆达”。',
    usage: '波长 λ、特征值、拉普拉斯算子。'
  },
  {
    upper: 'Μ',
    lower: 'μ',
    name: 'Mu',
    pronunciation: '发音 /mjuː/，中文“缪”。',
    usage: '平均值 μ、摩擦系数、前缀微。'
  },
  {
    upper: 'Ν',
    lower: 'ν',
    name: 'Nu',
    pronunciation: '发音 /njuː/，中文“纽”。',
    usage: '流体动力学中的 kinematic viscosity ν。'
  },
  {
    upper: 'Ξ',
    lower: 'ξ',
    name: 'Xi',
    pronunciation: '发音 /ksaɪ/ 或 /zaɪ/，中文“克西”。',
    usage: '随机变量 ξ、高能物理 Ξ 粒子。'
  },
  {
    upper: 'Ο',
    lower: 'ο',
    name: 'Omicron',
    pronunciation: '发音 /ˈoʊ-mɪ-ˌkrɒn/，中文“奥密克戎”。',
    usage: '较少使用，可表示小写字母 o。'
  },
  {
    upper: 'Π',
    lower: 'π',
    name: 'Pi',
    pronunciation: '发音 /paɪ/，中文“派”。',
    usage: '圆周率 π、乘积符号 Π。'
  },
  {
    upper: 'Ρ',
    lower: 'ρ',
    name: 'Rho',
    pronunciation: '发音 /roʊ/，中文“柔”。',
    usage: '密度 ρ、相关系数 ρ。'
  },
  {
    upper: 'Σ',
    lower: 'σ',
    name: 'Sigma',
    pronunciation: '发音 /ˈsɪɡ-mə/，中文“西格玛”。',
    usage: '求和符号 Σ、标准差 σ。'
  },
  {
    upper: 'Τ',
    lower: 'τ',
    name: 'Tau',
    pronunciation: '发音 /tɔː/ 或 /taʊ/，中文“套”。',
    usage: '时间常数 τ、拓扑学的拓扑指数。'
  },
  {
    upper: 'Υ',
    lower: 'υ',
    name: 'Upsilon',
    pronunciation: '发音 /ˈʌp-sɪ-lɒn/，中文“宇普西隆”。',
    usage: '粒子物理 Υ 介子、希腊字母 upsilon。'
  },
  {
    upper: 'Φ',
    lower: 'φ',
    name: 'Phi',
    pronunciation: '发音 /faɪ/ 或 /fiː/，中文“斐”。',
    usage: '黄金比例 φ、电通量 Φ。'
  },
  {
    upper: 'Χ',
    lower: 'χ',
    name: 'Chi',
    pronunciation: '发音 /kaɪ/，中文“凯”。',
    usage: '卡方分布 χ²、χ 粒子。'
  },
  {
    upper: 'Ψ',
    lower: 'ψ',
    name: 'Psi',
    pronunciation: '发音 /psaɪ/，中文“普赛”。',
    usage: '量子力学波函数 ψ、心理学符号。'
  },
  {
    upper: 'Ω',
    lower: 'ω',
    name: 'Omega',
    pronunciation: '发音 /oʊˈmeɡ-ə/ 或 /ˈoʊ-mə-ɡə/，中文“欧米伽”。',
    usage: '欧姆 Ω、角速度 ω、最后结局。'
  }
];

export default function GreekPage() {
  return (
    <div className="space-y-8">
      <section className="table-card">
        <h1>希腊字母表</h1>
        <p className="mt-3 text-sm text-slate-300">
          希腊字母在数学、物理、工程领域广泛使用。以下表格列出每个字母的大小写形式、名称、发音以及常见用途。
        </p>
      </section>
      <section className="table-card overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>大写</th>
              <th>小写</th>
              <th>名称</th>
              <th>读音提示</th>
              <th>常见用途</th>
            </tr>
          </thead>
          <tbody>
            {greekLetters.map((letter) => (
              <tr key={letter.name}>
                <td className="font-semibold text-white">{letter.upper}</td>
                <td className="font-semibold text-white">{letter.lower}</td>
                <td className="text-slate-200">{letter.name}</td>
                <td className="text-slate-300">{letter.pronunciation}</td>
                <td className="text-slate-300">{letter.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
