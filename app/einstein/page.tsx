"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Property = "color" | "nationality" | "drink" | "smoke" | "pet";

type PropertyValue = string | null;

interface HouseState {
  position: number;
  color: PropertyValue;
  nationality: PropertyValue;
  drink: PropertyValue;
  smoke: PropertyValue;
  pet: PropertyValue;
}

interface Deduction {
  houseIndex: number;
  property: Property;
  value: string;
  note?: string;
}

interface ClueStep {
  id: number;
  clue: string;
  reasoning: string;
  deductions: Deduction[];
}

interface StatusMessage {
  type: "success" | "error" | "info";
  text: string;
}

interface HistoryEntry {
  houses: HouseState[];
  step: number;
}

const PROPERTY_LABELS: Record<Property, string> = {
  color: "颜色",
  nationality: "国籍",
  drink: "饮品",
  smoke: "香烟",
  pet: "宠物",
};

const PROPERTY_OPTIONS: Record<Property, string[]> = {
  color: ["红色", "绿色", "白色", "黄色", "蓝色"],
  nationality: ["英国人", "瑞典人", "丹麦人", "挪威人", "德国人"],
  drink: ["茶", "咖啡", "牛奶", "啤酒", "水"],
  smoke: ["Pall Mall", "Dunhill", "Blend", "Prince", "Blue Master"],
  pet: ["狗", "鸟", "猫", "马", "鱼"],
};

const INITIAL_HOUSES: HouseState[] = [
  { position: 1, color: null, nationality: null, drink: null, smoke: null, pet: null },
  { position: 2, color: null, nationality: null, drink: null, smoke: null, pet: null },
  { position: 3, color: null, nationality: null, drink: null, smoke: null, pet: null },
  { position: 4, color: null, nationality: null, drink: null, smoke: null, pet: null },
  { position: 5, color: null, nationality: null, drink: null, smoke: null, pet: null },
];

