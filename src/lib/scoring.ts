import type { Answer } from "./types";
import { QUESTIONS } from "./mockData";

const CORE_CATEGORIES = [
  "target",
  "problem",
  "solution",
  "value",
  "bm",
  "channel",
];

/**
 * Mock 'feasibility score' — combines progress, coverage, todo ratio, balance.
 * Output: 0–100 integer.
 */
export function calculateScore(answers: Record<string, Answer>): number {
  const total = QUESTIONS.length;
  const answered = Object.values(answers).filter((a) => !a.isTodo);
  const todos = Object.values(answers).filter((a) => a.isTodo);

  // 1) progress: % of answered (non-todo)
  const progress = answered.length / total;

  // 2) core category coverage: how many of the 6 critical categories are answered
  const coveredCategories = new Set<string>();
  for (const a of answered) {
    const q = QUESTIONS.find((q) => q.id === a.questionId);
    if (q && CORE_CATEGORIES.includes(q.category)) {
      coveredCategories.add(q.category);
    }
  }
  const coverage = coveredCategories.size / CORE_CATEGORIES.length;

  // 3) todo penalty
  const todoRatio = todos.length / Math.max(1, answered.length + todos.length);
  const todoBonus = 1 - todoRatio;

  // 4) balance: not all stable, not all innovative, not all niche
  const counts = { stable: 0, innovative: 0, niche: 0, custom: 0 };
  for (const a of answered) {
    if (a.category && a.category in counts) {
      counts[a.category as keyof typeof counts] += 1;
    }
  }
  const usedTypes = (["stable", "innovative", "niche"] as const).filter(
    (c) => counts[c] > 0
  ).length;
  const balance = usedTypes === 0 ? 0 : usedTypes / 3;

  const raw =
    progress * 40 + coverage * 30 + todoBonus * 20 + balance * 10;

  return Math.round(Math.max(0, Math.min(100, raw)));
}

export function scoreColor(score: number): string {
  if (score < 30) return "#ef4444"; // red
  if (score < 55) return "#f59e0b"; // amber
  if (score < 75) return "#3b82f6"; // blue
  return "#10b981"; // green
}

export function scoreLabel(score: number): string {
  if (score < 30) return "구체화 시작 단계";
  if (score < 55) return "골격 완성 중";
  if (score < 75) return "실행 가능한 수준";
  return "투자 피칭 준비 완료";
}
