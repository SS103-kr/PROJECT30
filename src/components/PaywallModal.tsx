"use client";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PaywallModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl mb-2">🔓</div>
        <h3 className="text-xl font-bold text-slate-900">
          심층 30문 · Pro 플랜
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          수익 시뮬레이션, 구체적 타겟 페르소나, 경쟁사 포지셔닝 맵 등 5페이지 분량의 전문가급 리포트로 확장됩니다. 즉시 IR 자료로 사용 가능한 수준이에요.
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 p-4 bg-gradient-to-br from-brand-50 to-purple-50">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-700">19,000원</span>
            <span className="text-sm text-slate-500">/ 월</span>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            <li>✓ 심층 30개 질문 + 5p 리포트</li>
            <li>✓ 무제한 아이디어 포트폴리오 관리</li>
            <li>✓ IR/사업계획서 PDF 내보내기</li>
            <li>✓ 우선 지원 + 신규 기능 베타 액세스</li>
          </ul>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-xl bg-slate-200 text-slate-500 text-sm font-semibold cursor-not-allowed"
            title="MVP 데모 — 결제 연동 준비 중"
          >
            🚧 결제 준비 중 — 곧 만나요!
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm text-slate-500 hover:bg-slate-100"
          >
            나중에 다시 보기
          </button>
        </div>
      </div>
    </div>
  );
}
