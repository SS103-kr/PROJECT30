"use client";

import type { Choice } from "@/lib/types";
import { applySeed } from "@/lib/mockData";

interface Props {
  choice: Choice;
  seed: string;
  selected: boolean;
  onClick: () => void;
}

const CATEGORY_META: Record<
  Choice["category"],
  { label: string; bg: string; border: string; chip: string; ring: string }
> = {
  stable: {
    label: "안정형",
    bg: "bg-blue-50 hover:bg-blue-100",
    border: "border-blue-200",
    chip: "bg-blue-100 text-blue-700",
    ring: "ring-blue-400",
  },
  innovative: {
    label: "혁신형",
    bg: "bg-purple-50 hover:bg-purple-100",
    border: "border-purple-200",
    chip: "bg-purple-100 text-purple-700",
    ring: "ring-purple-400",
  },
  niche: {
    label: "니치형",
    bg: "bg-emerald-50 hover:bg-emerald-100",
    border: "border-emerald-200",
    chip: "bg-emerald-100 text-emerald-700",
    ring: "ring-emerald-400",
  },
};

export default function ChoiceButton({ choice, seed, selected, onClick }: Props) {
  const meta = CATEGORY_META[choice.category];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-xl border ${meta.bg} ${meta.border} transition active:scale-[0.98] ${
        selected ? `ring-2 ${meta.ring} shadow-md` : "shadow-sm"
      }`}
    >
      <span
        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.chip} mb-2`}
      >
        {meta.label}
      </span>
      <div className="text-[15px] font-semibold text-slate-900 leading-snug">
        {applySeed(choice.label, seed)}
      </div>
      <div className="text-[13px] text-slate-600 mt-1 leading-relaxed">
        {applySeed(choice.detail, seed)}
      </div>
    </button>
  );
}
