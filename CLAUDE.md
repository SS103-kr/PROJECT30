# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트

**ThinkPick (씽크픽)** — "막연한 아이디어 → 1~2페이지 사업계획서" 서비스의 한국어 MVP 프로토타입. 제품 스펙은 루트의 `3. PRD2.md` 참조.

현재 상태: **Gemini API 연결됨**. 선택지·꼬리질문·리포트는 모두 Gemini가 실시간 생성. `src/lib/mockData.ts`의 정적 `QUESTIONS` 배열은 이제 **질문 prompt/카테고리 스켈레톤 only** — 각 질문의 `choices` 필드는 LLM이 매번 새로 만들어내므로 런타임에서 무시된다(참조용 정적 데이터로 남아 있음).

## 명령어

```bash
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드 + 타입 체크 (CI 게이트)
npm run start    # 빌드 결과 서빙
npm run lint     # next lint
```

테스트 스위트 없음. `npm run build`가 타입/정확성 검증 수단 — `tsconfig.json`이 `"strict": true`로 동작하므로 타입 에러가 있으면 번들 사이즈 출력 전에 빌드가 실패함.

**⚠️ Dev 서버가 떠 있는 동안에는 `npm run build`를 실행하지 말 것.** `.next` 폴더의 청크 파일을 덮어써서 dev 서버가 `MODULE_NOT_FOUND` 500 에러를 뱉음. 빌드가 필요하면 dev 서버를 먼저 멈추거나, 빌드 후 `.next` 삭제 + dev 재시작.

## 아키텍처

### 4단계 사용자 흐름

```
/             →  /onboard          →  /plan                       →  /report
랜딩             시드 입력 +           16개 질문 × 7지선다             8섹션 LLM 리포트
+ CTA            LLM 꼬리질문(옵션)   (Step 1: 6 → Step 2: 10)        + 페이월
```

각 라우트는 `src/app/` 아래 단일 `page.tsx` 파일. Zustand 스토어로 흐름을 게이트함 — `seed`가 비어있으면 `/plan`과 `/report`는 `/onboard`로 리다이렉트.

### LLM 레이어 (서버 사이드, **API key 보호**)

핵심 원칙: **API key와 모델 식별자는 서버 라우트에서만 import**. `src/lib/llm/*`의 모든 파일은 `import "server-only"` 가드로 시작 — 실수로 클라이언트 컴포넌트가 import하면 빌드 에러로 잡힘. 클라이언트는 오직 `/api/*` 엔드포인트만 호출.

- `src/lib/llm/config.ts` — `API_KEY` · `TEXT_MODEL` ("gemini-3.1-flash-lite") · `GROUNDING_MODEL` ("gemini-2.5-flash-lite"). **하드코딩** (env 안 씀, 프로토타입 정책).
- `src/lib/llm/gemini.ts` — `fetch` 기반 Gemini REST 래퍼. 외부 SDK 미설치. `callText<T>()`는 `responseSchema` + `responseMimeType: "application/json"`으로 구조화 출력, `callGrounded()`는 `tools: [{googleSearch: {}}]`로 그라운딩 (그라운딩과 responseSchema는 동시 사용 불가 — 그라운딩은 자유 텍스트 반환).
- `src/lib/llm/prompts.ts` — 한국어 system/user 프롬프트 템플릿. 선택지 생성 프롬프트는 2-2-2 split(stable/innovative/niche)을 명시적으로 강제하고 "seed 키워드를 절반 이상의 선택지에 녹여라"라는 인상 만들기 지시 포함.
- `src/lib/llm/schema.ts` — Gemini OpenAPI 3.0 subset 스키마. 응답 모양을 바꾸려면 여기와 클라이언트 타입 양쪽을 같이 수정.
- `src/app/api/followup/route.ts`, `src/app/api/choices/{step1,step2}/route.ts`, `src/app/api/report/route.ts` — 4개 POST 핸들러. 모두 `try/catch`로 감싸 500 + `{error: string}` JSON 반환.
- `src/lib/llmClient.ts` — 클라이언트 측 `/api/*` fetch 래퍼. `"use client"`. 4xx/5xx 시 `error` 필드를 throw.

