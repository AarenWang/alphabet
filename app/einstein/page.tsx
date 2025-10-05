"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const propertyOrder = ["color", "nationality", "drink", "smoke", "pet"] as const;

type Property = (typeof propertyOrder)[number];

type HouseState = {
  position: number;
} & Record<Property, string | null>;

type StepUpdate = {
  house: number;
  prop: Property;
  value: string;
};

type ClueStep = {
  id: number;
  clue: string;
  reasoning: string;
  updates: StepUpdate[];
};

type StatusType = "success" | "error" | "info";

type StatusMessage = {
  type: StatusType;
  message: string;
};

type ValidationError = {
  message: string;
  houseIndexes: number[];
};

type HistorySnapshot = {
  houses: HouseState[];
  step: number;
};

type HistoryState = {
  past: HistorySnapshot[];
  future: HistorySnapshot[];
};

const labels: Record<Property, string> = {
  color: "颜色",
  nationality: "国籍",
  drink: "饮品",
  smoke: "香烟",
  pet: "宠物",
};

const propertyOptions: Record<Property, string[]> = {
  color: ["红色", "绿色", "白色", "黄色", "蓝色"],
  nationality: ["英国人", "瑞典人", "丹麦人", "德国人", "挪威人"],
  drink: ["茶", "咖啡", "牛奶", "啤酒", "水"],
  smoke: ["Pall Mall", "Dunhill", "Blend", "Blue Master", "Prince"],
  pet: ["鸟", "狗", "马", "猫", "鱼"],
};

const initialHouses: HouseState[] = Array.from({ length: 5 }, (_, index) => ({
  position: index + 1,
  color: null,
  nationality: null,
  drink: null,
  smoke: null,
  pet: null,
}));

