import { AudioPlayer } from "@/components/AudioPlayer"

const consonantGroups = [
  {
    title: '爆破音',
    description: '气流被完全阻断后瞬间释放。',
    symbols: [
      { ipa: 'p', keyword: 'pen', note: '清双唇爆破音，类似"破"。', audio: '/audio/ipa_p.mp3' },
      { ipa: 'b', keyword: 'bad', note: '浊双唇爆破音，发声带振动。', audio: '/audio/ipa_b.mp3' },
      { ipa: 't', keyword: 'top', note: '清舌尖爆破音，类似"它"。', audio: '/audio/ipa_t.mp3' },
      { ipa: 'd', keyword: 'dog', note: '浊舌尖爆破音。', audio: '/audio/ipa_d.mp3' },
      { ipa: 'k', keyword: 'cat', note: '清软腭爆破音。"克"。', audio: '/audio/ipa_k.mp3' },
      { ipa: 'g', keyword: 'go', note: '浊软腭爆破音。', audio: '/audio/ipa_g.mp3' }
    ]
  },
  {
    title: '摩擦音',
    description: '气流经窄缝摩擦产生噪音。',
    symbols: [
      { ipa: 'f', keyword: 'find', note: '清唇齿摩擦音。', audio: '/audio/ipa_f.mp3' },
      { ipa: 'v', keyword: 'voice', note: '浊唇齿摩擦音。', audio: '/audio/ipa_v.mp3' },
      { ipa: 'θ', keyword: 'think', note: '清舌尖齿间摩擦音。', audio: '/audio/ipa_th.mp3' },
      { ipa: 'ð', keyword: 'this', note: '浊舌尖齿间摩擦音。', audio: '/audio/ipa_dh.mp3' },
      { ipa: 's', keyword: 'see', note: '清齿龈摩擦音。', audio: '/audio/ipa_s.mp3' },
      { ipa: 'z', keyword: 'zoo', note: '浊齿龈摩擦音。', audio: '/audio/ipa_z.mp3' },
      { ipa: 'ʃ', keyword: 'she', note: '清后齿龈摩擦音，类似"西"。', audio: '/audio/ipa_sh.mp3' },
      { ipa: 'ʒ', keyword: 'vision', note: '浊后齿龈摩擦音。', audio: '/audio/ipa_zh.mp3' },
      { ipa: 'h', keyword: 'hat', note: '清声门摩擦音。', audio: '/audio/ipa_h.mp3' }
    ]
  },
  {
    title: '塞擦音与其他',
    description: '爆破与摩擦结合或特殊辅音。',
    symbols: [
      { ipa: 'tʃ', keyword: 'chair', note: '清塞擦音，类似"吃"。', audio: '/audio/ipa_tch.mp3' },
      { ipa: 'dʒ', keyword: 'job', note: '浊塞擦音，类似"汁"。', audio: '/audio/ipa_dj.mp3' },
      { ipa: 'm', keyword: 'man', note: '鼻音，双唇闭合气流从鼻腔通过。', audio: '/audio/ipa_m.mp3' },
      { ipa: 'n', keyword: 'no', note: '齿龈鼻音。', audio: '/audio/ipa_n.mp3' },
      { ipa: 'ŋ', keyword: 'sing', note: '软腭鼻音，中文"ng"。', audio: '/audio/ipa_ng.mp3' },
      { ipa: 'l', keyword: 'light', note: '边音，气流从舌两侧通过。', audio: '/audio/ipa_l.mp3' },
      { ipa: 'r', keyword: 'red', note: '近音，美式卷舌。', audio: '/audio/ipa_r.mp3' },
      { ipa: 'j', keyword: 'yes', note: '半元音，类似汉语"y"。', audio: '/audio/ipa_j.mp3' },
      { ipa: 'w', keyword: 'we', note: '半元音，圆唇滑音。', audio: '/audio/ipa_w.mp3' }
    ]
  }
];

const vowelGroups = [
  {
    title: '单元音',
    description: '口型基本不变化，分长短元音。',
    symbols: [
      { ipa: 'i', keyword: 'see', note: '长前高元音，如"衣"。', audio: '/audio/ipa_i.mp3' },
      { ipa: 'ɪ', keyword: 'sit', note: '短前高元音，如"已"。', audio: '/audio/ipa_ii.mp3' },
      { ipa: 'e', keyword: 'bed', note: '前中元音，如"诶"。', audio: '/audio/ipa_e.mp3' },
      { ipa: 'ɛ', keyword: 'let', note: '前中低元音。', audio: '/audio/ipa_ee.mp3' },
      { ipa: 'æ', keyword: 'cat', note: '前低元音，接近"哎"。', audio: '/audio/ipa_ae.mp3' },
      { ipa: 'ɑ', keyword: 'car', note: '长后低元音，类似"啊"。', audio: '/audio/ipa_aa.mp3' },
      { ipa: 'ɔ', keyword: 'law', note: '长后中元音，如"哦"。', audio: '/audio/ipa_oo.mp3' },
      { ipa: 'ʊ', keyword: 'book', note: '短后高元音，如"乌"。', audio: '/audio/ipa_uu.mp3' },
      { ipa: 'u', keyword: 'blue', note: '长后高元音，嘴唇更圆。', audio: '/audio/ipa_u.mp3' },
      { ipa: 'ʌ', keyword: 'cup', note: '中低元音，类似"啊"的短音。', audio: '/audio/ipa_uh.mp3' },
      { ipa: 'ə', keyword: 'about', note: '中央元音，弱读最常见。', audio: '/audio/ipa_uh.mp3' }
    ]
  },
  {
    title: '双元音',
    description: '发音过程中口型滑动变化。',
    symbols: [
      { ipa: 'oʊ', keyword: 'go', note: '美式常用滑向 /ʊ/ 的双元音。', audio: '/audio/ipa_o.mp3' },
      { ipa: 'aɪ', keyword: 'time', note: '从 /a/ 滑向 /ɪ/，如"爱"。', audio: '/audio/ipa_ai.mp3' },
      { ipa: 'ɔɪ', keyword: 'boy', note: '从 /ɔ/ 滑向 /ɪ/，如"喔伊"。', audio: '/audio/ipa_oi.mp3' },
      { ipa: 'aʊ', keyword: 'now', note: '从 /a/ 滑向 /ʊ/，如"傲"。', audio: '/audio/ipa_au.mp3' }
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
                  <th>发音</th>
                </tr>
              </thead>
              <tbody>
                {group.symbols.map((symbol) => (
                  <tr key={symbol.ipa}>
                    <td className="font-semibold text-white">/{symbol.ipa}/</td>
                    <td className="text-slate-200">{symbol.keyword}</td>
                    <td className="text-slate-300">{symbol.note}</td>
                    <td>
                      <AudioPlayer src={symbol.audio} />
                    </td>
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
                  <th>发音</th>
                </tr>
              </thead>
              <tbody>
                {group.symbols.map((symbol) => (
                  <tr key={symbol.ipa}>
                    <td className="font-semibold text-white">/{symbol.ipa}/</td>
                    <td className="text-slate-200">{symbol.keyword}</td>
                    <td className="text-slate-300">{symbol.note}</td>
                    <td>
                      <AudioPlayer src={symbol.audio} />
                    </td>
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