`/api/report`는 **2-call** 패턴: 먼저 GROUNDING_MODEL로 시장 그라운딩 노트(경쟁사·트렌드·리스크)를 생성하고, 그 텍스트를 TEXT_MODEL 호출의 user prompt에 끼워 넣어 최종 JSON 리포트를 합성. 그라운딩 호출이 실패해도 두 번째 호출은 진행됨 (보유 지식으로 보강).

### 상태 관리 (`src/lib/store.ts`)

`persist` 미들웨어가 붙은 Zustand 스토어 1개 → `localStorage["thinkpick-store"]`에 저장. 보관 필드:

- 사용자 입력: `seed`, `followupAnswer`, `answers` (questionId가 키), `currentIndex`, `hasSeenWowMoment`
- **LLM 캐시**: `dynamicChoices` (questionId → Choice[6] 맵), `dynamicFollowupQuestion`, `dynamicReport` ({pitch, sections[]})

`answerQuestion` 액션은 답변이 바뀔 때 `dynamicReport`를 `null`로 무효화 — 사용자가 `/plan`으로 돌아가 답을 수정하면 `/report` 재진입 시 LLM이 다시 호출됨. 새로고침 시에는 모든 캐시(`dynamicChoices` 포함)가 persist에서 복원되므로 LLM 재호출 없음.

Next.js 하이드레이션 미스매치 함정 때문에 `/plan`과 `/report`는 `mounted` boolean으로 하이드레이션 이후에 렌더링을 지연시킴. 영속 상태를 읽는 새 페이지를 만들 땐 같은 패턴을 따를 것.

### 선택지 prefetch 타이밍 (`/plan` 핵심 UX)

`/plan/page.tsx`는 두 단계 사전 로딩으로 대기 시간을 숨김:

1. **Step 1 prefetch**: `mounted && seed && !hasStep1Choices`면 즉시 `/api/choices/step1` 호출. 전체 화면 로딩(~5초) 후 q1 노출.
2. **Step 2 prefetch**: `currentIndex >= STEP1_COUNT - 1` (= 사용자가 q6 진입)부터 백그라운드로 `/api/choices/step2` 호출 시작. 사용자가 q6에 답하고 와우 모달을 보는 동안 응답이 도착해서 q7 진입 시 즉시 노출됨. 만약 도착 전이면 q7 진입 시 블로킹 로딩 화면.

실패 시 mockData로 폴백하지 않는다 — 명시적 에러 카드 + "다시 시도" 버튼. 이 정책을 바꾸려면 사용자 합의 필요.

### 점수 계산 (`src/lib/scoring.ts`)

`calculateScore(answers)` — "실현가능성 점수" (0~100) 산출. 가중치 휴리스틱이지 진짜 평가가 아님:

```
진행률(40) + 카테고리 커버리지(30) + (1 - To-Do 비율)(20) + 카테고리 균형(10)
```

Step 1 완료 시 25~35%, Step 2 완료 시 55~70%대로 떨어지게 튜닝됨 — 이 간극은 의도된 UX. 현재 잠겨 있는 Step 3(유료) 구간으로 유저를 끌어당기는 도파민 후크.

### 리포트 렌더링 (`src/lib/reportBuilder.ts`)

- 화면 렌더는 `dynamicReport`(LLM 결과)를 그대로 `ReportView`에 넘김. `reportBuilder`는 **MD 다운로드 전용**.
- `buildMarkdown(args, opts)` — 두 가지 모드:
  - `step1Only: true` (와우 모달의 1p 다운로드): LLM 결과 사용 안 함. 사용자가 고른 raw answer 텍스트를 `QUESTIONS` 카테고리 → `SECTION_MAP`으로 매핑해 즉석 합성. 와우 모먼트의 즉시성을 깨지 않기 위함.
  - `dynamicReport` 제공 (전체 리포트 다운로드): LLM이 합성한 8섹션을 MD로 직렬화.
