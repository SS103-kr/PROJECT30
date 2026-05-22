"use client";

import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  prompt: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
  initialValue?: string;
}

export default function CustomInputModal({
  open,
  prompt,
  onClose,
  onSubmit,
  initialValue = "",
}: Props) {
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    if (open) setText(initialValue);
  }, [open, initialValue]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-slate-900">✏️ 직접 입력하기</h3>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">{prompt}</p>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 자유롭게 답변을 적어주세요…"
          className="mt-4 w-full h-32 rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
          >
            취소
          </button>
          <button
            type="button"
            disabled={text.trim().length < 2}
            onClick={() => {
              onSubmit(text.trim());
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장하고 다음
          </button>
        </div>
      </div>
    </div>
  );
}
