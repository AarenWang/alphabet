"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

type KeyVariant = "wide" | "extraWide" | "space" | "tall";

type KeyCategory = "modifier" | "function" | "neutral";

type KeyDefinition = {
  kind: "key";
  label: string;
  variant?: KeyVariant;
  category?: KeyCategory;
  osLabel?: {
    win: string;
    mac: string;
  };
  macSymbol?: string;
  matches: string[];
  colSpan?: number;
  rowSpan?: number;
  secondaryLabel?: string;
};

type SpacerDefinition = {
  kind: "gap";
  size?: "sm" | "md" | "lg";
};

type ArrowClusterDefinition = {
  kind: "arrows";
};

type KeySpec = KeyDefinition | SpacerDefinition | ArrowClusterDefinition;

type LayoutSection = {
  rows: KeySpec[][];
};

type NumpadSection = {
  grid: KeyDefinition[];
};

type KeyboardLayout = {
  id: string;
  title: string;
  main: LayoutSection;
  control?: LayoutSection;
  numpad?: NumpadSection;
  className?: string;
};

const gapClasses: Record<NonNullable<SpacerDefinition["size"]>, string> = {
  sm: "w-2",
  md: "w-4",
  lg: "w-6",
};

const variantClasses: Record<KeyVariant, string> = {
  wide: "min-w-[60px]",
  extraWide: "min-w-[90px]",
  space: "min-w-[220px]",
  tall: "h-[88px]",
};

const categoryClasses: Record<KeyCategory, string> = {
  neutral: "bg-slate-900/70 text-slate-100 border-slate-700/80 hover:border-slate-500",
  modifier: "bg-slate-800/70 text-slate-100 border-slate-700/80 hover:border-slate-500",
  function: "bg-slate-800/60 text-slate-200 border-slate-700/80 hover:border-slate-500",
};

const specialMatchMap: Record<string, string[]> = {
  "1": ["!"],
  "2": ["@"],
  "3": ["#"],
  "4": ["$"],
  "5": ["%"],
  "6": ["^"],
  "7": ["&"],
  "8": ["*"],
  "9": ["("],
  "0": [")"],
  "-": ["_"],
  "=": ["+"],
  "[": ["{"],
  "]": ["}"],
  "\\": ["|"],
  ";": [":"],
  "'": ['"'],
  ",": ["<"],
  ".": [">"],
  "/": ["?"],
  "~": ["`"],
};

const createKey = (
  label: string,
  options: Omit<
    KeyDefinition,
    "kind" | "label" | "matches" | "category"
  > & { matches?: string[]; category?: KeyCategory } = {}
): KeyDefinition => {
  const normalizedLabel = label.replace(/\s+/g, "").toUpperCase();
  const baseMatches = new Set<string>([normalizedLabel]);

  const specialMatches = specialMatchMap[label];
  if (specialMatches) {
    specialMatches.forEach((match) => baseMatches.add(match.toUpperCase()));
  }

  if (options.osLabel?.mac) {
    baseMatches.add(options.osLabel.mac.replace(/\s+/g, "").toUpperCase());
  }
  if (options.osLabel?.win) {
    baseMatches.add(options.osLabel.win.replace(/\s+/g, "").toUpperCase());
  }

  options.matches?.forEach((match) => {
    baseMatches.add(match.replace(/\s+/g, "").toUpperCase());
  });

  return {
    kind: "key",
    label,
    variant: options.variant,
    category: options.category ?? "neutral",
    matches: Array.from(baseMatches),
    osLabel: options.osLabel,
    macSymbol: options.macSymbol,
    colSpan: options.colSpan,
    rowSpan: options.rowSpan,
    secondaryLabel: options.secondaryLabel,
  };
};

const gap = (size: SpacerDefinition["size"] = "md"): SpacerDefinition => ({
  kind: "gap",
  size,
});

const arrowCluster = (): ArrowClusterDefinition => ({
  kind: "arrows",
});

const arrowKeys = {
  up: createKey("↑", { matches: ["ArrowUp"] }),
  down: createKey("↓", { matches: ["ArrowDown"] }),
  left: createKey("←", { matches: ["ArrowLeft"] }),
  right: createKey("→", { matches: ["ArrowRight"] }),
};

