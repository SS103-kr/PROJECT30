"use client";

interface Props {
  current: number;
  total: number;
  step1Count: number;
}

export default function ProgressBar({ current, total, step1Count }: Props) {
  const pct = Math.round((current / total) * 100);
  const inStep1 = current < step1Count;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="font-semibold text-slate-700">
          {inStep1 ? (
            <>
              <span className="text-brand-600">Step 1</span> · 미니 기획안 (1p)
            </>
          ) : (
            <>
              <span className="text-purple-600">Step 2</span> · 기획안 확장 (2p · 무료 마지노선)
            </>
          )}
        </div>
        <div className="text-slate-500">
          {current} / {total} 질문
        </div>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: inStep1
              ? "linear-gradient(90deg, #4f6bff, #6366f1)"
              : "linear-gradient(90deg, #6366f1, #a855f7)",
          }}
        />
      </div>
      {/* milestone markers */}
      <div className="relative -mt-2 h-2 pointer-events-none">
        <div
          className="absolute h-2 w-0.5 bg-slate-400/70"
          style={{ left: `${(step1Count / total) * 100}%` }}
          title="Step 1 → Step 2"
        />
      </div>
    </div>
  );
}