const CLUE_STEPS: ClueStep[] = [
  {
    id: 1,
    clue: "挪威人住在第一间房子。",
    reasoning: "线索直接给出了第一间房的国籍。",
    deductions: [{ houseIndex: 0, property: "nationality", value: "挪威人" }],
  },
  {
    id: 2,
    clue: "挪威人住在蓝色房子旁边。",
    reasoning: "挪威人在最左侧，只能让第二间房变成蓝色来满足邻居条件。",
    deductions: [{ houseIndex: 1, property: "color", value: "蓝色" }],
  },
  {
    id: 3,
    clue: "中间的房子里的人喝牛奶。",
    reasoning: "第三间是中间位置，直接确定饮品为牛奶。",
    deductions: [{ houseIndex: 2, property: "drink", value: "牛奶" }],
  },
  {
    id: 4,
    clue: "绿色房子在白色房子的左边，且绿房子主人喝咖啡。",
    reasoning:
      "绿色房子必须紧挨着白色房子的左边，而第二间已经是蓝色、第三间喝牛奶，因此绿色和白色只能落在第四、第五间，绿色在左喝咖啡、白色在右。",
    deductions: [
      { houseIndex: 3, property: "color", value: "绿色" },
      { houseIndex: 3, property: "drink", value: "咖啡" },
      { houseIndex: 4, property: "color", value: "白色" },
    ],
  },
  {
    id: 5,
    clue: "英国人住在红色房子里。",
    reasoning: "红色只能出现在剩余未确定颜色的第三间房，因此英国人住在第三间。",
    deductions: [
      { houseIndex: 2, property: "color", value: "红色" },
      { houseIndex: 2, property: "nationality", value: "英国人" },
    ],
  },
  {
    id: 6,
    clue: "黄色房子的主人抽Dunhill。",
    reasoning: "剩余的颜色只剩黄色，对应第一间房，并立刻确定其香烟品牌。",
    deductions: [
      { houseIndex: 0, property: "color", value: "黄色" },
      { houseIndex: 0, property: "smoke", value: "Dunhill" },
    ],
  },
  {
    id: 7,
    clue: "养马的人住在抽Dunhill的人旁边。",
    reasoning: "第一间抽Dunhill，只能让第二间养马满足邻居关系。",
    deductions: [{ houseIndex: 1, property: "pet", value: "马" }],
  },
  {
    id: 8,
    clue: "抽Blend的人住在养猫的人旁边。",
    reasoning:
      "第二间需要与某个养猫的邻居相邻，而第一间是它唯一的邻居，因此第一间养猫、第二间抽Blend。",
    deductions: [
      { houseIndex: 0, property: "pet", value: "猫" },
      { houseIndex: 1, property: "smoke", value: "Blend" },
    ],
  },
  {
    id: 9,
    clue: "丹麦人喝茶。",
    reasoning:
      "第一间已经确定国籍、第三间是英国人、第四间喝咖啡，因此丹麦人只能在第二间，同时喝茶。",
    deductions: [
      { houseIndex: 1, property: "nationality", value: "丹麦人" },
      { houseIndex: 1, property: "drink", value: "茶" },
    ],
  },
  {
    id: 10,
    clue: "抽Pall Mall的人养鸟。",
    reasoning: "第三间尚未确定香烟和宠物，与这条线索完全匹配。",
    deductions: [
      { houseIndex: 2, property: "smoke", value: "Pall Mall" },
      { houseIndex: 2, property: "pet", value: "鸟" },
    ],
  },
  {
    id: 11,
    clue: "抽Blue Master的人喝啤酒。",
    reasoning: "第五间仍未确定饮品和香烟，结合约束可以一次性确定。",
    deductions: [
      { houseIndex: 4, property: "smoke", value: "Blue Master" },
      { houseIndex: 4, property: "drink", value: "啤酒" },
    ],
  },
  {
    id: 12,
    clue: "瑞典人养狗。",
    reasoning: "第五间剩余的国籍与宠物组合恰好符合该线索。",
    deductions: [
      { houseIndex: 4, property: "nationality", value: "瑞典人" },
      { houseIndex: 4, property: "pet", value: "狗" },
    ],
  },
  {
    id: 13,
    clue: "德国人抽Prince。",
    reasoning: "第四间仅剩的国籍是德国人，与Prince组合满足线索。",
    deductions: [
      { houseIndex: 3, property: "nationality", value: "德国人" },
      { houseIndex: 3, property: "smoke", value: "Prince" },
    ],
  },
  {
    id: 14,
    clue: "抽Blend的人住在喝水的人旁边。",
    reasoning:
      "抽Blend的是第二间，为满足邻居条件只剩第一间的饮品可以设置为水。",
    deductions: [{ houseIndex: 0, property: "drink", value: "水" }],
  },
  {
    id: 15,
    clue: "还剩下唯一未确定的宠物。",
    reasoning: "排除所有已知信息后，第四间的宠物只剩鱼，也回答了谜题。",
    deductions: [{ houseIndex: 3, property: "pet", value: "鱼" }],
  },
];

const FINAL_SOLUTION: HouseState[] = [
  { position: 1, color: "黄色", nationality: "挪威人", drink: "水", smoke: "Dunhill", pet: "猫" },
  { position: 2, color: "蓝色", nationality: "丹麦人", drink: "茶", smoke: "Blend", pet: "马" },
  { position: 3, color: "红色", nationality: "英国人", drink: "牛奶", smoke: "Pall Mall", pet: "鸟" },
  { position: 4, color: "绿色", nationality: "德国人", drink: "咖啡", smoke: "Prince", pet: "鱼" },
  { position: 5, color: "白色", nationality: "瑞典人", drink: "啤酒", smoke: "Blue Master", pet: "狗" },
];

const cloneHouses = (houses: HouseState[]): HouseState[] =>
  houses.map((house) => ({ ...house }));

const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      return undefined;
    }

    const tick = () => {
      savedCallback.current?.();
    };

    const id = window.setInterval(tick, delay);
    return () => window.clearInterval(id);
  }, [delay]);
};