const layouts: KeyboardLayout[] = [
  {
    id: "full",
    title: "100% 布局 (104/108 键)",
    main: {
      rows: [
        [
          createKey("Esc", { matches: ["Escape"], category: "function" }),
          gap("lg"),
          createKey("F1", { category: "function" }),
          createKey("F2", { category: "function" }),
          createKey("F3", { category: "function" }),
          createKey("F4", { category: "function" }),
          gap("lg"),
          createKey("F5", { category: "function" }),
          createKey("F6", { category: "function" }),
          createKey("F7", { category: "function" }),
          createKey("F8", { category: "function" }),
          gap("lg"),
          createKey("F9", { category: "function" }),
          createKey("F10", { category: "function" }),
          createKey("F11", { category: "function" }),
          createKey("F12", { category: "function" }),
        ],
        [
          createKey("~"),
          createKey("1"),
          createKey("2"),
          createKey("3"),
          createKey("4"),
          createKey("5"),
          createKey("6"),
          createKey("7"),
          createKey("8"),
          createKey("9"),
          createKey("0"),
          createKey("-"),
          createKey("="),
          createKey("Backspace", { variant: "wide", matches: ["Backspace"] }),
        ],
        [
          createKey("Tab", { variant: "wide", matches: ["Tab"] }),
          createKey("Q"),
          createKey("W"),
          createKey("E"),
          createKey("R"),
          createKey("T"),
          createKey("Y"),
          createKey("U"),
          createKey("I"),
          createKey("O"),
          createKey("P"),
          createKey("["),
          createKey("]"),
          createKey("\\"),
        ],
        [
          createKey("Caps Lock", {
            variant: "extraWide",
            matches: ["CapsLock"],
          }),
          createKey("A"),
          createKey("S"),
          createKey("D"),
          createKey("F"),
          createKey("G"),
          createKey("H"),
          createKey("J"),
          createKey("K"),
          createKey("L"),
          createKey(";"),
          createKey("'"),
          createKey("Enter", { variant: "extraWide", matches: ["Enter", "Return"] }),
        ],
        [
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
          createKey("Z"),
          createKey("X"),
          createKey("C"),
          createKey("V"),
          createKey("B"),
          createKey("N"),
          createKey("M"),
          createKey(","),
          createKey("."),
          createKey("/"),
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
        ],
        [
          createKey("Ctrl", {
            variant: "wide",
            category: "modifier",
            matches: ["Control"],
          }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Space", {
            variant: "space",
            matches: ["Space"],
          }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Fn", { variant: "wide", category: "function" }),
          createKey("Ctrl", {
            variant: "wide",
            category: "modifier",
            matches: ["Control"],
          }),
        ],
      ],
    },
    control: {
      rows: [
        [
          createKey("PrtSc", {
            category: "function",
            secondaryLabel: "SysRq",
            matches: ["PrintScreen", "SysRq", "Print"],
          }),
          createKey("Scroll", {
            category: "function",
            secondaryLabel: "Lock",
            matches: ["ScrollLock"],
          }),
          createKey("Pause", {
            category: "function",
            secondaryLabel: "Break",
            matches: ["Pause", "Break"],
          }),
        ],
        [
          createKey("Insert"),
          createKey("Home"),
          createKey("PgUp", { matches: ["PageUp"] }),
        ],
        [
          createKey("Delete"),
          createKey("End"),
          createKey("PgDn", { matches: ["PageDown"] }),
        ],
        [arrowCluster()],
      ],
    },
    numpad: {
      grid: [
        createKey("Num", { matches: ["NumLock"] }),
        createKey("/", { matches: ["Divide"] }),
        createKey("*", { matches: ["Multiply"] }),
        createKey("-", { matches: ["Subtract"] }),
        createKey("7"),
        createKey("8"),
        createKey("9"),
        createKey("+", { rowSpan: 2, matches: ["Add"] }),
        createKey("4"),
        createKey("5"),
        createKey("6"),
        createKey("1"),
        createKey("2"),
        createKey("3"),
        createKey("Enter", { rowSpan: 2, matches: ["Enter", "Return"] }),
        createKey("0", { colSpan: 2 }),
        createKey("."),
      ],
    },
  },
  {
    id: "ninetyfive",
    title: "95% 布局 (96/98 键)",
    className: "lg:flex-row lg:justify-between",
    main: {
      rows: [
        [
          createKey("Esc", { matches: ["Escape"], category: "function" }),
          gap("lg"),
          createKey("F1", { category: "function" }),
          createKey("F2", { category: "function" }),
          createKey("F3", { category: "function" }),
          createKey("F4", { category: "function" }),
          gap("lg"),
          createKey("F5", { category: "function" }),
          createKey("F6", { category: "function" }),
          createKey("F7", { category: "function" }),
          createKey("F8", { category: "function" }),
          gap("lg"),
          createKey("F9", { category: "function" }),
          createKey("F10", { category: "function" }),
          createKey("F11", { category: "function" }),
          createKey("F12", { category: "function" }),
        ],
        [
          createKey("~"),
          createKey("1"),
          createKey("2"),
          createKey("3"),
          createKey("4"),
          createKey("5"),
          createKey("6"),
          createKey("7"),
          createKey("8"),
          createKey("9"),
          createKey("0"),
          createKey("-"),
          createKey("="),
          createKey("Backspace", { variant: "wide", matches: ["Backspace"] }),
        ],
        [
          createKey("Tab", { variant: "wide" }),
          createKey("Q"),
          createKey("W"),
          createKey("E"),
          createKey("R"),
          createKey("T"),
          createKey("Y"),
          createKey("U"),
          createKey("I"),
          createKey("O"),
          createKey("P"),
          createKey("["),
          createKey("]"),
          createKey("\\"),
        ],
        [
          createKey("Caps Lock", { variant: "extraWide", matches: ["CapsLock"] }),
          createKey("A"),
          createKey("S"),
          createKey("D"),
          createKey("F"),
          createKey("G"),
          createKey("H"),
          createKey("J"),
          createKey("K"),
          createKey("L"),
          createKey(";"),
          createKey("'"),
          createKey("Enter", { variant: "extraWide", matches: ["Enter", "Return"] }),
        ],
        [
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
          createKey("Z"),
          createKey("X"),
          createKey("C"),
          createKey("V"),
          createKey("B"),
          createKey("N"),
          createKey("M"),
          createKey(","),
          createKey("."),
          createKey("/"),
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
        ],
        [
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Space", { variant: "space", matches: ["Space"] }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Fn", { variant: "wide", category: "function" }),
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
        ],
      ],
    },
    numpad: {
      grid: [
        createKey("Num", { matches: ["NumLock"] }),
        createKey("/", { matches: ["Divide"] }),
        createKey("*", { matches: ["Multiply"] }),
        createKey("-", { matches: ["Subtract"] }),
        createKey("7"),
        createKey("8"),
        createKey("9"),
        createKey("+", { rowSpan: 2, matches: ["Add"] }),
        createKey("4"),
        createKey("5"),
        createKey("6"),
        createKey("1"),
        createKey("2"),
        createKey("3"),
        createKey("Enter", { rowSpan: 2, matches: ["Enter", "Return"] }),
        createKey("0", { colSpan: 2 }),
        createKey("."),
      ],
    },
  },
  {
    id: "tkl",
    title: "80% 布局 (87 键)",
    className: "lg:flex-row lg:justify-between",
    main: {
      rows: [
        [
          createKey("Esc", { matches: ["Escape"], category: "function" }),
          gap("lg"),
          createKey("F1", { category: "function" }),
          createKey("F2", { category: "function" }),
          createKey("F3", { category: "function" }),
          createKey("F4", { category: "function" }),
          gap("lg"),
          createKey("F5", { category: "function" }),
          createKey("F6", { category: "function" }),
          createKey("F7", { category: "function" }),
          createKey("F8", { category: "function" }),
          gap("lg"),
          createKey("F9", { category: "function" }),
          createKey("F10", { category: "function" }),
          createKey("F11", { category: "function" }),
          createKey("F12", { category: "function" }),
        ],
        [
          createKey("~"),
          createKey("1"),
          createKey("2"),
          createKey("3"),
          createKey("4"),
          createKey("5"),
          createKey("6"),
          createKey("7"),
          createKey("8"),
          createKey("9"),
          createKey("0"),
          createKey("-"),
          createKey("="),
          createKey("Backspace", { variant: "wide", matches: ["Backspace"] }),
        ],
        [
          createKey("Tab", { variant: "wide" }),
          createKey("Q"),
          createKey("W"),
          createKey("E"),
          createKey("R"),
          createKey("T"),
          createKey("Y"),
          createKey("U"),
          createKey("I"),
          createKey("O"),
          createKey("P"),
          createKey("["),
          createKey("]"),
          createKey("\\"),
        ],
        [
          createKey("Caps Lock", { variant: "extraWide", matches: ["CapsLock"] }),
          createKey("A"),
          createKey("S"),
          createKey("D"),
          createKey("F"),
          createKey("G"),
          createKey("H"),
          createKey("J"),
          createKey("K"),
          createKey("L"),
          createKey(";"),
          createKey("'"),
          createKey("Enter", { variant: "extraWide", matches: ["Enter", "Return"] }),
        ],
        [
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
          createKey("Z"),
          createKey("X"),
          createKey("C"),
          createKey("V"),
          createKey("B"),
          createKey("N"),
          createKey("M"),
          createKey(","),
          createKey("."),
          createKey("/"),
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
        ],
        [
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Space", { variant: "space", matches: ["Space"] }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Fn", { variant: "wide", category: "function" }),
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
        ],
      ],
    },
    control: {
      rows: [
        [
          createKey("Print", { matches: ["PrintScreen"] }),
          createKey("Scroll", { matches: ["ScrollLock"] }),
          createKey("Pause", { matches: ["Pause", "Break"] }),
        ],
        [
          createKey("Insert"),
          createKey("Home"),
          createKey("PgUp", { matches: ["PageUp"] }),
        ],
        [
          createKey("Delete"),
          createKey("End"),
          createKey("PgDn", { matches: ["PageDown"] }),
        ],
        [arrowCluster()],
      ],
    },
  },
  {
    id: "seventyfive",
    title: "75% 布局 (84/86 键)",
    main: {
      rows: [
        [
          createKey("Esc", { matches: ["Escape"], category: "function" }),
          createKey("F1", { category: "function" }),
          createKey("F2", { category: "function" }),
          createKey("F3", { category: "function" }),
          createKey("F4", { category: "function" }),
          createKey("F5", { category: "function" }),
          createKey("F6", { category: "function" }),
          createKey("F7", { category: "function" }),
          createKey("F8", { category: "function" }),
          createKey("F9", { category: "function" }),
          createKey("F10", { category: "function" }),
          createKey("F11", { category: "function" }),
          createKey("F12", { category: "function" }),
          createKey("Del", { matches: ["Delete"] }),
        ],
        [
          createKey("~"),
          createKey("1"),
          createKey("2"),
          createKey("3"),
          createKey("4"),
          createKey("5"),
          createKey("6"),
          createKey("7"),
          createKey("8"),
          createKey("9"),
          createKey("0"),
          createKey("-"),
          createKey("="),
          createKey("Backspace", { variant: "wide", matches: ["Backspace"] }),
        ],
        [
          createKey("Tab", { variant: "wide" }),
          createKey("Q"),
          createKey("W"),
          createKey("E"),
          createKey("R"),
          createKey("T"),
          createKey("Y"),
          createKey("U"),
          createKey("I"),
          createKey("O"),
          createKey("P"),
          createKey("["),
          createKey("]"),
          createKey("\\"),
          createKey("PgUp", { matches: ["PageUp"] }),
        ],
        [
          createKey("Caps Lock", { variant: "extraWide", matches: ["CapsLock"] }),
          createKey("A"),
          createKey("S"),
          createKey("D"),
          createKey("F"),
          createKey("G"),
          createKey("H"),
          createKey("J"),
          createKey("K"),
          createKey("L"),
          createKey(";"),
          createKey("'"),
          createKey("Enter", { variant: "extraWide", matches: ["Enter", "Return"] }),
          createKey("PgDn", { matches: ["PageDown"] }),
        ],
        [
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
          createKey("Z"),
          createKey("X"),
          createKey("C"),
          createKey("V"),
          createKey("B"),
          createKey("N"),
          createKey("M"),
          createKey(","),
          createKey("."),
          createKey("/"),
          createKey("Shift", { variant: "wide", matches: ["Shift"] }),
          createKey("↑", { matches: ["ArrowUp"] }),
          createKey("End"),
        ],
        [
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Space", { variant: "space", matches: ["Space"] }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Fn", { variant: "wide", category: "function" }),
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
        ],
      ],
    },
  },
  {
    id: "sixtyfive",
    title: "65% 布局 (68 键)",
    main: {
      rows: [
        [
          createKey("~"),
          createKey("1"),
          createKey("2"),
          createKey("3"),
          createKey("4"),
          createKey("5"),
          createKey("6"),
          createKey("7"),
          createKey("8"),
          createKey("9"),
          createKey("0"),
          createKey("-"),
          createKey("="),
          createKey("Backspace", { variant: "wide", matches: ["Backspace"] }),
          createKey("Del", { matches: ["Delete"] }),
        ],
        [
          createKey("Tab", { variant: "wide" }),
          createKey("Q"),
          createKey("W"),
          createKey("E"),
          createKey("R"),
          createKey("T"),
          createKey("Y"),
          createKey("U"),
          createKey("I"),
          createKey("O"),
          createKey("P"),
          createKey("["),
          createKey("]"),
          createKey("\\"),
          createKey("PgUp", { matches: ["PageUp"] }),
        ],
        [
          createKey("Caps Lock", { variant: "extraWide", matches: ["CapsLock"] }),
          createKey("A"),
          createKey("S"),
          createKey("D"),
          createKey("F"),
          createKey("G"),
          createKey("H"),
          createKey("J"),
          createKey("K"),
          createKey("L"),
          createKey(";"),
          createKey("'"),
          createKey("Enter", { variant: "extraWide", matches: ["Enter", "Return"] }),
          createKey("PgDn", { matches: ["PageDown"] }),
        ],
        [
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
          createKey("Z"),
          createKey("X"),
          createKey("C"),
          createKey("V"),
          createKey("B"),
          createKey("N"),
          createKey("M"),
          createKey(","),
          createKey("."),
          createKey("/"),
          createKey("Shift", { variant: "wide", matches: ["Shift"] }),
          createKey("↑", { matches: ["ArrowUp"] }),
          createKey("End"),
        ],
        [
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Space", { variant: "space", matches: ["Space"] }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Fn", { variant: "wide", category: "function" }),
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
        ],
      ],
    },
  },
  {
    id: "sixty",
    title: "60% 布局 (61 键)",
    main: {
      rows: [
        [
          createKey("~"),
          createKey("1"),
          createKey("2"),
          createKey("3"),
          createKey("4"),
          createKey("5"),
          createKey("6"),
          createKey("7"),
          createKey("8"),
          createKey("9"),
          createKey("0"),
          createKey("-"),
          createKey("="),
          createKey("Backspace", { variant: "wide", matches: ["Backspace"] }),
        ],
        [
          createKey("Tab", { variant: "wide" }),
          createKey("Q"),
          createKey("W"),
          createKey("E"),
          createKey("R"),
          createKey("T"),
          createKey("Y"),
          createKey("U"),
          createKey("I"),
          createKey("O"),
          createKey("P"),
          createKey("["),
          createKey("]"),
          createKey("\\"),
        ],
        [
          createKey("Caps Lock", { variant: "extraWide", matches: ["CapsLock"] }),
          createKey("A"),
          createKey("S"),
          createKey("D"),
          createKey("F"),
          createKey("G"),
          createKey("H"),
          createKey("J"),
          createKey("K"),
          createKey("L"),
          createKey(";"),
          createKey("'"),
          createKey("Enter", { variant: "extraWide", matches: ["Enter", "Return"] }),
        ],
        [
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
          createKey("Z"),
          createKey("X"),
          createKey("C"),
          createKey("V"),
          createKey("B"),
          createKey("N"),
          createKey("M"),
          createKey(","),
          createKey("."),
          createKey("/"),
          createKey("Shift", { variant: "extraWide", matches: ["Shift"] }),
        ],
        [
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Space", { variant: "space", matches: ["Space"] }),
          createKey("Alt", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Alt", mac: "Option" },
            macSymbol: "⌥",
            matches: ["Option"],
          }),
          createKey("Win", {
            variant: "wide",
            category: "modifier",
            osLabel: { win: "Win", mac: "Cmd" },
            macSymbol: "⌘",
            matches: ["Meta", "OS", "Command"],
          }),
          createKey("Fn", { variant: "wide", category: "function" }),
          createKey("Ctrl", { variant: "wide", category: "modifier", matches: ["Control"] }),
        ],
      ],
    },
  },
];

