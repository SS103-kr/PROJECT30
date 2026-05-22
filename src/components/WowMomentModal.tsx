"use client";

import FeasibilityScore from "./FeasibilityScore";

interface Props {
  open: boolean;
  score: number;
  onContinue: () => void;
  onViewReport: () => void;
  onDownloadMd: () => void;
}

export default function WowMomentModal({
  open,
  score,
  onContinue,
  onViewReport,
  onDownloadMd,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up text-center">
        <div className="text-5xl mb-2">🎉</div>
        <h3 className="text-2xl font-extrabold text-slate-900">
          미니 기획안 완성!
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          축하해요! 단 6개의 질문으로 1페이지짜리 사업 골격이 완성됐어요. 이제 무료 마지노선까지 10개만 더 답하면 2페이지짜리 본격 기획안이 됩니다.
        </p>

        <div className="my-5 flex justify-center">
          <FeasibilityScore score={score} size={140} />
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition"
          >
            계속해서 2p 기획안으로 확장하기 →
          </button>
          <button
            type="button"
            onClick={onDownloadMd}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            ⬇️ 1p 미니 기획안 MD로 다운로드
          </button>
          <button
            type="button"
            onClick={onViewReport}
            className="w-full py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-100"
          >
            지금 1p 미리보기
          </button>
        </div>
      </div>
    </div>
  );
}
