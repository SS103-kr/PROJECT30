import type { Question } from "./types";

/**
 * 16 questions: 6 Step1 (mini plan, 1p) + 10 Step2 (expanded, 2p / free 마지노선)
 * Each question has exactly 6 choices (2 stable / 2 innovative / 2 niche).
 * UI adds a 7th "직접 입력" option automatically.
 *
 * The token {seed} in choice text is replaced at render time with the user's
 * onboarding input — gives a "AI reads my idea" feel without real LLM calls.
 */
export const QUESTIONS: Question[] = [
  // ───────────────────────────── Step 1: 미니 기획안 (6) ─────────────────────────────
  {
    id: "q1-target",
    step: 1,
    category: "target",
    sectionTitle: "타겟 고객",
    prompt: "이 아이디어가 가장 절실하게 필요한 핵심 타겟은 누구인가요?",
    helper: "지금부터 6개의 질문으로 1페이지짜리 미니 기획안을 만듭니다.",
    choices: [
      { id: "q1-s1", category: "stable", label: "30대 직장인 N잡러", detail: "본업 외 부수입을 만들고 싶지만 시간이 부족한 사람" },
      { id: "q1-s2", category: "stable", label: "20대 후반 예비 창업자", detail: "아이디어는 있지만 사업계획서 작성을 막막해함" },
      { id: "q1-i1", category: "innovative", label: "AI에게 창업을 위임하는 1인기업가", detail: "AI 에이전트와 협업해 5개 이상 사업을 동시에 굴림" },
      { id: "q1-i2", category: "innovative", label: "글로벌 디지털 노마드", detail: "국경 없이 매월 새 아이디어를 검증하며 사는 사람들" },
      { id: "q1-n1", category: "niche", label: "이직 준비 중인 시니어 개발자", detail: "10년차 이상 IT 전문가, 사이드 프로젝트로 독립 준비" },
      { id: "q1-n2", category: "niche", label: "퇴직 후 재취업 대신 창업을 택한 40-50대", detail: "축적된 경력을 살려 작은 비즈니스를 만들고 싶은 층" },
    ],
  },
  {
    id: "q2-problem",
    step: 1,
    category: "problem",
    sectionTitle: "핵심 문제",
    prompt: "타겟 고객이 '{seed}' 과정에서 가장 답답해하는 문제는 무엇일까요?",
    choices: [
      { id: "q2-s1", category: "stable", label: "정보가 흩어져 있다", detail: "유튜브, 블로그, 책 등에 산재해 한 번에 정리되지 않음" },
      { id: "q2-s2", category: "stable", label: "혼자서는 끝까지 못한다", detail: "동기부여가 약해 중도에 포기하는 경우가 대부분" },
      { id: "q2-i1", category: "innovative", label: "전문가의 1:1 멘토링은 너무 비싸다", detail: "회당 20-50만원, 진입장벽이 크다" },
      { id: "q2-i2", category: "innovative", label: "AI 도구가 너무 일반적인 답만 준다", detail: "ChatGPT는 내 상황에 맞는 깊이 있는 조언을 못함" },
      { id: "q2-n1", category: "niche", label: "어디서 시작해야 할지 모른다", detail: "첫 단추를 끼우는 단계에서 멈춰 있음" },
      { id: "q2-n2", category: "niche", label: "검증된 프레임워크가 부재", detail: "실패율을 줄여줄 체계적 가이드가 없음" },
    ],
  },
  {
    id: "q3-solution",
    step: 1,
    category: "solution",
    sectionTitle: "솔루션 형태",
    prompt: "이 문제를 어떤 형태의 서비스로 풀어내면 좋을까요?",
    choices: [
      { id: "q3-s1", category: "stable", label: "모바일 앱 (iOS/Android)", detail: "가장 친숙하고 접근성이 높음, 푸시 알림 활용 가능" },
      { id: "q3-s2", category: "stable", label: "웹 기반 SaaS", detail: "PC 친화적이고 출시 속도가 빠름" },
      { id: "q3-i1", category: "innovative", label: "AI 에이전트 채팅", detail: "대화형 UI로 진입장벽 zero, 텍스트 한 줄로 시작" },
      { id: "q3-i2", category: "innovative", label: "카카오톡 챗봇", detail: "별도 앱 설치 없이 메신저 안에서 완결" },
      { id: "q3-n1", category: "niche", label: "오프라인 워크숍 + 디지털 보조", detail: "고가 프리미엄 시장, 단위 매출 큼" },
      { id: "q3-n2", category: "niche", label: "노션/구글시트 템플릿 + 커뮤니티", detail: "MVP로 가장 빠르게 가설 검증 가능" },
    ],
  },
  {
    id: "q4-value",
    step: 1,
    category: "value",
    sectionTitle: "가치 제안",
    prompt: "한 문장으로, 이 서비스는 고객에게 무엇을 약속하나요?",
    choices: [
      { id: "q4-s1", category: "stable", label: "시간을 90% 절약해 준다", detail: "5시간 걸리던 일을 30분 안에 끝낸다" },
      { id: "q4-s2", category: "stable", label: "전문가 수준의 결과물을 즉시 제공한다", detail: "투자자에게 그대로 보여줘도 손색없는 품질" },
      { id: "q4-i1", category: "innovative", label: "막연함을 구체성으로 바꾼다", detail: "머릿속 단어 한 줄을 실행 가능한 계획으로" },
      { id: "q4-i2", category: "innovative", label: "혼자가 아니다 — AI가 옆에서 거든다", detail: "심리적 외로움까지 해소" },
      { id: "q4-n1", category: "niche", label: "내 사업의 실현 가능성을 숫자로 보여준다", detail: "주관적 자신감 대신 객관적 점수" },
      { id: "q4-n2", category: "niche", label: "한 번에 5개 아이디어를 빠르게 검증한다", detail: "기회비용을 줄이고 best one에 집중" },
    ],
  },
  {
    id: "q5-bm",
    step: 1,
    category: "bm",
    sectionTitle: "비즈니스 모델",
    prompt: "어떻게 돈을 벌 계획인가요?",
    choices: [
      { id: "q5-s1", category: "stable", label: "월 구독 (Freemium)", detail: "무료 진입 + 핵심 기능 유료, 가장 검증된 SaaS 모델" },
      { id: "q5-s2", category: "stable", label: "단건 결제 (Pay-per-Report)", detail: "리포트 1개당 9,900원, 진입 부담 낮음" },
      { id: "q5-i1", category: "innovative", label: "B2B2C — 액셀러레이터/창업지원기관에 공급", detail: "기관이 비용 부담, 사용자는 무료" },
      { id: "q5-i2", category: "innovative", label: "데이터 라이선싱", detail: "익명화된 아이디어 트렌드를 VC/기업에 판매" },
      { id: "q5-n1", category: "niche", label: "프리미엄 컨설팅 패키지", detail: "AI + 인간 전문가 매칭, 회당 50만원" },
      { id: "q5-n2", category: "niche", label: "교육 콘텐츠 묶음 판매", detail: "구독 + 강의 + 커뮤니티 번들" },
    ],
  },
  {
    id: "q6-channel",
    step: 1,
    category: "channel",
    sectionTitle: "초기 고객 채널",
    prompt: "첫 100명의 사용자는 어디에서 데려올 건가요?",
    choices: [
      { id: "q6-s1", category: "stable", label: "인스타그램 / 쓰레드 마케팅", detail: "타겟 친화적이고 콘텐츠 회전이 빠름" },
      { id: "q6-s2", category: "stable", label: "구글/네이버 검색 광고", detail: "구매 의향이 높은 검색 기반 유입" },
      { id: "q6-i1", category: "innovative", label: "Product Hunt + 해커뉴스 런칭", detail: "글로벌 얼리어답터 한 번에 모음" },
      { id: "q6-i2", category: "innovative", label: "AI 트위터(X) 인플루언서 협업", detail: "기술 친화 사용자에게 신뢰감 있는 노출" },
      { id: "q6-n1", category: "niche", label: "예비창업패키지 멘토단 네트워킹", detail: "정부 지원사업 통한 직접 도달" },
      { id: "q6-n2", category: "niche", label: "특정 카페/디스코드 커뮤니티 입소문", detail: "좁고 깊은 fan 만들기" },
    ],
  },

  // ───────────────────────────── Step 2: 기획안 확장 (10) ─────────────────────────────
  {
    id: "q7-differentiator",
    step: 2,
    category: "differentiator",
    sectionTitle: "차별점",
    prompt: "ChatGPT 같은 범용 AI 대비 이 서비스만의 차별점은?",
    helper: "지금부터는 2페이지짜리 확장 기획안입니다. 답이 막히면 'To-Do로 적립'을 눌러 넘어가세요.",
    choices: [
      { id: "q7-s1", category: "stable", label: "도메인 특화 프롬프트", detail: "사업계획서 작성에만 튜닝된 응답 품질" },
      { id: "q7-s2", category: "stable", label: "7지선다 큐레이션 UX", detail: "타이핑 피로 없이 탭만으로 진행" },
      { id: "q7-i1", category: "innovative", label: "실현가능성 점수화", detail: "정성적 평가를 정량 점수로 변환" },
      { id: "q7-i2", category: "innovative", label: "포트폴리오 관리", detail: "여러 아이디어를 동시에 비교/피보팅" },
      { id: "q7-n1", category: "niche", label: "한국 시장 특화 데이터", detail: "한국 규제, 가격대, 채널에 최적화" },
      { id: "q7-n2", category: "niche", label: "투자자 피칭 템플릿 즉시 변환", detail: "결과물을 그대로 IR 자료로 사용 가능" },
    ],
  },
  {
    id: "q8-metric",
    step: 2,
    category: "metric",
    sectionTitle: "핵심 지표 (North Star Metric)",
    prompt: "사업의 성공을 측정할 단 하나의 지표는?",
    choices: [
      { id: "q8-s1", category: "stable", label: "유료 전환율 (Free → Paid)", detail: "5% 목표, SaaS 기본 지표" },
      { id: "q8-s2", category: "stable", label: "월간 활성 사용자 (MAU)", detail: "성장의 가장 일반적인 척도" },
      { id: "q8-i1", category: "innovative", label: "완성된 리포트 수", detail: "사용자가 끝까지 도달한 수, 진짜 가치 전달의 증거" },
      { id: "q8-i2", category: "innovative", label: "리포트 → 실제 창업 전환율", detail: "장기적으로 추적, 임팩트 메트릭" },
      { id: "q8-n1", category: "niche", label: "NPS (순추천지수)", detail: "이 작은 시장에선 입소문이 성장 동력" },
      { id: "q8-n2", category: "niche", label: "재방문 주기", detail: "여러 아이디어를 반복 검증하는 빈도" },
    ],
  },
  {
    id: "q9-mvp",
    step: 2,
    category: "mvp",
    sectionTitle: "MVP 범위",
    prompt: "첫 3개월 내에 출시할 MVP에 무엇을 포함시킬까요?",
    choices: [
      { id: "q9-s1", category: "stable", label: "Step 1 미니 기획안만", detail: "가장 빠른 출시, 핵심 가치만 검증" },
      { id: "q9-s2", category: "stable", label: "Step 1 + Step 2 무료 구간", detail: "유료 전환 없이 제품 fit 먼저 측정" },
      { id: "q9-i1", category: "innovative", label: "Step 1~3 + 결제 + 포트폴리오", detail: "풀스택, 6개월 준비 필요" },
      { id: "q9-i2", category: "innovative", label: "AI 음성 인터뷰 모드", detail: "타이핑 zero, 대화로만 진행" },
      { id: "q9-n1", category: "niche", label: "노션 템플릿 + 챗봇 결합", detail: "no-code로 1주일 안에 출시" },
      { id: "q9-n2", category: "niche", label: "특정 산업(예: 1인 미디어) 한정 MVP", detail: "좁게 깊게, 빠른 점유" },
    ],
  },
  {
    id: "q10-marketing",
    step: 2,
    category: "marketing",
    sectionTitle: "초기 마케팅 전략",
    prompt: "출시 첫 달, 가장 효과적인 마케팅 전술 하나는?",
    choices: [
      { id: "q10-s1", category: "stable", label: "콘텐츠 마케팅 (블로그 SEO)", detail: "느리지만 복리, '사업계획서 작성법' 키워드 선점" },
      { id: "q10-s2", category: "stable", label: "유튜브 쇼츠/릴스 시리즈", detail: "10초 미만 영상으로 7지선다 UX 보여주기" },
      { id: "q10-i1", category: "innovative", label: "Build in Public", detail: "개발 과정 공개, 트위터/링크드인 팔로워 확보" },
      { id: "q10-i2", category: "innovative", label: "공개 챌린지 — '7일만에 사업계획서 완성'", detail: "사용자 참여형 캠페인" },
      { id: "q10-n1", category: "niche", label: "창업 동아리 / MBA 과정 제휴", detail: "검증된 잠재 고객풀에 직접 침투" },
      { id: "q10-n2", category: "niche", label: "VC/액셀러레이터 추천 리스트 등재", detail: "포트폴리오 회사들에 도구로 추천받음" },
    ],
  },
  {
    id: "q11-competitor",
    step: 2,
    category: "competitor",
    sectionTitle: "경쟁사 분석",
    prompt: "가장 위협적인 경쟁자는 누구이며, 우리의 우위는 무엇인가요?",
    choices: [
      { id: "q11-s1", category: "stable", label: "ChatGPT — 범용성으로 압도", detail: "우리는 UX와 도메인 깊이로 승부" },
      { id: "q11-s2", category: "stable", label: "Notion AI — 문서 작성 통합", detail: "우리는 가이드된 인터뷰 형식이 차별점" },
      { id: "q11-i1", category: "innovative", label: "예비창업패키지 등 정부 지원사업", detail: "오프라인 멘토링 대비 24/7 즉시성으로 승부" },
      { id: "q11-i2", category: "innovative", label: "기존 BMC/SWOT 템플릿 사이트", detail: "정적 vs 우리는 동적 AI 가이드" },
      { id: "q11-n1", category: "niche", label: "사업계획서 대행 컨설팅 업체", detail: "10분의 1 가격, 100배 빠른 속도" },
      { id: "q11-n2", category: "niche", label: "Y Combinator의 Startup School 강의", detail: "강의 형식 vs 우리는 1:1 인터랙티브" },
    ],
  },
  {
    id: "q12-risk",
    step: 2,
    category: "risk",
    sectionTitle: "가장 큰 리스크",
    prompt: "이 사업의 가장 큰 잠재적 리스크는 무엇인가요?",
    choices: [
      { id: "q12-s1", category: "stable", label: "AI 응답 품질이 기대 이하", detail: "prompt engineering 역량이 핵심" },
      { id: "q12-s2", category: "stable", label: "유료 전환율이 너무 낮음", detail: "무료 구간이 너무 충실해 paywall 매력 부족" },
      { id: "q12-i1", category: "innovative", label: "범용 AI(ChatGPT-5 등)의 추격", detail: "OpenAI가 비슷한 UX 내놓으면 즉시 시장 잠식" },
      { id: "q12-i2", category: "innovative", label: "한국 시장의 작은 규모", detail: "TAM 한계로 글로벌 진출 필수" },
      { id: "q12-n1", category: "niche", label: "초기 사용자 모집 비용", detail: "타겟 도달 단가가 예상보다 높을 수 있음" },
      { id: "q12-n2", category: "niche", label: "AI API 비용 구조", detail: "사용자당 비용이 ARPU를 넘으면 적자" },
    ],
  },
  {
    id: "q13-milestone",
    step: 2,
    category: "milestone",
    sectionTitle: "6개월 마일스톤",
    prompt: "6개월 후, 어떤 상태이면 성공이라고 말할 수 있나요?",
    choices: [
      { id: "q13-s1", category: "stable", label: "MAU 1,000명 + 유료 50명", detail: "PMF 초기 신호 확보" },
      { id: "q13-s2", category: "stable", label: "월 매출 500만원 안정화", detail: "1인 창업자 생존 가능 라인" },
      { id: "q13-i1", category: "innovative", label: "시드 투자 5억 유치", detail: "VC 검증을 통한 성장 가속" },
      { id: "q13-i2", category: "innovative", label: "리포트 1만건 누적", detail: "데이터 자산 형성, 다음 단계 BM 가능" },
      { id: "q13-n1", category: "niche", label: "5개 액셀러레이터와 파트너십", detail: "B2B2C 모델 검증" },
      { id: "q13-n2", category: "niche", label: "글로벌 1개 지역(예: 일본) 베타 출시", detail: "확장성 검증" },
    ],
  },
  {
    id: "q14-pricing",
    step: 2,
    category: "pricing",
    sectionTitle: "가격 정책",
    prompt: "유료 플랜의 월 구독료를 얼마로 책정할까요?",
    choices: [
      { id: "q14-s1", category: "stable", label: "월 9,900원", detail: "넷플릭스 라이트 수준, 진입 부담 최소" },
      { id: "q14-s2", category: "stable", label: "월 19,000원", detail: "ChatGPT Plus와 비슷한 가격대" },
      { id: "q14-i1", category: "innovative", label: "월 49,000원 프리미엄", detail: "프로 컨설팅 가치를 강조, 진지한 사용자만" },
      { id: "q14-i2", category: "innovative", label: "Pay-What-You-Want", detail: "사용자가 결정, 화제성과 데이터 동시 확보" },
      { id: "q14-n1", category: "niche", label: "연간 9.9만원 (월환산 8,250원)", detail: "락인 강화, 캐시 플로우 유리" },
      { id: "q14-n2", category: "niche", label: "리포트당 단건 4,900원", detail: "구독 거부감 있는 층 흡수" },
    ],
  },
  {
    id: "q15-team",
    step: 2,
    category: "team",
    sectionTitle: "초기 팀 구성",
    prompt: "출시 시점에 필요한 최소 팀 구성은?",
    choices: [
      { id: "q15-s1", category: "stable", label: "기획자 1 + 개발자 1 (2인)", detail: "린한 시작, 외주로 부족 보완" },
      { id: "q15-s2", category: "stable", label: "1인 풀스택 창업자 + 외주", detail: "현금 효율 최대, 의사결정 빠름" },
      { id: "q15-i1", category: "innovative", label: "AI 에이전트 + 1인 운영자", detail: "Cursor, Claude Code 활용, 진짜 1인기업" },
      { id: "q15-i2", category: "innovative", label: "기획 1 + 개발 1 + AI 엔지니어 1 (3인)", detail: "prompt engineering 전담자 확보" },
      { id: "q15-n1", category: "niche", label: "공동창업자 2인 + 디자이너 1", detail: "UX 차별화에 더 비중" },
      { id: "q15-n2", category: "niche", label: "1인 + 도메인 자문가 (월 100만원)", detail: "사업 코치 영입으로 신뢰도 확보" },
    ],
  },
  {
    id: "q16-nextAction",
    step: 2,
    category: "nextAction",
    sectionTitle: "이번 주 다음 액션",
    prompt: "이 기획안을 받은 직후, 가장 먼저 할 1가지 액션은?",
    choices: [
      { id: "q16-s1", category: "stable", label: "잠재 고객 10명 인터뷰", detail: "타겟 가설 검증, 3-5일 소요" },
      { id: "q16-s2", category: "stable", label: "랜딩 페이지 만들고 사전 신청 받기", detail: "수요 검증의 가장 빠른 방법" },
      { id: "q16-i1", category: "innovative", label: "프로토타입 1주일 안에 만들기", detail: "no-code 툴로 빠른 데모" },
      { id: "q16-i2", category: "innovative", label: "트위터/링크드인에 빌드 인 퍼블릭 시작", detail: "공개 빌딩으로 초기 팬 확보" },
      { id: "q16-n1", category: "niche", label: "잠재 공동창업자 미팅 3건", detail: "팀 구성이 가장 큰 변수" },
      { id: "q16-n2", category: "niche", label: "유사 서비스 5개 가입 후 분석", detail: "차별점 가설을 데이터로 보강" },
    ],
  },
];

/**
 * Replace {seed} placeholder with shortened seed text.
 * Used for question prompts (which still ship static text with {seed} tokens).
 */
export function applySeed(text: string, seed: string): string {
  const short =
    seed.length > 14 ? seed.slice(0, 14).trim().replace(/[.,!?]$/, "") + "…" : seed;
  return text.replace(/\{seed\}/g, short);
}
