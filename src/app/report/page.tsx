"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { buildMarkdown, makeFilename } from "@/lib/reportBuilder";
import type { ReportSection } from "@/lib/reportBuilder";
import { downloadTextFile } from "@/lib/download";
import { calculateScore } from "@/lib/scoring";
import { fetchReport } from "@/lib/llmClient";
import FeasibilityScore from "@/components/FeasibilityScore";
import ReportView from "@/components/ReportView";
import PaywallModal from "@/components/PaywallModal";

type FetchState = "idle" | "loading" | "ready" | "error";

export default function ReportPage() {
  const router = useRouter();
  const {
    seed,
    followupAnswer,
    answers,
    dynamicReport,
    setDynamicReport,
    reset,
  } = useStore();
  const [mounted, setMounted] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [state, setState] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !seed) router.replace("/onboard");
  }, [mounted, seed, router]);

  const score = useMemo(() => calculateScore(answers), [answers]);

  const runFetch = useCallback(() => {
    setState("loading");
    setErrorMessage(null);
    fetchReport({ seed, followupAnswer, answers, score })
      .then((r) => {
        setDynamicReport(r);
        setState("ready");
      })
      .catch((e: Error) => {
        setErrorMessage(e.message || "리포트 생성에 실패했어요.");
        setState("error");
      });
  }, [seed, followupAnswer, answers, score, setDynamicReport]);

  useEffect(() => {
    if (!mounted || !seed) return;
    if (dynamicReport) {
      if (state !== "ready") setState("ready");
      return;
    }
    if (state === "loading" || state === "error") return;
    runFetch();
  }, [mounted, seed, dynamicReport, state, runFetch]);

  if (!mounted || !seed) {
    return (
      <main className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        리포트 생성 중…
      </main>
    );
  }

  // Loading screen
  if (!dynamicReport && state !== "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        <div className="mt-6 text-base font-semibold text-slate-800">
          AI가 사업계획서를 작성하고 있어요…
        </div>
        <div className="mt-1 text-sm text-slate-500">
          16개 답변 + 시장 그라운딩으로 8섹션 리포트 합성 중 (약 10~15초)
        </div>
      </main>
    );
  }

  // Error screen
  if (!dynamicReport && state === "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-lg font-bold text-slate-900">
            리포트 생성에 실패했어요
          </div>
          <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
          <div className="mt-5 flex gap-2 justify-center">
            <button
              type="button"
              onClick={runFetch}
              className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold"
            >
              다시 시도
            </button>
            <button
              type="button"
              onClick={() => router.push("/plan")}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
            >
              질문으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    );
  }

  const report = dynamicReport!;
  const answeredCount = Object.values(answers).filter((a) => !a.isTodo).length;
  const todoCount = Object.values(answers).filter((a) => a.isTodo).length;

  // Adapt DynamicReport → ReportSection[] for ReportView (skip the 한 줄 요약 section since pitch handles it).
  const sectionsForView: ReportSection[] = report.sections
    .filter((s) => s.title !== "한 줄 요약")
    .map((s) => ({
      title: s.title,
      emoji: s.emoji,
      items: s.items.map((it) => ({
        label: it.label,
        value: it.value,
        isTodo: it.isTodo,
      })),
    }));

  const handleDownloadMd = () => {
    const md = buildMarkdown(
      { seed, followupAnswer, answers },
      { step1Only: false, score, dynamicReport: report }
    );
    downloadTextFile(makeFilename(seed, false), md);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="px-4 md:px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-bold text-slate-900">
            ← ThinkPick
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadMd}
              className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800"
              title="기획안을 마크다운(.md) 파일로 저장"
            >
              ⬇️ MD 다운로드
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100 border border-slate-300"
            >
              📄 PDF 저장
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    "처음부터 다시 시작하시겠어요? 현재 답변은 모두 삭제됩니다."
                  )
                ) {
                  reset();
                  router.push("/");
                }
              }}
              className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100"
            >
              다시 시작
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex-1">
            <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest">
              ThinkPick Report
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900">
              {seed}
            </h1>
            {followupAnswer && (
              <p className="mt-1 text-sm text-slate-500">
                보충: {followupAnswer}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
              <span>✅ 답변 {answeredCount}건</span>
              {todoCount > 0 && (
                <span className="text-amber-700">⚠ To-Do {todoCount}건</span>
              )}
              <span>📅 {new Date().toLocaleDateString("ko-KR")} 생성</span>
            </div>
          </div>
          <div className="shrink-0">
            <FeasibilityScore score={score} size={130} />
          </div>
        </div>

        {/* Upsell banner */}
        <div className="mb-6 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-brand-600 to-purple-600 text-white flex items-center justify-between flex-wrap gap-3 no-print">
          <div>
            <div className="text-base md:text-lg font-bold">
              심층 30문으로 점수 80%+ 달성하기
            </div>
            <p className="text-sm text-white/90 mt-0.5">
              수익 시뮬레이션 · 페르소나 분석 · 포지셔닝 맵 등 IR급 5p 리포트로 확장
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPaywallOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-white text-brand-700 text-sm font-semibold hover:bg-brand-50 transition"
          >
            Pro로 업그레이드 →
          </button>
        </div>

        <ReportView pitch={report.pitch} sections={sectionsForView} />

        <div className="mt-8 text-center text-xs text-slate-500 no-print">
          ThinkPick MVP — Gemini로 실시간 생성된 리포트입니다.
        </div>
      </div>

      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </main>
  );
}
