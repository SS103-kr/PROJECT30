export type ChoiceCategory = "stable" | "innovative" | "niche";

export type QuestionCategory =
  | "target"
  | "problem"
  | "solution"
  | "value"
  | "bm"
  | "channel"
  | "differentiator"
  | "metric"
  | "mvp"
  | "marketing"
  | "competitor"
  | "risk"
  | "milestone"
  | "pricing"
  | "team"
  | "nextAction";

export interface Choice {
  id: string;
  category: ChoiceCategory;
  label: string;
  detail: string;
}

export interface Question {
  id: string;
  step: 1 | 2;
  category: QuestionCategory;
  sectionTitle: string;
  prompt: string;
  helper?: string;
  choices: Choice[];
}

export interface Answer {
  questionId: string;
  choiceId?: string;
  category?: ChoiceCategory | "custom";
  text: string;
  isTodo?: boolean;
  riskTag?: string;
}

export interface Todo {
  questionId: string;
  questionPrompt: string;
  riskTag?: string;
}