- `SECTION_MAP`은 LLM 프롬프트(`prompts.ts`의 `reportSystem`)와 **수동으로 동기화**된 상태. 8섹션의 순서/제목/이모지/카테고리 매핑을 바꾸려면 양쪽을 같이 수정.
- `makeFilename(seed, step1Only)` — `{시드 슬러그}-기획안-{1p|2p}.md`. 윈도우 금지 문자 제거 + 30자 컷.

### 다운로드 트리거 (`src/lib/download.ts`)

`downloadTextFile(filename, content, mime?)` — Blob → object URL → 숨겨진 anchor click → URL 해제. 클라이언트 핸들러에서만 호출 가능(DOM 사용).

### MD 다운로드 진입점

- **와우 모먼트 모달** (Step 1 6번째 질문 직후) — "⬇️ 1p 미니 기획안 MD로 다운로드". `step1Only: true`. LLM 호출 없이 즉시.
- **`/report` 페이지 헤더** — "⬇️ MD 다운로드". `dynamicReport`(이미 fetch 완료)를 인자로 넘김.

### 컴포넌트 계층

- `src/components/QuestionCard.tsx` — 가장 자주 보이는 화면. `question` + `choices`(LLM 생성, 부모가 store에서 꺼내 prop으로 주입) + "직접 입력" / "나중에 결정 (To-Do로 적립)" 액션.
- `FeasibilityScore` / `ProgressBar` / `StructureMap` / `TodoSidebar` — 순수 프레젠테이션. 전부 `answers`와 `currentIndex`에서 파생.
- 모달들(`WowMomentModal`, `PaywallModal`, `CustomInputModal`) — open/close props로 제어. 전역 상태 없음. `WowMomentModal`은 부모(`/plan`)에서 `onDownloadMd` 콜백을 주입받는 식으로 다운로드 처리.

## 컨벤션

- **클라이언트 vs 서버 분리**: 페이지/컴포넌트는 전부 `"use client"`. LLM 호출 코드(`src/lib/llm/*`)는 `import "server-only"`로 가드된 서버 전용 모듈. 클라이언트가 LLM 모듈을 import하면 빌드 시 에러. 새 LLM 기능을 추가할 땐 API 라우트를 새로 만들거나 기존 라우트를 확장하는 방식만 사용.
- **경로 alias `@/*` → `src/*`** (`tsconfig.json`에서 설정). 내부 import는 항상 이걸 사용.
- **Tailwind만 사용.** CSS 모듈/styled-components 안 씀. 커스텀 브랜드 컬러: `brand-{50,100,500,600,700}` (`tailwind.config.ts` 참고). 카테고리 색상은 고정: 안정형=blue, 혁신형=purple, 니치형=emerald.
- **인쇄 CSS**: `/report` PDF 출력 시 숨길 UI는 `no-print` 클래스 (`globals.css`에 정의).
- **한국어 카피가 제품의 핵심.** PRD는 선택지 텍스트를 데모의 와우 포인트로 다룸. LLM 프롬프트(`src/lib/llm/prompts.ts`)는 2-2-2 split(안정형=지루하지만 현실적, 혁신형=파괴적, 니치형=좁고 깊음)을 강하게 지시한다 — 프롬프트를 손볼 때 이 톤이 무너지지 않게 할 것.
- **`mockData.ts`의 `QUESTIONS`**: 각 질문의 `id`/`step`/`category`/`sectionTitle`/`prompt`/`helper`는 LLM에 컨텍스트로 들어가는 스켈레톤이라 살아있음. `choices` 필드는 무시되지만 타입 호환성 때문에 남아있음 — 손대지 말 것. 7번째 "직접 입력"은 UI에서 자동 추가됨, 데이터에 7번째 선택지를 넣지 말 것.

## 범위 밖 (의도적, 사전 합의 없이 추가 금지)

- 회원가입 / 인증
- 결제 연동 (페이월은 UI만 있음)
- Step 3 (30개 심층 질문 흐름) — 현재 페이월 뒤
- 다국어 — 한국어 only
- LLM API key를 env로 옮기는 것 — 프로토타입 정책상 서버 라우트 안 하드코딩 (서버 사이드에만 존재하므로 브라우저 노출은 없음)
