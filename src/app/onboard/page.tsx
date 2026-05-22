"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { fetchFollowup } from "@/lib/llmClient";

const PLACEHOLDERS = [
  "예: 출퇴근길에 매일 빵을 추천해주는 앱 — 직장인들이 점심을 빠르게 결정할 수 있게",
  "예: 반려견 산책 시간을 매칭해주는 동네 커뮤니티",
  "예: 시니어 개발자들이 1:1로 만나 이직 코칭을 해주는 서비스",
  "예: AI가 회의록을 요약해서 슬랙으로 자동 발송",
];

export default function OnboardPage() {
  const router = useRouter();
  const setSeed = useStore((s) => s.setSeed);
  const setFollowupAnswer = useStore((s) => s.setFollowupAnswer);
  const setDynamicFollowupQuestion = useStore(
    (s) => s.setDynamicFollowupQuestion
  );
  const reset = useStore((s) => s.reset);

  const [step, setStep] = useState<"seed" | "followup">("seed");
  const [seedDraft, setSeedDraft] = useState("");
  const [followupDraft, setFollowupDraft] = useState("");
  const [followupQuestion, setFollowupQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholder] = useState(
    PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  );

  const handleNext = async () => {
    const seed = seedDraft.trim();
    if (!seed) return;
    setError(null);
    setLoading(true);
    try {
      const { needFollowup, question } = await fetchFollowup(seed);
      if (needFollowup && question) {
        setFollowupQuestion(question);
        setStep("followup");
        return;
      }
      // good enough — proceed
      reset();
      setSeed(seed);
      router.push("/plan");
    } catch (e) {
      setError((e as Error).message || "AI 호출에 실패했어요. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = () => {
    reset();
    setSeed(seedDraft.trim());
    setFollowupAnswer(followupDraft.trim());
    setDynamicFollowupQuestion(followupQuestion);
    router.push("/plan");
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-slate-900">
          ← ThinkPick
        </Link>
        <div className="text-xs text-slate-500">Step 0 · 재료 수집</div>
      </div>

      <div className="flex-1 px-6 py-10 md:py-16 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {step === "seed" ? (
            <div className="animate-slide-up">
              <div className="text-xs font-semibold tracking-widest text-brand-600 uppercase">
                Step 0 · 첫 번째 단계
              </div>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                머릿속에 떠도는
                <br />
                아이디어를 한 줄로 적어주세요.
              </h1>
              <p className="mt-3 text-slate-600 leading-relaxed">
                완벽한 문장이 아니어도 괜찮아요. AI가 부드럽게 꼬리질문을 던지며 다듬어 드립니다.
              </p>

              <textarea
                autoFocus
                value={seedDraft}
                onChange={(e) => setSeedDraft(e.target.value)}
                placeholder={placeholder}
                rows={5}
                disabled={loading}
                className="mt-6 w-full rounded-2xl border-2 border-slate-200 focus:border-brand-500 focus:ring-0 p-5 text-base leading-relaxed resize-none transition outline-none disabled:bg-slate-50"
              />

              <div className="mt-2 text-xs text-slate-500">
                💡 너무 짧으면 다음 화면에서 한 번 더 물어볼게요.
              </div>

              {error && (
                <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  AI 호출 실패: {error}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={loading || seedDraft.trim().length < 2}
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      AI 분석 중…
                    </>
                  ) : (
                    <>다음 →</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div className="text-xs font-semibold tracking-widest text-brand-600 uppercase">
                Step 0 · AI 꼬리질문
              </div>
              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                좋아요! 한 가지만 더…
              </h1>
              <div className="mt-5 p-5 rounded-2xl bg-brand-50 border border-brand-100">
                <div className="text-xs font-semibold text-brand-700 mb-1">
                  🤖 ThinkPick AI
                </div>
                <p className="text-base text-slate-900 leading-relaxed">
                  {followupQuestion}
                </p>
              </div>

              <textarea
                autoFocus
                value={followupDraft}
                onChange={(e) => setFollowupDraft(e.target.value)}
                placeholder="짧게 한 문장으로 답해주세요"
                rows={3}
                className="mt-4 w-full rounded-2xl border-2 border-slate-200 focus:border-brand-500 p-5 text-base resize-none outline-none transition"
              />

              <div className="mt-6 flex justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setStep("seed")}
                  className="px-4 py-3 rounded-xl text-sm text-slate-600 hover:bg-slate-100"
                >
                  ← 처음 입력으로
                </button>
                <button
                  type="button"
                  onClick={handleFinalize}
                  disabled={followupDraft.trim().length < 2}
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  16개 질문으로 진행 →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