const normalizeKeyEvent = (key: string): string | null => {
  if (!key) return null;
  if (key === " ") {
    return "SPACE";
  }
  if (key === "Dead") {
    return null;
  }

  return key.replace(/\s+/g, "").toUpperCase();
};

const colSpanClasses: Record<number, string> = {
  2: "col-span-2",
  3: "col-span-3",
};

const rowSpanClasses: Record<number, string> = {
  2: "row-span-2",
};

type KeyCapProps = {
  spec: KeyDefinition;
  isMac: boolean;
  pressedKeys: Set<string>;
  isGrid?: boolean;
};

const KeyCap = ({ spec, isMac, pressedKeys, isGrid }: KeyCapProps) => {
  const displayLabel = spec.osLabel
    ? isMac
      ? spec.osLabel.mac
      : spec.osLabel.win
    : spec.label;

  const highlighted = spec.matches.some((match) => pressedKeys.has(match));

  const classes = clsx(
    "flex h-12 min-w-[36px] select-none items-center justify-center rounded-lg border px-2 text-[11px] font-medium text-slate-100 shadow-sm transition-transform duration-150",
    categoryClasses[spec.category ?? "neutral"],
    spec.variant ? variantClasses[spec.variant] : null,
    spec.rowSpan ? "h-full" : null,
    isGrid ? "w-full" : null,
    spec.colSpan ? colSpanClasses[spec.colSpan] : null,
    spec.rowSpan ? rowSpanClasses[spec.rowSpan] : null,
    highlighted
      ? "scale-[1.05] border-emerald-400 bg-emerald-500/80 text-white shadow-[0_0_14px_rgba(16,185,129,0.45)]"
      : null
  );

  return (
    <div className={classes} aria-pressed={highlighted} role="button">
      {isMac && spec.osLabel ? (
        <span className="flex items-center gap-1 text-xs">
          {spec.macSymbol && <span className="text-sm leading-none">{spec.macSymbol}</span>}
          <span>{spec.osLabel.mac}</span>
        </span>
      ) : spec.secondaryLabel ? (
        <span className="flex flex-col items-center leading-tight">
          <span className="text-xs font-medium">{displayLabel}</span>
          <span className="text-[10px] font-normal text-slate-300">{spec.secondaryLabel}</span>
        </span>
      ) : (
        <span className="text-xs">{displayLabel}</span>
      )}
    </div>
  );
};