const clueSteps: ClueStep[] = [
  {
    id: 1,
    clue: "挪威人住在第一间房子。",
    reasoning: "根据线索 9，第一间房子的国籍立即确定为挪威人。",
    updates: [{ house: 0, prop: "nationality", value: "挪威人" }],
  },
  {
    id: 2,
    clue: "挪威人住在蓝色房子旁边。",
    reasoning:
      "挪威人的唯一邻居是第二间房子，因此第二间房子的颜色必须是蓝色。",
    updates: [{ house: 1, prop: "color", value: "蓝色" }],
  },
  {
    id: 3,
    clue: "中间的房子喝牛奶。",
    reasoning: "线索 8 指出第三间房子的饮品固定为牛奶。",
    updates: [{ house: 2, prop: "drink", value: "牛奶" }],
  },
  {
    id: 4,
    clue: "绿色的房子在白色房子的左边。",
    reasoning:
      "只有第四、第五间房子还能形成连续的组合，因此绿色房子在四号，白色房子在五号。",
    updates: [
      { house: 3, prop: "color", value: "绿色" },
      { house: 4, prop: "color", value: "白色" },
    ],
  },
  {
    id: 5,
    clue: "绿房子的主人喝咖啡。",
    reasoning: "结合线索 5，可确定第四间房子的饮品是咖啡。",
    updates: [{ house: 3, prop: "drink", value: "咖啡" }],
  },
  {
    id: 6,
    clue: "英国人住在红色房子里。",
    reasoning:
      "剩余的颜色只剩红色，对应的第三间房子必须住着英国人。",
    updates: [
      { house: 2, prop: "color", value: "红色" },
      { house: 2, prop: "nationality", value: "英国人" },
    ],
  },
  {
    id: 7,
    clue: "黄色房子的主人抽 Dunhill。",
    reasoning:
      "第一间房子的颜色只能是黄色，同时线索 7 绑定了 Dunhill 香烟。",
    updates: [
      { house: 0, prop: "color", value: "黄色" },
      { house: 0, prop: "smoke", value: "Dunhill" },
    ],
  },
  {
    id: 8,
    clue: "养马的人住在抽 Dunhill 的人旁边。",
    reasoning:
      "Dunhill 在一号房，唯一的邻居是二号房，因此二号房饲养马。",
    updates: [{ house: 1, prop: "pet", value: "马" }],
  },
  {
    id: 9,
    clue: "抽 Pall Mall 的人养鸟。",
    reasoning:
      "英国人不能抽其他品牌（Prince 属于德国人，Blue Master 需要啤酒，Blend 需要水的邻居），因此三号房只能抽 Pall Mall 并养鸟。",
    updates: [
      { house: 2, prop: "smoke", value: "Pall Mall" },
      { house: 2, prop: "pet", value: "鸟" },
    ],
  },
  {
    id: 10,
    clue: "抽 Blend 的人挨着养猫的人，并且挨着喝水的人。",
    reasoning:
      "Blend 不能在四号或五号，否则会与饮品和宠物线索冲突，因此二号房抽 Blend；于是邻居一号房喝水并养猫。",
    updates: [
      { house: 1, prop: "smoke", value: "Blend" },
      { house: 0, prop: "drink", value: "水" },
      { house: 0, prop: "pet", value: "猫" },
    ],
  },
  {
    id: 11,
    clue: "丹麦人喝茶。",
    reasoning:
      "茶只能出现在尚未确定饮品的二号或五号房。若五号房喝茶则无法满足啤酒与 Blue Master 的线索，因此二号房是丹麦人并喝茶。",
    updates: [
      { house: 1, prop: "nationality", value: "丹麦人" },
      { house: 1, prop: "drink", value: "茶" },
    ],
  },
  {
    id: 12,
    clue: "抽 Blue Master 的人喝啤酒。",
    reasoning:
      "剩余的饮品只有啤酒，且只能分配给五号房，因此五号房喝啤酒并抽 Blue Master。",
    updates: [
      { house: 4, prop: "drink", value: "啤酒" },
      { house: 4, prop: "smoke", value: "Blue Master" },
    ],
  },
  {
    id: 13,
    clue: "瑞典人养狗。",
    reasoning:
      "五号房的香烟不是 Prince，因此不可能是德国人。剩余国籍中只有瑞典人，与狗这一线索配对。",
    updates: [
      { house: 4, prop: "nationality", value: "瑞典人" },
      { house: 4, prop: "pet", value: "狗" },
    ],
  },
  {
    id: 14,
    clue: "德国人抽 Prince。",
    reasoning:
      "仅剩的国籍是德国人，与 Prince 相互绑定，因此四号房的主人是抽 Prince 的德国人。",
    updates: [
      { house: 3, prop: "nationality", value: "德国人" },
      { house: 3, prop: "smoke", value: "Prince" },
    ],
  },
  {
    id: 15,
    clue: "最终问题：谁养鱼？",
    reasoning:
      "所有其它宠物都已分配，剩余的四号房自然养鱼，也就回答了德国人养鱼的问题。",
    updates: [{ house: 3, prop: "pet", value: "鱼" }],
  },
];

function cloneHouses(houses: HouseState[]): HouseState[] {
  return houses.map((house) => ({ ...house }));
}

function getNeighborIndexes(index: number, length: number) {
  const neighbors: number[] = [];
  if (index > 0) {
    neighbors.push(index - 1);
  }
  if (index < length - 1) {
    neighbors.push(index + 1);
  }
  return neighbors;
}

