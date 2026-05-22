import "server-only";
import type { Answer, Question } from "../types";

// ───────────────────────── Followup ─────────────────────────

export const followupSystem = `당신은 한국 스타트업 아이디어 인터뷰어입니다.
사용자가 자신의 사업 아이디어를 한 줄로 적었습니다. 이 시드가 너무 짧거나 모호하면(20자 미만 또는 핵심 명사 3개 미만) needFollowup=true로 답하고, 아이디어를 한 단계 구체화할 짧은 꼬리질문 한 가지(40자 이내, 한국어)를 question에 담으세요.
이미 충분히 구체적이면 needFollowup=false, question=""로 답하세요.
꼬리질문은 부드럽고 따뜻한 톤으로, 예시를 1개 포함해도 좋습니다.`;

export function followupUser(seed: string): string {
  return `시드: ${seed}`;
}

// ───────────────────────── Choices ─────────────────────────

export const choicesSystem = `당신은 한국 스타트업 컨설턴트입니다. 사용자의 막연한 아이디어를 듣고, 각 질문마다 정확히 6개의 선택지를 생성합니다.

핵심 규칙:
- 6개 = 안정형(stable) 2개 + 혁신형(innovative) 2개 + 니치형(niche) 2개. 카테고리는 골고루.
- 안정형 = 검증된/현실적/지루하지만 안전한 선택. 가장 흔한 정답.
- 혁신형 = 파괴적/대담한/AI 시대적인 선택. 흥미롭지만 리스크 있음.
- 니치형 = 좁고 깊은 시장에 집중한 선택. B2B/특정 페르소나/프리미엄 등.
- label은 한국어 8~20자. detail은 한국어 한 문장 30~60자.
- 사용자 아이디어의 핵심 키워드를 최소 절반 이상의 선택지에 자연스럽게 녹여 "AI가 내 아이디어를 진짜 읽었다"는 인상을 만드세요.
- id 형식: {questionId}-s1 / -s2 / -i1 / -i2 / -n1 / -n2 (카테고리별로 1,2 인덱스).
- 같은 질문 내 6개 선택지는 의미가 겹치지 않도록 분산시키세요.`;

interface ChoicesUserArgs {
  seed: string;
  followupAnswer: string;
  questions: Pick<Question, "id" | "prompt" | "sectionTitle">[];
  priorAnswers?: { sectionTitle: string; text: string }[]; // step 2
}

export function choicesUser({
  seed,
  followupAnswer,
  questions,
  priorAnswers,
}: ChoicesUserArgs): string {
  const lines: string[] = [];
  lines.push(`사용자 아이디어: "${seed}"`);
  if (followupAnswer) lines.push(`보충 답변: ${followupAnswer}`);

  if (priorAnswers && priorAnswers.length > 0) {
    lines.push("");
    lines.push("[Step 1에서 이미 사용자가 답한 결과 — 일관성을 유지하세요]");
    for (const a of priorAnswers) {
      lines.push(`- ${a.sectionTitle}: ${a.text}`);
    }
  }

  lines.push("");
  lines.push("[다음 질문들에 대해 각각 6개의 선택지를 생성하세요]");
  questions.forEach((q, i) => {
    lines.push(
      `${i + 1}. (id=${q.id}) [${q.sectionTitle}] ${q.prompt.replace(/\{seed\}/g, seed)}`
    );
  });
  lines.push("");
  lines.push("응답은 반드시 JSON 스키마에 맞춰주세요.");
  return lines.join("\n");
}

// ───────────────────────── Report (grounding + synthesis) ─────────────────────────

export const groundingSystem = `당신은 한국 시장 리서치 분석가입니다. 사용자의 사업 아이디어와 관련 답변을 보고, 웹 검색을 활용해 다음을 한국어로 정리하세요:
1) 직간접 경쟁사 2~3개 (이름, 한 줄 설명)
2) 시장 트렌드 1~2문장 (한국 시장 우선)
3) 가장 큰 외부 리스크 1개

전체 분량은 300자 이내. 사실 기반으로, 출처가 없는 추측은 피하세요.`;

interface GroundingUserArgs {
  seed: string;
  followupAnswer: string;
  answers: Record<string, Answer>;
  questions: Question[];
}