const applyDeductions = (
  houses: HouseState[],
  deductions: Deduction[],
): HouseState[] => {
  const next = cloneHouses(houses);
  deductions.forEach(({ houseIndex, property, value }) => {
    next[houseIndex][property] = value;
  });
  return next;
};

const EinsteinPuzzlePage = () => {
  const [houses, setHouses] = useState<HouseState[]>(() => cloneHouses(INITIAL_HOUSES));
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [history, setHistory] = useState<{ past: HistoryEntry[]; future: HistoryEntry[] }>(
    () => ({ past: [], future: [] }),
  );
  const [autoPlay, setAutoPlay] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const activeClue = CLUE_STEPS[currentStep] ?? null;

  const progress = useMemo(() => {
    const filled = houses.reduce((count, house) => {
      const values = Object.entries(house).filter(([key]) => key !== "position");
      return count + values.filter(([, value]) => value !== null).length;
    }, 0);
    return Math.round((filled / (houses.length * 5)) * 100);
  }, [houses]);

  const pushHistory = (nextHouses: HouseState[]) => {
    setHistory((prev) => ({
      past: [...prev.past, { houses: cloneHouses(houses), step: currentStep }],
      future: [],
    }));
    setHouses(nextHouses);
  };

  const setStatusMessage = (message: StatusMessage | null, duration = 3200) => {
    setStatus(message);
    if (message && duration) {
      const timer = window.setTimeout(() => setStatus(null), duration);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  };

  const validateState = (next: HouseState[]): { valid: boolean; message?: string } => {
    const neighbors = (index: number) => [next[index - 1], next[index + 1]].filter(Boolean);

    const fail = (message: string) => ({ valid: false, message });

    for (const prop of Object.keys(PROPERTY_OPTIONS) as Property[]) {
      const seen = new Set<string>();
      for (const house of next) {
        const value = house[prop];
        if (!value) continue;
        if (seen.has(value)) {
          return fail(`${PROPERTY_LABELS[prop]}“${value}”已经被使用。`);
        }
        seen.add(value);
      }
    }

    if (next[0].nationality && next[0].nationality !== "挪威人") {
      return fail("第一间房必须是挪威人。");
    }
    if (next[2].drink && next[2].drink !== "牛奶") {
      return fail("第三间房必须喝牛奶。");
    }

    const pairings: Array<[
      Property,
      string,
      Property,
      string,
      string,
    ]> = [
      ["nationality", "英国人", "color", "红色", "英国人住在红色房子里"],
      ["nationality", "瑞典人", "pet", "狗", "瑞典人必须养狗"],
      ["nationality", "丹麦人", "drink", "茶", "丹麦人必须喝茶"],
      ["color", "绿色", "drink", "咖啡", "绿色房子必须喝咖啡"],
      ["color", "黄色", "smoke", "Dunhill", "黄色房子必须抽Dunhill"],
      ["smoke", "Pall Mall", "pet", "鸟", "抽Pall Mall 的人养鸟"],
      ["smoke", "Blue Master", "drink", "啤酒", "抽 Blue Master 的人喝啤酒"],
      ["nationality", "德国人", "smoke", "Prince", "德国人抽 Prince"],
    ];

    for (const [propA, valueA, propB, valueB, message] of pairings) {
      for (const house of next) {
        if (house[propA] === valueA && house[propB] && house[propB] !== valueB) {
          return fail(message);
        }
        if (house[propB] === valueB && house[propA] && house[propA] !== valueA) {
          return fail(message);
        }
      }
    }

    const greenIndex = next.findIndex((house) => house.color === "绿色");
    const whiteIndex = next.findIndex((house) => house.color === "白色");
    if (greenIndex === 4) {
      return fail("绿色房子必须在白色房子的左边。");
    }
    if (whiteIndex === 0) {
      return fail("白色房子不能在第一个位置。");
    }
    if (greenIndex !== -1 && whiteIndex !== -1 && greenIndex !== whiteIndex - 1) {
      return fail("绿色房子必须紧挨在白色房子的左边。");
    }

    const ensureNeighbor = (
      index: number,
      predicate: (house: HouseState) => boolean,
      message: string,
    ): { valid: boolean; message?: string } => {
      const adjacent = neighbors(index);
      if (adjacent.length === 0) {
        return fail(message);
      }
      const satisfied = adjacent.some((house) => predicate(house));
      return satisfied ? { valid: true } : fail(message);
    };

    for (let index = 0; index < next.length; index += 1) {
      const house = next[index];
      if (!house) continue;

      if (house.smoke === "Blend") {
        const catCheck = ensureNeighbor(index, (neighbor) => !neighbor.pet || neighbor.pet === "猫", "抽 Blend 的人旁边必须有人养猫。");
        if (!catCheck.valid) return catCheck;
        const waterCheck = ensureNeighbor(index, (neighbor) => !neighbor.drink || neighbor.drink === "水", "抽 Blend 的人旁边必须有人喝水。");
        if (!waterCheck.valid) return waterCheck;
      }
      if (house.pet === "猫") {
        const check = ensureNeighbor(index, (neighbor) => !neighbor.smoke || neighbor.smoke === "Blend", "养猫的人旁边必须有人抽 Blend。");
        if (!check.valid) return check;
      }
      if (house.pet === "马") {
        const check = ensureNeighbor(index, (neighbor) => !neighbor.smoke || neighbor.smoke === "Dunhill", "养马的人旁边必须有人抽 Dunhill。");
        if (!check.valid) return check;
      }
      if (house.smoke === "Dunhill") {
        const check = ensureNeighbor(index, (neighbor) => !neighbor.pet || neighbor.pet === "马", "抽 Dunhill 的人旁边必须有人养马。");
        if (!check.valid) return check;
      }
      if (house.drink === "水") {
        const check = ensureNeighbor(index, (neighbor) => !neighbor.smoke || neighbor.smoke === "Blend", "喝水的人旁边必须有人抽 Blend。");
        if (!check.valid) return check;
      }
      if (house.nationality === "挪威人") {
        const check = ensureNeighbor(index, (neighbor) => !neighbor.color || neighbor.color === "蓝色", "挪威人必须住在蓝色房子旁边。");
        if (!check.valid) return check;
      }
      if (house.color === "蓝色") {
        const check = ensureNeighbor(index, (neighbor) => !neighbor.nationality || neighbor.nationality === "挪威人", "蓝色房子必须挨着挪威人。");
        if (!check.valid) return check;
      }
    }

    return { valid: true };
  };

  const handleSelection = (houseIndex: number, property: Property, value: string) => {
    const next = cloneHouses(houses);
    next[houseIndex][property] = value;
    try {
      const validation = validateState(next);
      if (!validation.valid) {
        setStatusMessage({ type: "error", text: validation.message ?? "选择无效" });
        return;
      }
      pushHistory(next);
      setStatusMessage({
        type: "success",
        text: `第${houseIndex + 1}间房的${PROPERTY_LABELS[property]}更新为 ${value}`,
      });
      setHint(null);
      if (isSolved(next)) {
        setStatusMessage({ type: "success", text: "恭喜！你已经解开了谜题。" }, 0);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "选择无效";
      setStatusMessage({ type: "error", text: message });
    }
  };

  const isSolved = (state: HouseState[]) =>
    state.every((house) =>
      (Object.keys(PROPERTY_OPTIONS) as Property[]).every((prop) => Boolean(house[prop])),
    );

  const goToNextStep = () => {
    if (!activeClue) {
      return;
    }

    const next = applyDeductions(houses, activeClue.deductions);
    try {
      const validation = validateState(next);
      if (!validation.valid) {
        setStatusMessage({ type: "error", text: validation.message ?? "步骤无效" });
        return;
      }
      pushHistory(next);
      setCurrentStep((prev) => prev + 1);
      setStatusMessage({ type: "success", text: `应用线索 ${activeClue.id}: ${activeClue.clue}` });
      setHint(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "步骤无效";
      setStatusMessage({ type: "error", text: message });
    }
  };

  const goToPreviousState = () => {
    setHistory((prev) => {
      if (prev.past.length === 0) {
        return prev;
      }

      const past = [...prev.past];
      const previous = past.pop()!;
      const futureEntry: HistoryEntry = { houses: cloneHouses(houses), step: currentStep };
      setHouses(cloneHouses(previous.houses));
      setCurrentStep(previous.step);
      return { past, future: [futureEntry, ...prev.future] };
    });
  };

  const redo = () => {
    setHistory((prev) => {
      if (prev.future.length === 0) {
        return prev;
      }
      const [nextEntry, ...rest] = prev.future;
      const pastEntry: HistoryEntry = { houses: cloneHouses(houses), step: currentStep };
      setHouses(cloneHouses(nextEntry.houses));
      setCurrentStep(nextEntry.step);
      return { past: [...prev.past, pastEntry], future: rest };
    });
  };

  const reset = () => {
    setHouses(cloneHouses(INITIAL_HOUSES));
    setCurrentStep(0);
    setHistory({ past: [], future: [] });
    setAutoPlay(false);
    setHint(null);
    setStatusMessage({ type: "info", text: "已重置谜题，请重新开始。" });
  };

  const revealSolution = () => {
    setHouses(cloneHouses(FINAL_SOLUTION));
    setCurrentStep(CLUE_STEPS.length);
    setHistory({ past: [], future: [] });
    setAutoPlay(false);
    setStatusMessage({ type: "success", text: "已展示完整解答。" });
  };

  const provideHint = () => {
    const suggestions: string[] = [];

    if (!houses[0].nationality) {
      suggestions.push("提示：第一间房的居民是挪威人。");
    }
    if (!houses[2].drink) {
      suggestions.push("提示：第三间房一定喝牛奶。");
    }

    houses.forEach((house, index) => {
      (Object.keys(PROPERTY_OPTIONS) as Property[]).forEach((prop) => {
        if (house[prop]) return;
        PROPERTY_OPTIONS[prop].forEach((value) => {
          const candidate = cloneHouses(houses);
          candidate[index][prop] = value;
          const { valid } = validateState(candidate);
          if (valid) {
            suggestions.push(`可以尝试给第${index + 1}间房的${PROPERTY_LABELS[prop]}赋值为 ${value}`);
          }
        });
      });
    });

    const uniqueSuggestions = Array.from(new Set(suggestions));
    setHint(uniqueSuggestions.slice(0, 3).join("\n"));
  };

  useInterval(() => {
    if (!autoPlay) {
      return;
    }
    if (currentStep >= CLUE_STEPS.length) {
      setAutoPlay(false);
      return;
    }
    goToNextStep();
  }, autoPlay ? 1800 : null);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header className="space-y-4 rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">爱因斯坦之谜（斑马谜题）</h1>
        <p className="text-base leading-relaxed text-slate-600">
          下面的演示基于经典的 5 栋房屋逻辑推理问题。原始实现中的主要 Bug 来自于对线索的错误假设：
          把“挪威人住在蓝色房子旁边”误写成“第二间房一定是蓝色”，并且在应用线索时总是选择第一个可用房间，导致与其他线索冲突，解不出唯一答案。
          本页面使用类型安全的状态管理和严格的约束校验，确保每一步推理都符合所有线索。
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <article className="rounded-xl border border-amber-200 bg-amber-50/80 p-6">
            <h2 className="mb-3 text-xl font-semibold text-amber-800">操作说明</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-amber-900">
              <li>• 点击“下一步”按照线索自动填入推理结果。</li>
              <li>• 点击“自动演示”可以自动播放每条线索的推导过程。</li>
              <li>• 通过下拉框可以自行尝试填入属性，系统会实时校验是否违反线索。</li>
              <li>• “提示”会给出当前可行的下一步建议，“撤销/重做”用于回到历史状态。</li>
            </ul>
          </article>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={goToPreviousState}
                disabled={!canUndo}
                className="rounded-md bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                title={canUndo ? `可撤销 ${history.past.length} 步` : "没有可撤销的操作"}
              >
                撤销
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className="rounded-md bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                title={canRedo ? `可重做 ${history.future.length} 步` : "没有可重做的操作"}
              >
                重做
              </button>
            </div>
            <button
              type="button"
              onClick={goToNextStep}
              disabled={currentStep >= CLUE_STEPS.length}
              className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              下一步
            </button>
            <button
              type="button"
              onClick={() => setAutoPlay((prev) => !prev)}
              disabled={currentStep >= CLUE_STEPS.length}
              className="rounded-md bg-sky-500 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {autoPlay ? "暂停" : "自动演示"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-slate-700"
            >
              重置
            </button>
            <button
              type="button"
              onClick={provideHint}
              className="rounded-md bg-orange-500 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-orange-400"
            >
              提示
            </button>
            <button
              type="button"
              onClick={revealSolution}
              className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white shadow hover:bg-emerald-500"
            >
              查看答案
            </button>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <span>当前进度：</span>
            <span className="font-semibold text-blue-600">
              {Math.min(currentStep, CLUE_STEPS.length)} / {CLUE_STEPS.length}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} />
          </div>

          {hint && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              {hint.split("\n").map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}

          {status && (
            <div
              className={`rounded-lg border p-4 text-sm font-medium shadow-sm transition ${
                status.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : status.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {status.text}
            </div>
          )}

          <section className="grid gap-4 rounded-xl border border-slate-200 bg-white/80 p-4 md:grid-cols-5">
            {houses.map((house, index) => (
              <div key={house.position} className="space-y-3 rounded-lg border border-slate-200 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-800">房子 {house.position}</h3>
                  <span className="text-xs font-medium uppercase text-slate-500">#{house.position}</span>
                </div>
                {(Object.keys(PROPERTY_OPTIONS) as Property[]).map((property) => (
                  <label key={property} className="block space-y-1 text-sm">
                    <span className="text-xs font-semibold text-slate-500">{PROPERTY_LABELS[property]}</span>
                    <select
                      value={house[property] ?? ""}
                      onChange={(event) => handleSelection(index, property, event.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">请选择</option>
                      {PROPERTY_OPTIONS[property].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            ))}
          </section>
        </div>

        <aside className="space-y-4 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">线索与推理</h2>
          <ol className="space-y-3 text-sm text-slate-600">
            {CLUE_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              return (
                <li
                  key={step.id}
                  className={`rounded-lg border p-3 transition ${
                    isActive
                      ? "border-blue-300 bg-blue-50"
                      : isCompleted
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="font-medium text-slate-800">{step.id}. {step.clue}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.reasoning}</p>
                </li>
              );
            })}
          </ol>
        </aside>
      </section>

      {isSolved(houses) && (
        <section className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-6">
          <h2 className="text-xl font-semibold text-emerald-900">谜题解答</h2>
          <p className="text-sm text-emerald-800">最终结果显示：德国人养鱼。</p>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-emerald-200 bg-white text-sm">
              <thead className="bg-emerald-100 text-emerald-900">
                <tr>
                  <th className="px-3 py-2 text-left">房子</th>
                  {(Object.keys(PROPERTY_OPTIONS) as Property[]).map((property) => (
                    <th key={property} className="px-3 py-2 text-left">{PROPERTY_LABELS[property]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {houses.map((house) => (
                  <tr key={house.position} className="even:bg-emerald-50">
                    <td className="px-3 py-2 font-semibold">{house.position}</td>
                    {(Object.keys(PROPERTY_OPTIONS) as Property[]).map((property) => (
                      <td key={property} className="px-3 py-2">
                        {house[property] ?? "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default EinsteinPuzzlePage;

