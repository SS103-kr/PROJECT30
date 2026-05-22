"use client";

import type { Answer } from "@/lib/types";
import { QUESTIONS } from "@/lib/mockData";

interface Props {
  answers: Record<string, Answer>;
  onJump: (index: number) => void;
}

export default function TodoSidebar({ answers, onJump }: Props) {
  const todoEntries = Object.values(answers)
    .filter((a) => a.isTodo)
    .map((a) => {
      const idx = QUESTIONS.findIndex((q) => q.id === a.questionId);
      const q = QUESTIONS[idx];
      return { q, idx };
    })
    .filter(({ q }) => q);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-900">⚠️ To-Do 적립</h3>
        <span className="text-xs text-slate-500">{todoEntries.length}건</span>
      </div>
      {todoEntries.length === 0 ? (
        <p className="text-xs text-slate-500 leading-relaxed">
          답이 막히는 항목은 <strong>'나중에 결정'</strong> 버튼으로 미뤄두세요.
          여기에 쌓이고, 리포트에 ⚠️ 태그로 표시됩니다.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {todoEntries.map(({ q, idx }) => (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onJump(idx)}
                className="w-full text-left p-2 rounded-lg text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 leading-snug transition"
              >
                <div className="font-semibold">{q.sectionTitle}</div>
                <div className="text-amber-700 line-clamp-2 mt-0.5">{q.prompt}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
