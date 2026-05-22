"use client";

import { scoreColor, scoreLabel } from "@/lib/scoring";

interface Props {
  score: number;
  size?: number;
  compact?: boolean;
}

export default function FeasibilityScore({ score, size = 120, compact = false }: Props) {
  const color = scoreColor(score);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex ${compact ? "flex-row items-center gap-3" : "flex-col items-center"}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={8}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={8}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 600ms ease, stroke 300ms" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-extrabold text-slate-900" style={{ color }}>
            {score}%
          </div>
          {!compact && (
            <div className="text-[10px] font-medium text-slate-500 mt-0.5">실현가능성</div>
          )}
        </div>
      </div>
      <div className={compact ? "" : "mt-2 text-center"}>
        <div className="text-xs font-semibold text-slate-700">{scoreLabel(score)}</div>
        {!compact && (
          <div className="text-[11px] text-slate-500 mt-0.5">
            논리적 연결성 · 카테고리 커버리지 · To-Do 비율 종합
          </div>
        )}
      </div>
    </div>
  );
}