export function groundingUser({
  seed,
  followupAnswer,
  answers,
  questions,
}: GroundingUserArgs): string {
  const lines: string[] = [];
  lines.push(`아이디어: "${seed}"`);
  if (followupAnswer) lines.push(`보충: ${followupAnswer}`);
  lines.push("");
  lines.push("사용자가 고른 답변 요약:");
  for (const q of questions) {
    const a = answers[q.id];
    if (!a || a.isTodo) continue;
    lines.push(`- ${q.sectionTitle}: ${a.text}`);
  }
  return lines.join("\n");
}

export const reportSystem = `당신은 한국 스타트업 컨설턴트입니다. 사용자가 16개 질문에 답한 결과와 별도로 제공되는 시장 그라운딩 정보를 바탕으로, 1~2페이지짜리 사업계획서 리포트를 8개 섹션으로 작성합니다.

8개 섹션 (이 순서/제목/이모지를 정확히 유지):
1. 💡 한 줄 요약  — items 1개 (label="한 줄 요약")
2. 🎯 타겟 & 핵심 문제 — items 2개 (label은 "타겟 고객", "핵심 문제")
3. ⚙️ 솔루션 & 차별점 — items 2개 ("솔루션 형태", "차별점")
4. 💰 비즈니스 모델 & 가격 — items 2개 ("비즈니스 모델", "가격 정책")
5. 📣 채널 & 초기 마케팅 — items 2개 ("초기 고객 채널", "초기 마케팅 전략")
6. 🚀 성장 전략 (MVP · 지표 · 마일스톤) — items 3개 ("MVP 범위", "핵심 지표 (North Star Metric)", "6개월 마일스톤")
7. 👥 팀 · 경쟁 환경 — items 2개 ("초기 팀 구성", "경쟁사 분석")
8. ⚠️ 리스크 & 다음 액션 — items 2개 ("가장 큰 리스크", "이번 주 다음 액션")

각 item의 value:
- 사용자가 고른 답변을 단순 복사하지 말고 자연스럽게 재서술 + 한 줄 보강(인사이트 또는 액션 힌트).
- 사용자가 To-Do로 넘긴 항목(isTodo=true)은 빈자리지만, 짧은 추천 액션 한 줄을 value에 담고 isTodo=true 유지.
- "팀 · 경쟁 환경" 섹션의 "경쟁사 분석" item에는 그라운딩으로 알게 된 한국 경쟁사 1~2개를 자연스럽게 언급.
- "한 줄 요약" 섹션의 단일 item value는 80자 이내 한 문장. pitch와 동일하지 않게 약간 다른 표현.

pitch: 별도 필드. 80자 이내 한 줄 엘리베이터 피치(시드를 자연스럽게 포함).`;

interface ReportUserArgs {
  seed: string;
  followupAnswer: string;
  answers: Record<string, Answer>;
  questions: Question[];
  groundingNotes: string;
  score?: number;
}

export function reportUser({
  seed,
  followupAnswer,
  answers,
  questions,
  groundingNotes,
  score,
}: ReportUserArgs): string {
  const lines: string[] = [];
  lines.push(`사용자 아이디어: "${seed}"`);
  if (followupAnswer) lines.push(`보충 답변: ${followupAnswer}`);
  if (typeof score === "number")
    lines.push(`실현가능성 점수: ${score}%`);
  lines.push("");
  lines.push("[사용자가 16개 질문에 답한 결과]");
  for (const q of questions) {
    const a = answers[q.id];
    if (!a) {
      lines.push(`- (미답변) ${q.sectionTitle}`);
      continue;
    }
    if (a.isTodo) {
      lines.push(`- [To-Do] ${q.sectionTitle}: (사용자가 결정 미룸 — 추천 액션 필요)`);
    } else {
      lines.push(`- ${q.sectionTitle}: ${a.text}`);
    }
  }
  lines.push("");
  lines.push("[시장 그라운딩 정보 — 가능하면 경쟁사 분석 항목에 반영]");
  lines.push(groundingNotes || "(그라운딩 정보 없음 — 보유 지식으로 보강)");
  lines.push("");
  lines.push("위 정보를 바탕으로 JSON 스키마에 맞춰 8섹션 리포트를 작성하세요.");
  return lines.join("\n");
}