function evaluateState(state: HouseState[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const prop of propertyOrder) {
    const seen = new Map<string, number>();
    state.forEach((house, index) => {
      const value = house[prop];
      if (!value) {
        return;
      }
      const duplicatedIndex = seen.get(value);
      if (duplicatedIndex !== undefined) {
        errors.push({
          message: `${labels[prop]}“${value}” 已经被第 ${state[duplicatedIndex].position} 间房子使用。`,
          houseIndexes: [index, duplicatedIndex],
        });
      } else {
        seen.set(value, index);
      }
    });
  }

  const firstHouse = state[0];
  if (firstHouse.nationality && firstHouse.nationality !== "挪威人") {
    errors.push({
      message: "第一间房子的国籍必须是挪威人。",
      houseIndexes: [0],
    });
  }

  const middleHouse = state[2];
  if (middleHouse.drink && middleHouse.drink !== "牛奶") {
    errors.push({
      message: "第三间房子的饮品必须是牛奶。",
      houseIndexes: [2],
    });
  }

  state.forEach((house, index) => {
    if (house.nationality === "英国人" && house.color && house.color !== "红色") {
      errors.push({
        message: "英国人必须住在红色房子里。",
        houseIndexes: [index],
      });
    }
    if (house.color === "红色" && house.nationality && house.nationality !== "英国人") {
      errors.push({
        message: "红色房子的主人必须是英国人。",
        houseIndexes: [index],
      });
    }

    if (house.nationality === "瑞典人" && house.pet && house.pet !== "狗") {
      errors.push({
        message: "瑞典人必须养狗。",
        houseIndexes: [index],
      });
    }
    if (house.pet === "狗" && house.nationality && house.nationality !== "瑞典人") {
      errors.push({
        message: "养狗的人必须是瑞典人。",
        houseIndexes: [index],
      });
    }

    if (house.nationality === "丹麦人" && house.drink && house.drink !== "茶") {
      errors.push({
        message: "丹麦人必须喝茶。",
        houseIndexes: [index],
      });
    }
    if (house.drink === "茶" && house.nationality && house.nationality !== "丹麦人") {
      errors.push({
        message: "喝茶的人必须是丹麦人。",
        houseIndexes: [index],
      });
    }

    if (house.color === "绿色") {
      if (index === state.length - 1) {
        errors.push({
          message: "绿色房子必须位于白色房子的左侧。",
          houseIndexes: [index],
        });
      } else {
        const rightNeighbor = state[index + 1];
        if (rightNeighbor.color && rightNeighbor.color !== "白色") {
          errors.push({
            message: "绿色房子右侧必须是白色房子。",
            houseIndexes: [index, index + 1],
          });
        }
      }
    }
    if (house.color === "白色") {
      if (index === 0) {
        errors.push({
          message: "白色房子不能位于第一位。",
          houseIndexes: [index],
        });
      } else {
        const leftNeighbor = state[index - 1];
        if (leftNeighbor.color && leftNeighbor.color !== "绿色") {
          errors.push({
            message: "白色房子左侧必须是绿色房子。",
            houseIndexes: [index - 1, index],
          });
        }
      }
    }

    if (house.color === "绿色" && house.drink && house.drink !== "咖啡") {
      errors.push({
        message: "绿色房子的主人必须喝咖啡。",
        houseIndexes: [index],
      });
    }
    if (house.drink === "咖啡" && house.color && house.color !== "绿色") {
      errors.push({
        message: "喝咖啡的人必须住在绿色房子里。",
        houseIndexes: [index],
      });
    }

    if (house.smoke === "Pall Mall" && house.pet && house.pet !== "鸟") {
      errors.push({
        message: "抽 Pall Mall 的人必须养鸟。",
        houseIndexes: [index],
      });
    }
    if (house.pet === "鸟" && house.smoke && house.smoke !== "Pall Mall") {
      errors.push({
        message: "养鸟的人必须抽 Pall Mall。",
        houseIndexes: [index],
      });
    }

    if (house.color === "黄色" && house.smoke && house.smoke !== "Dunhill") {
      errors.push({
        message: "黄色房子的主人必须抽 Dunhill。",
        houseIndexes: [index],
      });
    }
    if (house.smoke === "Dunhill" && house.color && house.color !== "黄色") {
      errors.push({
        message: "抽 Dunhill 的人必须住在黄色房子里。",
        houseIndexes: [index],
      });
    }

    if (house.smoke === "Blue Master" && house.drink && house.drink !== "啤酒") {
      errors.push({
        message: "抽 Blue Master 的人必须喝啤酒。",
        houseIndexes: [index],
      });
    }
    if (house.drink === "啤酒" && house.smoke && house.smoke !== "Blue Master") {
      errors.push({
        message: "喝啤酒的人必须抽 Blue Master。",
        houseIndexes: [index],
      });
    }

    if (house.nationality === "德国人" && house.smoke && house.smoke !== "Prince") {
      errors.push({
        message: "德国人必须抽 Prince。",
        houseIndexes: [index],
      });
    }
    if (house.smoke === "Prince" && house.nationality && house.nationality !== "德国人") {
      errors.push({
        message: "抽 Prince 的人必须是德国人。",
        houseIndexes: [index],
      });
    }

    const neighbors = getNeighborIndexes(index, state.length);

    if (house.smoke === "Blend") {
      const catSatisfied = neighbors.some((neighbor) => state[neighbor].pet === "猫");
      const catPossible = neighbors.some((neighbor) => state[neighbor].pet === null);
      if (!catSatisfied && !catPossible) {
        errors.push({
          message: "抽 Blend 的人必须挨着养猫的人。",
          houseIndexes: [index, ...neighbors],
        });
      }

      const waterSatisfied = neighbors.some((neighbor) => state[neighbor].drink === "水");
      const waterPossible = neighbors.some((neighbor) => state[neighbor].drink === null);
      if (!waterSatisfied && !waterPossible) {
        errors.push({
          message: "抽 Blend 的人必须挨着喝水的人。",
          houseIndexes: [index, ...neighbors],
        });
      }
    }

    if (house.pet === "猫") {
      const blendSatisfied = neighbors.some((neighbor) => state[neighbor].smoke === "Blend");
      const blendPossible = neighbors.some((neighbor) => state[neighbor].smoke === null);
      if (!blendSatisfied && !blendPossible) {
        errors.push({
          message: "养猫的人必须和抽 Blend 的人相邻。",
          houseIndexes: [index, ...neighbors],
        });
      }
    }

    if (house.drink === "水") {
      const blendSatisfied = neighbors.some((neighbor) => state[neighbor].smoke === "Blend");
      const blendPossible = neighbors.some((neighbor) => state[neighbor].smoke === null);
      if (!blendSatisfied && !blendPossible) {
        errors.push({
          message: "喝水的人必须和抽 Blend 的人相邻。",
          houseIndexes: [index, ...neighbors],
        });
      }
    }

    if (house.smoke === "Dunhill") {
      const horseSatisfied = neighbors.some((neighbor) => state[neighbor].pet === "马");
      const horsePossible = neighbors.some((neighbor) => state[neighbor].pet === null);
      if (!horseSatisfied && !horsePossible) {
        errors.push({
          message: "抽 Dunhill 的人旁边必须有人养马。",
          houseIndexes: [index, ...neighbors],
        });
      }
    }

    if (house.pet === "马") {
      const dunhillSatisfied = neighbors.some((neighbor) => state[neighbor].smoke === "Dunhill");
      const dunhillPossible = neighbors.some((neighbor) => state[neighbor].smoke === null);
      if (!dunhillSatisfied && !dunhillPossible) {
        errors.push({
          message: "养马的人必须挨着抽 Dunhill 的人。",
          houseIndexes: [index, ...neighbors],
        });
      }
    }

    if (house.nationality === "挪威人") {
      const blueSatisfied = neighbors.some((neighbor) => state[neighbor].color === "蓝色");
      const bluePossible = neighbors.some((neighbor) => state[neighbor].color === null);
      if (!blueSatisfied && !bluePossible) {
        errors.push({
          message: "挪威人必须住在蓝色房子的旁边。",
          houseIndexes: [index, ...neighbors],
        });
      }
    }

    if (house.color === "蓝色") {
      const norwegianSatisfied = neighbors.some(
        (neighbor) => state[neighbor].nationality === "挪威人",
      );
      const norwegianPossible = neighbors.some(
        (neighbor) => state[neighbor].nationality === null,
      );
      if (!norwegianSatisfied && !norwegianPossible) {
        errors.push({
          message: "蓝色房子必须与挪威人相邻。",
          houseIndexes: [index, ...neighbors],
        });
      }
    }
  });

  return errors;
}

