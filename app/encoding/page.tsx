'use client';

import { useMemo, useState } from 'react';

interface EncodingInfo {
  char: string;
  unicode: string;
  codePoint: number;
  utf8: string;
  html: string;
}

const encoder = new TextEncoder();

function toEncodingInfo(text: string): EncodingInfo[] {
  return Array.from(text).map((char) => {
    const codePoint = char.codePointAt(0) ?? 0;
    const hex = codePoint.toString(16).toUpperCase();
    const unicode = `U+${hex.padStart(4, '0')}`;
    const utf8Bytes = Array.from(encoder.encode(char))
      .map((byte) => `0x${byte.toString(16).toUpperCase().padStart(2, '0')}`)
      .join(' ');
    const html = `&#${codePoint}; / &#x${hex.toLowerCase()};`;

    return {
      char,
      unicode,
      codePoint,
      utf8: utf8Bytes,
      html
    };
  });
}

export default function EncodingPage() {
  const [input, setInput] = useState('Hello, 世界!');

  const results = useMemo(() => toEncodingInfo(input.trim() === '' ? ' ' : input), [input]);

  return (
    <div className="space-y-8">
      <section className="table-card">
        <h1>UTF-8 / Unicode 编码查询</h1>
        <p className="mt-3 text-sm text-slate-300">
          输入任意字符或短语，即可查看其 Unicode 码点、UTF-8 字节序列以及 HTML 转义表示。支持多字符同时查询。
        </p>
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
          <label className="flex-1 text-sm text-slate-300">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">输入文本</span>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-base text-white shadow-inner shadow-black/30 focus:border-brand-light focus:outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="例如：Hello 或 希"
            />
          </label>
          <button
            type="button"
            onClick={() => setInput('')}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-brand-light hover:bg-brand/10"
          >
            清空
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          提示：UTF-8 字节以十六进制显示，HTML 列展示十进制与十六进制实体。
        </p>
      </section>

      <section className="table-card overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th>字符</th>
              <th>Unicode</th>
              <th>码点 (十进制)</th>
              <th>UTF-8 字节</th>
              <th>HTML 实体</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={`${item.unicode}-${index}`}>
                <td className="font-semibold text-white">
                  {item.char === ' ' ? <span className="text-slate-400">(空格)</span> : item.char}
                </td>
                <td className="text-slate-200">{item.unicode}</td>
                <td className="text-slate-300">{item.codePoint}</td>
                <td className="text-slate-300">{item.utf8}</td>
                <td className="text-slate-300">{item.html}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