type RowRendererProps = {
  row: KeySpec[];
  isMac: boolean;
  pressedKeys: Set<string>;
};

const ArrowCluster = ({ isMac, pressedKeys }: { isMac: boolean; pressedKeys: Set<string> }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex justify-center">
        <KeyCap spec={arrowKeys.up} isMac={isMac} pressedKeys={pressedKeys} />
      </div>
      <div className="flex items-center justify-center gap-1">
        <KeyCap spec={arrowKeys.left} isMac={isMac} pressedKeys={pressedKeys} />
        <KeyCap spec={arrowKeys.down} isMac={isMac} pressedKeys={pressedKeys} />
        <KeyCap spec={arrowKeys.right} isMac={isMac} pressedKeys={pressedKeys} />
      </div>
    </div>
  );
};

const RowRenderer = ({ row, isMac, pressedKeys }: RowRendererProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {row.map((item, index) => {
        if (item.kind === "gap") {
          return <div key={`gap-${index}`} className={gapClasses[item.size ?? "md"]} aria-hidden />;
        }

        if (item.kind === "arrows") {
          return <ArrowCluster key={`arrows-${index}`} isMac={isMac} pressedKeys={pressedKeys} />;
        }

        return <KeyCap key={`${item.label}-${index}`} spec={item} isMac={isMac} pressedKeys={pressedKeys} />;
      })}
    </div>
  );
};

