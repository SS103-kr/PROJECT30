"use client";

import { useState } from "react";
import type { Choice, Question } from "@/lib/types";
import { applySeed } from "@/lib/mockData";
import ChoiceButton from "./ChoiceButton";
import CustomInputModal from "./CustomInputModal";

interface Props {
  question: Question;
  choices: Choice[];
  seed: string;
  selectedChoiceId?: string;
  onPick: (args: {
    choiceId?: string;
    category: "stable" | "innovative" | "niche" | "custom";
    text: string;
    isTodo?: boolean;
  }) => void;
}

export default function QuestionCard({
  question,
  choices,
  seed,
  selectedChoiceId,
  onPick,
}: Props) {
  const [customOpen, setCustomOpen] = useState(false);

  return (
    <div className="animate-slide-up">
      <div className="mb-1 text-xs font-semibold tracking-wider text-brand-600 uppercase">
        {question.sectionTitle}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
        {applySeed(question.prompt, seed)}
      </h2>
      {question.helper && (
        <p className="mt-2 text-sm text-slate-500">{question.helper}</p>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {choices.map((c) => (
          <ChoiceButton
            key={c.id}
            choice={c}
            seed={seed}
            selected={selectedChoiceId === c.id}
            onClick={() =>
              onPick({
                choiceId: c.id,
                category: c.category,
                text: `${c.label} — ${c.detail}`,
              })
            }
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCustomOpen(true)}
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 transition"
        >
          ✏️ 직접 입력하기
        </button>
        <button
          type="button"
          onClick={() =>
            onPick({
              category: "custom",
              text: "(나중에 결정 — To-Do로 적립됨)",
              isTodo: true,
            })
          }
          className="px-4 py-2.5 rounded-lg text-sm font-medium bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 transition"
          title="이 항목은 'To-Do'로 적립되고 다음 질문으로 넘어갑니다"
        >
          ⏭ 나중에 결정 (To-Do로 적립)
        </button>
      </div>

      <CustomInputModal
        open={customOpen}
        prompt={applySeed(question.prompt, seed)}
        onClose={() => setCustomOpen(false)}
        onSubmit={(text) =>
          onPick({
            category: "custom",
            text,
          })
        }
      />
    </div>
  );
}
