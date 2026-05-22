"use client";

import type { Answer } from "@/lib/types";
import { QUESTIONS } from "@/lib/mockData";

interface Props {
  answers: Record<string, Answer>;
  currentIndex: number;
  onJump: (idx: number) => void;
}

export default function StructureMap({ answers, currentIndex, onJump }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <h3 className="text-sm font-bold text-slate-900 mb-2">🌳 기획안 구조도</h3>
      <ol className="space-y-0.5">
        {QUESTIONS.map((q, i) => {
          const a = answers[q.id];
          const isCurrent = i === currentIndex;
          const status = a
            ? a.isTodo
              ? "todo"
              : "done"
            : i < currentIndex
              ? "skipped"
              : "pending";

          const icon =
            status === "done"
              ? "✓"
              : status === "todo"
                ? "⚠"
                : status === "skipped"
                  ? "·"
                  : "○";

          const textColor =
            status === "done"
              ? "text-emerald-700"
              : status === "todo"
                ? "text-amber-700"
                : status === "skipped"
                  ? "text-slate-400"
                  : "text-slate-500";

          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onJump(i)}
                className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded text-xs transition ${
                  isCurrent
                    ? "bg-brand-50 ring-1 ring-brand-200 font-semibold text-brand-700"
                    : `hover:bg-slate-50 ${textColor}`
                }`}
              >
                <span className="w-4 text-center font-mono">{icon}</span>
                <span className="flex-1 truncate">{q.sectionTitle}</span>
                {q.step === 1 ? (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-blue-50 text-blue-600">
                    S1
                  </span>
                ) : (
                  <span className="text-[9px] px-1 py-0.5 rounded bg-purple-50 text-purple-600">
                    S2
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
