"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";

const CORE_FEATURES = [
  {
    emoji: "🎯",
    title: "프롬프트 제로 · 7지선다 큐레이션",
    desc: "AI가 매 질문마다 안정형 2 · 혁신형 2 · 니치형 2 + 직접입력의 맞춤 선택지를 제시합니다. 타이핑 피로 zero.",
  },
  {
    emoji: "📌",
    title: "완벽주의 타파 · To-Do 시스템",
    desc: "막히는 항목은 'To-Do'로 미뤄두고 끝까지 진행. 이탈 없이 완성된 기획안을 손에 쥡니다.",
  },
  {
    emoji: "📈",
    title: "AI 정성평가 · 실현가능성 점수",
    desc: "단순 진행률이 아닌, 논리적 연결성을 평가한 \"현재 실현가능성 32%\" 형태의 게이미피케이션.",
  },
];

const STEPS = [
  { num: "0", title: "재료 수집", desc: "한 줄 아이디어 입력 → AI가 부드럽게 꼬리질문" },
  { num: "1", title: "미니 기획안 (1p)", desc: "린 스타트업 기반 핵심 6개 질문, 약 5분" },
  { num: "2", title: "기획안 확장 (2p · 무료)", desc: "10개 추가 질문, 전체 숲을 시각화" },
  { num: "3", title: "상세 리포트 (5p · Pro)", desc: "심층 30문, IR/사업계획서 즉시 활용 가능" },
];

export default function HomePage() {
  const reset = useStore((s) => s.reset);

  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="px-6 md:px-12 pt-16 md:pt-24 pb-16 max-w-6xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-semibold mb-4">
          🚀 N잡러 · 예비창업자 · 연쇄창업가를 위한 AI 사업기획 도우미
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          막연한 아이디어,
          <br />
          <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            30분이면 사업계획서가 됩니다.
          </span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
          ChatGPT처럼 모든 걸 직접 입력할 필요 없어요. ThinkPick은 당신이 입력한 한 줄을 분석해 매 질문마다
          <strong className="text-slate-800"> 7개의 맞춤 선택지</strong>를 띄워줍니다. 탭만 누르세요.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/onboard"
            onClick={() => reset()}
            className="px-6 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-600/20 transition"
          >
            지금 무료로 시작하기 →
          </Link>
          <a
            href="#how"
            className="px-6 py-4 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-base transition"
          >
            어떻게 동작하나요?
          </a>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          ⚡ 신용카드 불필요 · 회원가입 없이 즉시 사용 · 평균 완료 시간 5분
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-600 text-center">
          3대 코어 엔진
        </h2>
        <p className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 text-center">
          범용 AI가 흉내 낼 수 없는 차별점
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {CORE_FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl">{f.emoji}</div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 md:px-12 py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-600 text-center">
            How it works
          </h2>
          <p className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 text-center">
            4단계로 끝나는 기획 여정
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div
                key={s.num}
                className="p-5 rounded-2xl bg-white border border-slate-200"
              >
                <div className="text-xs font-semibold text-brand-600">STEP {s.num}</div>
                <div className="mt-1 text-base font-bold text-slate-900">{s.title}</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 md:px-12 py-16 max-w-6xl mx-auto">
        <h2 className="text-xs uppercase tracking-widest font-semibold text-brand-600 text-center">
          가격
        </h2>
        <p className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 text-center">
          1~2페이지까지는 영원히 무료
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-white border border-slate-200">
            <div className="text-sm font-semibold text-slate-700">Free</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">0원</div>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
              <li>✓ 미니 기획안 (1p)</li>
              <li>✓ 기획안 확장 (2p)</li>
              <li>✓ 무제한 재시작</li>
            </ul>
            <Link
              href="/onboard"
              onClick={() => reset()}
              className="mt-5 block text-center py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
            >
              지금 시작하기
            </Link>
          </div>
          <div className="p-6 rounded-2xl border-2 border-brand-500 bg-gradient-to-br from-brand-50 to-purple-50 relative">
            <div className="absolute -top-3 right-4 px-2 py-0.5 rounded-full bg-brand-600 text-white text-[11px] font-bold">
              RECOMMENDED
            </div>
            <div className="text-sm font-semibold text-brand-700">Pro</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">
              19,000원
              <span className="text-sm text-slate-500 font-normal"> / 월</span>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
              <li>✓ 심층 30문 + 5p 리포트</li>
              <li>✓ 아이디어 포트폴리오 무제한</li>
              <li>✓ IR/PDF 내보내기</li>
              <li>✓ 신규 기능 베타 우선</li>
            </ul>
            <button
              type="button"
              disabled
              className="mt-5 w-full py-3 rounded-xl bg-slate-200 text-slate-500 text-sm font-semibold cursor-not-allowed"
            >
              결제 준비 중 — 곧 만나요!
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            머릿속 한 줄, 지금 바로 꺼내보세요
          </h2>
          <p className="mt-3 text-slate-600">
            평균 5분이면 미니 기획안이 완성됩니다.
          </p>
          <Link
            href="/onboard"
            onClick={() => reset()}
            className="mt-8 inline-block px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-600/20 transition"
          >
            지금 무료로 시작 →
          </Link>
        </div>
      </section>

      <footer className="px-6 md:px-12 py-8 border-t border-slate-200 text-center text-xs text-slate-500">
        © 2026 ThinkPick · MVP Prototype
      </footer>
    </main>
  );
}