function validateAssignment(state: HouseState[], houseIndex: number, prop: Property, value: string) {
  const updated = cloneHouses(state);
  updated[houseIndex] = { ...updated[houseIndex], [prop]: value };
  const errors = evaluateState(updated);
  if (errors.length > 0) {
    return { isValid: false, message: errors[0].message };
  }
  return { isValid: true };
}

function buildHints(state: HouseState[], nextStep: ClueStep | undefined) {
  const hints: string[] = [];
  if (nextStep) {
    hints.push(`下一条线索：${nextStep.clue}`);
    hints.push(nextStep.reasoning);
  }

  state.forEach((house, index) => {
    if (house.color === "绿色" && house.drink === null) {
      hints.push(`第 ${house.position} 间绿色房子的饮品只能是咖啡。`);
    }
    if (house.color === "黄色" && house.smoke === null) {
      hints.push(`第 ${house.position} 间黄色房子需要选择 Dunhill。`);
    }
    if (house.nationality === "德国人" && house.smoke === null) {
      hints.push(`第 ${house.position} 间德国人必须抽 Prince。`);
    }
    if (house.smoke === "Blend") {
      const neighbors = getNeighborIndexes(index, state.length).map((i) => state[i].position);
      hints.push(`抽 Blend 的人需要关注与第 ${neighbors.join("、")} 间房子的水和宠物关系。`);
    }
    if (house.pet === "马" && state[index].smoke !== null) {
      hints.push(`第 ${house.position} 间养马的人需要确认邻居是否抽 Dunhill。`);
    }
  });

  return Array.from(new Set(hints));
}