type KeyboardSectionProps = {
  section: LayoutSection;
  isMac: boolean;
  pressedKeys: Set<string>;
};

const KeyboardSection = ({ section, isMac, pressedKeys }: KeyboardSectionProps) => {
  return (
    <div className="space-y-2">
      {section.rows.map((row, index) => (
        <RowRenderer key={index} row={row} isMac={isMac} pressedKeys={pressedKeys} />
      ))}
    </div>
  );
};

type NumpadProps = {
  section: NumpadSection;
  isMac: boolean;
  pressedKeys: Set<string>;
};

const Numpad = ({ section, isMac, pressedKeys }: NumpadProps) => {
  return (
    <div className="grid grid-cols-4 gap-1">
      {section.grid.map((keyDef, index) => (
        <KeyCap key={`${keyDef.label}-${index}`} spec={keyDef} isMac={isMac} pressedKeys={pressedKeys} isGrid />
      ))}
    </div>
  );
};
const navItems = layouts.map((layout) => ({ id: layout.id, title: layout.title }));

export default function KeyboardLayoutsPage() {
  const [isMac, setIsMac] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const normalized = normalizeKeyEvent(event.key);
      if (!normalized) return;

      setPressedKeys((prev) => {
        if (prev.has(normalized)) {
          return prev;
        }
        const next = new Set(prev);
        next.add(normalized);
        return next;
      });
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const normalized = normalizeKeyEvent(event.key);
      if (!normalized) return;

      setPressedKeys((prev) => {
        if (!prev.has(normalized)) {
          return prev;
        }
        const next = new Set(prev);
        next.delete(normalized);
        return next;
      });
    };

    const clearPressed = () => setPressedKeys(new Set());

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearPressed);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", clearPressed);
    };
  }, []);

  const containerShift = sidebarOpen ? "lg:pl-52" : "lg:pl-16";

  return (
    <div className="relative pb-16">
      <button
        type="button"
        onClick={() => setIsMac((prev) => !prev)}
        className="fixed right-6 top-6 z-40 rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-200 shadow-lg transition-colors hover:border-brand-light hover:text-white"
      >
        {isMac ? "切换到 Windows" : "切换到 Mac"}
      </button>

      <nav
        className={clsx(
          "fixed left-0 top-1/2 z-30 -translate-y-1/2 rounded-r-xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/30 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-[70%]"
        )}
        aria-label="键盘布局导航"
      >
        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="absolute -right-10 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-r-xl border border-slate-800 bg-slate-900 text-slate-200 shadow-md transition-colors hover:border-brand-light"
          aria-label={sidebarOpen ? "收起导航" : "展开导航"}
        >
          <span className={clsx("text-lg transition-transform", sidebarOpen ? "rotate-180" : "")}>{"❯"}</span>
        </button>
        <ul className="space-y-2 text-sm text-slate-200">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="block rounded-lg px-3 py-2 transition-colors hover:bg-slate-800/70 hover:text-white"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={clsx("mx-auto w-full max-w-[1280px] space-y-10 px-4 pt-8 transition-all duration-300", containerShift)}>
        <header className="space-y-3">
          <span className="badge">键盘</span>
          <h1 className="text-3xl font-bold text-white">常见机械键盘布局一览</h1>
          <p className="text-sm text-slate-300">
            通过直观的键帽示意对比 100% 到 60% 多种布局形态，可实时切换 Windows / Mac 键位显示，并支持键盘输入高亮对应按键，帮助理解不同配列的功能分区。
          </p>
        </header>

        <div className="space-y-10">
          {layouts.map((layout) => (
            <section
              key={layout.id}
              id={layout.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur"
            >
              <h2 className="text-xl font-semibold text-white">{layout.title}</h2>
              <div className={clsx("mt-6 flex flex-col gap-8 lg:flex-row lg:items-start", layout.className)}>
                <div className="flex-1">
                  <KeyboardSection section={layout.main} isMac={isMac} pressedKeys={pressedKeys} />
                </div>
                {layout.control && (
                  <div className="flex-shrink-0 lg:w-44">
                    <KeyboardSection section={layout.control} isMac={isMac} pressedKeys={pressedKeys} />
                  </div>
                )}
                {layout.numpad && (
                  <div className="flex-shrink-0 lg:w-48">
                    <Numpad section={layout.numpad} isMac={isMac} pressedKeys={pressedKeys} />
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
