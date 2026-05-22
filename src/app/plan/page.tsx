"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { QUESTIONS } from "@/lib/mockData";
import { calculateScore } from "@/lib/scoring";
import { buildMarkdown, makeFilename } from "@/lib/reportBuilder";
import { downloadTextFile } from "@/lib/download";
import { fetchStep1Choices, fetchStep2Choices } from "@/lib/llmClient";
import QuestionCard from "@/components/QuestionCard";
import ProgressBar from "@/components/ProgressBar";
import FeasibilityScore from "@/components/FeasibilityScore";
import TodoSidebar from "@/components/TodoSidebar";
import StructureMap from "@/components/StructureMap";
import WowMomentModal from "@/components/WowMomentModal";
import PaywallModal from "@/components/PaywallModal";

const STEP1_COUNT = 6;
const STEP1_IDS = QUESTIONS.filter((q) => q.step === 1).map((q) => q.id);
const STEP2_IDS = QUESTIONS.filter((q) => q.step === 2).map((q) => q.id);

type FetchState = "idle" | "loading" | "ready" | "error";

export default function PlanPage() {
  const router = useRouter();
  const {
    seed,
    followupAnswer,
    answers,
    currentIndex,
    hasSeenWowMoment,
    dynamicChoices,
    answerQuestion,
    goNext,
    goPrev,
    jumpTo,
    markWowSeen,
    mergeDynamicChoices,
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [wowOpen, setWowOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const [step1State, setStep1State] = useState<FetchState>("idle");
  const [step2State, setStep2State] = useState<FetchState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // No seed → bounce to onboard
  useEffect(() => {
    if (mounted && !seed) {
      router.replace("/onboard");
    }
  }, [mounted, seed, router]);

  const hasStep1Choices = useMemo(
    () => STEP1_IDS.every((id) => dynamicChoices[id]?.length === 6),
    [dynamicChoices]
  );
  const hasStep2Choices = useMemo(
    () => STEP2_IDS.every((id) => dynamicChoices[id]?.length === 6),
    [dynamicChoices]
  );

  // Step 1 prefetch — on mount when seed is ready
  useEffect(() => {
    if (!mounted || !seed) return;
    if (hasStep1Choices) {
      if (step1State !== "ready") setStep1State("ready");
      return;
    }
    if (step1State === "loading" || step1State === "error") return;

    setStep1State("loading");
    setErrorMessage(null);
    fetchStep1Choices({ seed, followupAnswer })
      .then((res) => {
        mergeDynamicChoices(res.choices);
        setStep1State("ready");
      })
      .catch((e: Error) => {
        setStep1State("error");
        setErrorMessage(e.message || "선택지 생성에 실패했어요.");
      });
  }, [mounted, seed, followupAnswer, hasStep1Choices, step1State, mergeDynamicChoices]);

  // Step 2 prefetch — kick off when user reaches the tail of step 1 (q6) or beyond
  useEffect(() => {
    if (!mounted || !seed) return;
    if (currentIndex < STEP1_COUNT - 1) return; // wait until user is on q6 or later
    if (hasStep2Choices) {
      if (step2State !== "ready") setStep2State("ready");
      return;
    }
    if (step2State === "loading" || step2State === "error") return;

    setStep2State("loading");
    fetchStep2Choices({ seed, followupAnswer, answers })
      .then((res) => {
        mergeDynamicChoices(res.choices);
        setStep2State("ready");
      })
      .catch((e: Error) => {
        setStep2State("error");
        // Only surface step 2 error when user actually crosses into step 2
        if (currentIndex >= STEP1_COUNT) {
          setErrorMessage(e.message || "Step 2 선택지 생성에 실패했어요.");
        }
      });
  }, [
    mounted,
    seed,
    followupAnswer,
    answers,
    currentIndex,
    hasStep2Choices,
    step2State,
    mergeDynamicChoices,
  ]);

  const question = QUESTIONS[currentIndex];
  const score = useMemo(() => calculateScore(answers), [answers]);

  if (!mounted || !seed) {
    return (
      <main className="min-h-screen flex items-center justify-center text-sm text-slate-500">
        불러오는 중…
      </main>
    );
  }

  // Step 1 fetch in flight → full-screen loader
  if (!hasStep1Choices && step1State !== "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        <div className="mt-6 text-base font-semibold text-slate-800">
          AI가 당신의 아이디어를 읽고 있어요…
        </div>
        <div className="mt-1 text-sm text-slate-500">
          6개 질문 × 6개 선택지를 맞춤 생성 중 (약 5초 소요)
        </div>
      </main>
    );
  }

  // Step 1 fetch failed → error card
  if (!hasStep1Choices && step1State === "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-lg font-bold text-slate-900">
            AI 호출에 실패했어요
          </div>
          <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
          <div className="mt-5 flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                setStep1State("idle");
                setErrorMessage(null);
              }}
              className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold"
            >
              다시 시도
            </button>
            <button
              type="button"
              onClick={() => router.push("/onboard")}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
            >
              처음으로
            </button>
          </div>
        </div>
      </main>
    );
  }

  // User is in step 2 zone but step 2 not ready yet → blocking loader
  const inStep2 = currentIndex >= STEP1_COUNT;
  if (inStep2 && !hasStep2Choices && step2State !== "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        <div className="mt-6 text-base font-semibold text-slate-800">
          확장 질문(Step 2) 선택지를 만드는 중…
        </div>
        <div className="mt-1 text-sm text-slate-500">
          Step 1 답변을 반영해 10개 질문의 선택지를 생성합니다
        </div>
      </main>
    );
  }

  if (inStep2 && !hasStep2Choices && step2State === "error") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 text-center shadow-sm">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-lg font-bold text-slate-900">
            확장 질문 생성에 실패했어요
          </div>
          <p className="mt-2 text-sm text-slate-600">{errorMessage}</p>
          <div className="mt-5 flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => {
                setStep2State("idle");
                setErrorMessage(null);
              }}
              className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold"
            >
              다시 시도
            </button>
          </div>
        </div>
      </main>
    );
  }

  const questionChoices = dynamicChoices[question.id] ?? [];
  const selectedAnswer = answers[question.id];

  const handlePick = (args: {
    choiceId?: string;
    category: "stable" | "innovative" | "niche" | "custom";
    text: string;
    isTodo?: boolean;
  }) => {
    answerQuestion({
      questionId: question.id,
      choiceId: args.choiceId,
      category: args.category,
      text: args.text,
      isTodo: args.isTodo,
    });

    // After Step 1 (6th question), show wow moment once
    if (currentIndex === STEP1_COUNT - 1 && !hasSeenWowMoment) {
      setTimeout(() => setWowOpen(true), 400);
      return;
    }

    // Final question → go to report
    if (currentIndex === QUESTIONS.length - 1) {
      setTimeout(() => router.push("/report"), 300);
      return;
    }

    setTimeout(() => goNext(), 200);
  };

  const handleWowContinue = () => {
    markWowSeen();
    setWowOpen(false);
    goNext();
  };

  const handleWowViewReport = () => {
    markWowSeen();
    setWowOpen(false);
    router.push("/report");
  };

  const handleDownloadStep1Md = () => {
    const md = buildMarkdown(
      { seed, followupAnswer, answers },
      { step1Only: true, score }
    );
    downloadTextFile(makeFilename(seed, true), md);
  };

  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      {/* Top bar */}
      <header className="px-4 md:px-6 py-3 border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-sm font-bold text-slate-900 shrink-0">
            ThinkPick
          </Link>
          <div className="flex-1 min-w-0">
            <ProgressBar
              current={currentIndex + 1}
              total={QUESTIONS.length}
              step1Count={STEP1_COUNT}
            />
          </div>
          <div className="hidden md:block shrink-0">
            <FeasibilityScore score={score} size={50} compact />
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-6">
        {/* Question area */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
          <QuestionCard
            key={question.id}
            question={question}
            choices={questionChoices}
            seed={seed}
            selectedChoiceId={selectedAnswer?.choiceId}
            onPick={handlePick}
          />

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => goPrev()}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← 이전
            </button>

            <div className="text-xs text-slate-500">
              {currentIndex + 1} / {QUESTIONS.length}
            </div>

            {currentIndex === QUESTIONS.length - 1 ? (
              <button
                type="button"
                onClick={() => setPaywallOpen(true)}
                className="px-4 py-2 rounded-lg text-sm text-purple-700 hover:bg-purple-50 font-medium"
                title="심층 30문 (Pro)"
              >
                심층 30문 ↗
              </button>
            ) : selectedAnswer ? (
              <button
                type="button"
                onClick={() => goNext()}
                className="px-4 py-2 rounded-lg text-sm text-brand-700 hover:bg-brand-50 font-medium"
              >
                다음 →
              </button>
            ) : (
              <span className="text-xs text-slate-400">선택지를 골라주세요</span>
            )}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start no-print">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center">
            <FeasibilityScore score={score} size={110} />
          </div>
          <StructureMap
            answers={answers}
            currentIndex={currentIndex}
            onJump={jumpTo}
          />
          <TodoSidebar answers={answers} onJump={jumpTo} />
        </aside>
      </div>

      <WowMomentModal
        open={wowOpen}
        score={score}
        onContinue={handleWowContinue}
        onViewReport={handleWowViewReport}
        onDownloadMd={handleDownloadStep1Md}
      />
      <PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </main>
  );
}