export default function EinsteinPuzzlePage() {
  const [houses, setHouses] = useState<HouseState[]>(() => cloneHouses(initialHouses));
  const [stepIndex, setStepIndex] = useState(0);
  const [history, setHistory] = useState<HistoryState>({ past: [], future: [] });
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [hintMessages, setHintMessages] = useState<string[]>([]);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const statusTimeout = useRef<NodeJS.Timeout | null>(null);

  const filledProperties = useMemo(
    () =>
      houses.reduce((count, house) => {
        const filled = propertyOrder.reduce(
          (propCount, prop) => (house[prop] !== null ? propCount + 1 : propCount),
          0,
        );
        return count + filled;
      }, 0),
    [houses],
  );

  const totalProperties = propertyOrder.length * houses.length;
  const progress = Math.round((filledProperties / totalProperties) * 100);

  const validationErrors = useMemo(() => evaluateState(houses), [houses]);
  const invalidIndexes = useMemo(() => {
    const indexes = new Set<number>();
    validationErrors.forEach((error) => {
      error.houseIndexes.forEach((index) => indexes.add(index));
    });
    return indexes;
  }, [validationErrors]);

  const showStatus = useCallback((message: string, type: StatusType = "info") => {
    setStatus({ message, type });
    if (statusTimeout.current) {
      clearTimeout(statusTimeout.current);
    }
    statusTimeout.current = setTimeout(() => {
      setStatus(null);
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (statusTimeout.current) {
        clearTimeout(statusTimeout.current);
      }
    };
  }, []);

  const recordSnapshot = useCallback(() => {
    setHistory((prev) => ({
      past: [...prev.past, { houses: cloneHouses(houses), step: stepIndex }],
      future: [],
    }));
  }, [houses, stepIndex]);

  const checkCompletion = useCallback((state: HouseState[]) => {
    const complete = state.every((house) =>
      propertyOrder.every((prop) => house[prop] !== null),
    );
    setShowResult(complete);
  }, []);

  const applyUpdates = useCallback(
    (updates: StepUpdate[]) => {
      setHouses((prev) => {
        const next = cloneHouses(prev);
        updates.forEach(({ house, prop, value }) => {
          next[house] = { ...next[house], [prop]: value };
        });
        checkCompletion(next);
        return next;
      });
    },
    [checkCompletion],
  );

  const nextStep = useCallback(() => {
    if (stepIndex >= clueSteps.length) {
      setAutoPlay(false);
      showStatus("所有线索都已经应用。", "info");
      return;
    }
    const step = clueSteps[stepIndex];
    recordSnapshot();
    applyUpdates(step.updates);
    setStepIndex((prev) => prev + 1);
    showStatus(`第 ${step.id} 步：${step.reasoning}`, "success");
  }, [applyUpdates, recordSnapshot, showStatus, stepIndex]);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }
    if (stepIndex >= clueSteps.length) {
      setAutoPlay(false);
      return;
    }
    const timer = setTimeout(() => {
      nextStep();
    }, 1200);

    return () => {
      clearTimeout(timer);
    };
  }, [autoPlay, nextStep, stepIndex]);

  const reset = useCallback(() => {
    setAutoPlay(false);
    setHouses(cloneHouses(initialHouses));
    setStepIndex(0);
    setHistory({ past: [], future: [] });
    setStatus(null);
    setHintMessages([]);
    setShowResult(false);
  }, []);

  const undo = useCallback(() => {
    setAutoPlay(false);
    setHistory((prev) => {
      if (!prev.past.length) {
        return prev;
      }
      const previous = prev.past[prev.past.length - 1];
      const currentSnapshot: HistorySnapshot = {
        houses: cloneHouses(houses),
        step: stepIndex,
      };
      setHouses(cloneHouses(previous.houses));
      setStepIndex(previous.step);
      checkCompletion(previous.houses);
      showStatus("已撤销上一操作。", "info");
      return {
        past: prev.past.slice(0, -1),
        future: [currentSnapshot, ...prev.future],
      };
    });
  }, [checkCompletion, houses, showStatus, stepIndex]);

  const redo = useCallback(() => {
    setAutoPlay(false);
    setHistory((prev) => {
      if (!prev.future.length) {
        return prev;
      }
      const nextSnapshot = prev.future[0];
      const currentSnapshot: HistorySnapshot = {
        houses: cloneHouses(houses),
        step: stepIndex,
      };
      setHouses(cloneHouses(nextSnapshot.houses));
      setStepIndex(nextSnapshot.step);
      checkCompletion(nextSnapshot.houses);
      showStatus("已重做操作。", "info");
      return {
        past: [...prev.past, currentSnapshot],
        future: prev.future.slice(1),
      };
    });
  }, [checkCompletion, houses, showStatus, stepIndex]);

  const handleSelection = useCallback(
    (houseIndex: number, prop: Property, value: string) => {
      if (!value) {
        recordSnapshot();
        setHouses((prev) => {
          const next = cloneHouses(prev);
          next[houseIndex] = { ...next[houseIndex], [prop]: null };
          checkCompletion(next);
          return next;
        });
        showStatus(`已清除第 ${houseIndex + 1} 间房子的${labels[prop]}。`, "info");
        return;
      }

      const validation = validateAssignment(houses, houseIndex, prop, value);
      if (!validation.isValid) {
        showStatus(validation.message ?? "该选择违反了线索约束。", "error");
        return;
      }

      recordSnapshot();
      setHouses((prev) => {
        const next = cloneHouses(prev);
        next[houseIndex] = { ...next[houseIndex], [prop]: value };
        checkCompletion(next);
        return next;
      });
      showStatus(`第 ${houseIndex + 1} 间房子的${labels[prop]}已设为 ${value}。`, "success");
    },
    [checkCompletion, houses, recordSnapshot, showStatus],
  );

  const revealHint = useCallback(() => {
    const hints = buildHints(houses, clueSteps[stepIndex]);
    setHintMessages(hints);
    if (hints.length === 0) {
      showStatus("当前没有可用的提示。", "info");
    }
  }, [houses, showStatus, stepIndex]);

  const handleAutoPlayToggle = useCallback(() => {
    if (stepIndex >= clueSteps.length) {
      showStatus("所有步骤已经完成。", "info");
      return;
    }
    setAutoPlay((prev) => !prev);
  }, [showStatus, stepIndex]);

  useEffect(() => {
    checkCompletion(houses);
  }, [checkCompletion, houses]);

  const fishOwner = useMemo(() => houses.find((house) => house.pet === "鱼"), [houses]);

  return (
    <div className="space-y-10">
      <section className="table-card">
        <h1 className="text-3xl font-bold text-white">爱因斯坦之谜：逻辑推理互动演示</h1>
        <p className="mt-4 text-slate-300">
          爱因斯坦之谜（又称斑马题）通过 15 条线索考验逻辑推理能力。下面的交互式工具支持逐步演示、自动播放、撤销/重做与即时校验，帮助你理解每一步推理的理由。
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="table-card space-y-4">
          <h2>原始实现中的主要问题</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-slate-300">
            <li>
              原始版本在应用线索时直接寻找“第一个空位”进行填充，忽略了其它约束，导致出现互相矛盾的结果，最终给不出正确解答。
            </li>
            <li>
              <code>validateSelection</code> 在部分分支直接返回 <code>false</code>，而不是标准的对象结构，使用者一旦触发这些逻辑就会看到运行时错误并失去提示信息。
            </li>
            <li>
              多条线索被硬编码为“初始条件”（例如直接将蓝色房子固定在第二位），与真实的题目陈述不符，削弱了推理难度并产生误导。
            </li>
          </ul>
        </article>
        <article className="table-card space-y-4">
          <h2>重构方案概述</h2>
          <ul className="list-inside list-disc space-y-2 text-sm text-slate-300">
            <li>为每条线索建立精确的约束校验逻辑，所有手动选择都会即时检测并阻止违背线索的操作。</li>
            <li>预设 15 个演示步骤，逐条说明推理依据，支持自动播放、撤销/重做与进度展示。</li>
            <li>提供提示面板与状态反馈，结合 Tailwind CSS 的风格让界面与现有项目保持一致。</li>
          </ul>
        </article>
      </section>

      <div className="table-card space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={undo}
              disabled={history.past.length === 0}
              className={cn(
                "rounded-md border border-slate-800 px-3 py-1.5 text-sm transition",
                history.past.length === 0
                  ? "cursor-not-allowed bg-slate-800/40 text-slate-500"
                  : "bg-slate-800/80 text-white hover:bg-slate-700",
              )}
            >
              撤销
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={history.future.length === 0}
              className={cn(
                "rounded-md border border-slate-800 px-3 py-1.5 text-sm transition",
                history.future.length === 0
                  ? "cursor-not-allowed bg-slate-800/40 text-slate-500"
                  : "bg-slate-800/80 text-white hover:bg-slate-700",
              )}
            >
              重做
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={nextStep}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-light"
            >
              下一步
            </button>
            <button
              type="button"
              onClick={handleAutoPlayToggle}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition",
                autoPlay
                  ? "bg-amber-500/90 text-white hover:bg-amber-500"
                  : "bg-slate-800/80 text-white hover:bg-slate-700",
              )}
            >
              {autoPlay ? "暂停演示" : "自动演示"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-600"
            >
              重置
            </button>
            <button
              type="button"
              onClick={revealHint}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              提示
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
          <div>
            当前进度：
            <span className="ml-2 font-semibold text-white">
              {Math.min(stepIndex, clueSteps.length)} / {clueSteps.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>填充度</span>
            <div className="h-2 w-44 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-brand transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-white">{progress}%</span>
          </div>
        </div>

        {status ? (
          <div
            className={cn(
              "rounded-md border px-4 py-3 text-sm",
              status.type === "success" && "border-emerald-500/60 bg-emerald-500/10 text-emerald-200",
              status.type === "error" && "border-rose-500/60 bg-rose-500/10 text-rose-200",
              status.type === "info" && "border-slate-500/60 bg-slate-500/10 text-slate-200",
            )}
          >
            {status.message}
          </div>
        ) : null}

        {hintMessages.length > 0 ? (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm text-emerald-200">
            <h3 className="font-semibold text-emerald-100">提示</h3>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {hintMessages.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {houses.map((house, index) => {
            const houseInvalid = invalidIndexes.has(index);
            return (
              <div
                key={house.position}
                className={cn(
                  "rounded-lg border p-4 transition",
                  houseInvalid
                    ? "border-rose-500/60 bg-rose-500/10"
                    : "border-slate-800 bg-slate-900/60",
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">房子 {house.position}</h3>
                  {houseInvalid ? (
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs text-rose-200">
                      需调整
                    </span>
                  ) : null}
                </div>
                <div className="mt-3 space-y-3">
                  {propertyOrder.map((prop) => (
                    <label key={prop} className="block text-sm text-slate-300">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {labels[prop]}
                      </span>
                      <select
                        className="w-full rounded-md border border-slate-800 bg-slate-950/60 px-2 py-1 text-sm text-white focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        value={house[prop] ?? ""}
                        onChange={(event) => handleSelection(index, prop, event.target.value)}
                      >
                        <option value="">-- 请选择 --</option>
                        {propertyOptions[prop].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="table-card">
          <h2 className="text-xl font-semibold text-white">线索回顾</h2>
          <ul className="mt-4 space-y-3">
            {clueSteps.map((step, index) => {
              const state =
                index < stepIndex ? "完成" : index === stepIndex ? "进行中" : "待办";
              return (
                <li
                  key={step.id}
                  className={cn(
                    "rounded-md border px-4 py-3 text-sm transition",
                    index < stepIndex && "border-emerald-500/50 bg-emerald-500/10 text-emerald-200",
                    index === stepIndex && "border-brand/60 bg-brand/10 text-brand-light",
                    index > stepIndex && "border-slate-800 bg-slate-900/60 text-slate-300",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">第 {step.id} 步</span>
                    <span className="text-xs text-slate-400">{state}</span>
                  </div>
                  <p className="mt-2 text-slate-200">{step.clue}</p>
                  <p className="mt-2 text-xs text-slate-400">{step.reasoning}</p>
                </li>
              );
            })}
          </ul>
        </article>

        <aside className="table-card space-y-3">
          <h2 className="text-xl font-semibold text-white">实时校验</h2>
          {validationErrors.length === 0 ? (
            <p className="text-sm text-emerald-200">当前所有已知信息与线索完全一致。</p>
          ) : (
            <ul className="space-y-2 text-sm text-rose-200">
              {validationErrors.slice(0, 5).map((error, index) => (
                <li key={`${error.message}-${index}`}>{error.message}</li>
              ))}
              {validationErrors.length > 5 ? (
                <li className="text-xs text-rose-300/80">其余问题请继续根据提示调整。</li>
              ) : null}
            </ul>
          )}
        </aside>
      </section>

      {showResult && fishOwner ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white">恭喜，所有线索匹配成功！</h3>
            <p className="mt-2 text-slate-300">最终答案：{fishOwner.nationality}养鱼。</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full table-auto border-collapse text-sm text-slate-200">
                <thead>
                  <tr className="bg-slate-900/80 text-xs uppercase tracking-wide text-slate-400">
                    <th className="border border-slate-700 px-3 py-2">房子</th>
                    {propertyOrder.map((prop) => (
                      <th key={prop} className="border border-slate-700 px-3 py-2">
                        {labels[prop]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {houses.map((house) => (
                    <tr key={house.position}>
                      <td className="border border-slate-800 px-3 py-2 text-center font-semibold text-white">
                        {house.position}
                      </td>
                      {propertyOrder.map((prop) => (
                        <td key={prop} className="border border-slate-800 px-3 py-2 text-center">
                          {house[prop] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <button
                type="button"
                onClick={() => setShowResult(false)}
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-light"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

