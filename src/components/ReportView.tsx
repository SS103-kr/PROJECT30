"use client";

import type { ReportSection } from "@/lib/reportBuilder";

interface Props {
  pitch: string;
  sections: ReportSection[];
}

export default function ReportView({ pitch, sections }: Props) {
  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12">
      {/* 한 줄 요약 */}
      <section className="pb-6 border-b border-slate-200">
        <div className="text-xs uppercase tracking-widest font-semibold text-brand-600">
          Elevator Pitch
        </div>
        <p className="mt-2 text-lg md:text-xl text-slate-900 leading-relaxed font-medium">
          {pitch}
        </p>
      </section>

      {sections.map((sec) => (
        <section key={sec.title} className="mt-8">
          <h3 className="text-lg font-bold text-slate-900 mb-3">
            <span className="mr-1.5">{sec.emoji}</span>
            {sec.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sec.items.map((item, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  item.isTodo
                    ? "bg-amber-50 border-amber-200"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1">
                  {item.isTodo && <span className="text-amber-600">⚠️</span>}
                  {item.label}
                </div>
                <div
                  className={`text-sm leading-relaxed ${
                    item.isTodo ? "text-amber-900" : "text-slate-800"
                  }`}
                >
                  {item.value}
                </div>
                {item.isTodo && (
                  <div className="mt-1.5 text-[11px] text-amber-700 font-medium">
                    🏷 To-Do · 시장 검증 필요
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
