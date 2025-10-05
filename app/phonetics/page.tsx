const consonantGroups = [
  {
    title: '爆破音',
    description: '气流被完全阻断后瞬间释放。',
    symbols: [
      { ipa: 'p', keyword: 'pen', note: '清双唇爆破音，类似“破”。' },
      { ipa: 'b', keyword: 'bad', note: '浊双唇爆破音，发声带振动。' },
      { ipa: 't', keyword: 'top', note: '清舌尖爆破音，类似“它”。' },
      { ipa: 'd', keyword: 'dog', note: '浊舌尖爆破音。' },
      { ipa: 'k', keyword: 'cat', note: '清软腭爆破音。“克”。' },
      { ipa: 'g', keyword: 'go', note: '浊软腭爆破音。' }
    ]
  },
  {
    title: '摩擦音',
    description: '气流经窄缝摩擦产生噪音。',
    symbols: [
      { ipa: 'f', keyword: 'find', note: '清唇齿摩擦音。' },
      { ipa: 'v', keyword: 'voice', note: '浊唇齿摩擦音。' },
      { ipa: 'θ', keyword: 'think', note: '清舌尖齿间摩擦音。' },
      { ipa: 'ð', keyword: 'this', note: '浊舌尖齿间摩擦音。' },
      { ipa: 's', keyword: 'see', note: '清齿龈摩擦音。' },
      { ipa: 'z', keyword: 'zoo', note: '浊齿龈摩擦音。' },
      { ipa: 'ʃ', keyword: 'she', note: '清后齿龈摩擦音，类似“西”。' },
      { ipa: 'ʒ', keyword: 'vision', note: '浊后齿龈摩擦音。' },
      { ipa: 'h', keyword: 'hat', note: '清声门摩擦音。' }
    ]
  },
  {
    title: '塞擦音与其他',
    description: '爆破与摩擦结合或特殊辅音。',
    symbols: [
      { ipa: 'tʃ', keyword: 'chair', note: '清塞擦音，类似“吃”。' },
      { ipa: 'dʒ', keyword: 'job', note: '浊塞擦音，类似“汁”。' },
      { ipa: 'm', keyword: 'man', note: '鼻音，双唇闭合气流从鼻腔通过。' },
      { ipa: 'n', keyword: 'no', note: '齿龈鼻音。' },
      { ipa: 'ŋ', keyword: 'sing', note: '软腭鼻音，中文“ng”。' },
      { ipa: 'l', keyword: 'light', note: '边音，气流从舌两侧通过。' },
      { ipa: 'r', keyword: 'red', note: '近音，美式卷舌。' },
      { ipa: 'j', keyword: 'yes', note: '半元音，类似汉语“y”。' },
      { ipa: 'w', keyword: 'we', note: '半元音，圆唇滑音。' }
    ]
  }
];

const vowelGroups = [
  {
    title: '单元音',
    description: '口型基本不变化，分长短元音。',
    symbols: [
      { ipa: 'iː', keyword: 'see', note: '长前高元音，如“衣”。' },
      { ipa: 'ɪ', keyword: 'sit', note: '短前高元音，如“已”。' },
      { ipa: 'e', keyword: 'bed', note: '前中元音，如“诶”。' },
      { ipa: 'æ', keyword: 'cat', note: '前低元音，接近“哎”。' },
      { ipa: 'ɑː', keyword: 'car', note: '长后低元音，类似“啊”。' },
      { ipa: 'ɒ', keyword: 'hot', note: '短后低元音，英式常用。' },
      { ipa: 'ɔː', keyword: 'law', note: '长后中元音，如“哦”。' },
      { ipa: 'ʊ', keyword: 'book', note: '短后高元音，如“乌”。' },
      { ipa: 'uː', keyword: 'blue', note: '长后高元音，嘴唇更圆。' },
      { ipa: 'ʌ', keyword: 'cup', note: '中低元音，类似“啊”的短音。' },
      { ipa: 'ɜː', keyword: 'bird', note: '卷舌中元音，美式 /ɝ/。' },
      { ipa: 'ə', keyword: 'about', note: '中央元音，弱读最常见。' }
    ]
  },
  {
    title: '双元音',
    description: '发音过程中口型滑动变化。',
    symbols: [
      { ipa: 'eɪ', keyword: 'face', note: '从 /e/ 滑向 /ɪ/，如“诶”。' },
      { ipa: 'aɪ', keyword: 'time', note: '从 /a/ 滑向 /ɪ/，如“爱”。' },
      { ipa: 'ɔɪ', keyword: 'boy', note: '从 /ɔ/ 滑向 /ɪ/，如“喔伊”。' },
      { ipa: 'aʊ', keyword: 'now', note: '从 /a/ 滑向 /ʊ/，如“傲”。' },
      { ipa: 'əʊ', keyword: 'go', note: '从 /ə/ 滑向 /ʊ/，英式发音。' },
      { ipa: 'oʊ', keyword: 'go (US)', note: '美式常用滑向 /ʊ/ 的双元音。' },
      { ipa: 'ɪə', keyword: 'near', note: '英式从 /ɪ/ 到 /ə/。' },
      { ipa: 'eə', keyword: 'hair', note: '英式 /e/ 到 /ə/。' },
      { ipa: 'ʊə', keyword: 'pure', note: '英式 /ʊ/ 到 /ə/。' }
    ]
  }
];

export default function PhoneticsPage() {
  return (
    <div className="space-y-10">
      <section className="table-card">
        <h1>英语国际音标（IPA）</h1>
        <p className="mt-3 text-sm text-slate-300">
          国际音标帮助学习者准确掌握英语发音。下方表格按照发音方式和元音类型分类，包含代表单词与中文提示。
        </p>
      </section>

      <section className="space-y-6">
        {consonantGroups.map((group) => (
          <article key={group.title} className="table-card">
            <h2>{group.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{group.description}</p>
            <table>
              <thead>
                <tr>
                  <th>音标</th>
                  <th>示例单词</th>
                  <th>发音提示</th>
                </tr>
              </thead>
              <tbody>
                {group.symbols.map((symbol) => (
                  <tr key={symbol.ipa}>
                    <td className="font-semibold text-white">/{symbol.ipa}/</td>
                    <td className="text-slate-200">{symbol.keyword}</td>
                    <td className="text-slate-300">{symbol.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </section>

      <section className="space-y-6">
        {vowelGroups.map((group) => (
          <article key={group.title} className="table-card">
            <h2>{group.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{group.description}</p>
            <table>
              <thead>
                <tr>
                  <th>音标</th>
                  <th>示例单词</th>
                  <th>发音提示</th>
                </tr>
              </thead>
              <tbody>
                {group.symbols.map((symbol) => (
                  <tr key={symbol.ipa}>
                    <td className="font-semibold text-white">/{symbol.ipa}/</td>
                    <td className="text-slate-200">{symbol.keyword}</td>
                    <td className="text-slate-300">{symbol.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ))}
      </section>
    </div>
  );
}
