"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Answer, Choice } from "./types";

export interface DynamicReportItem {
  label: string;
  value: string;
  isTodo: boolean;
}

export interface DynamicReportSection {
  title: string;
  emoji: string;
  items: DynamicReportItem[];
}

export interface DynamicReport {
  pitch: string;
  sections: DynamicReportSection[];
}

interface ThinkPickState {
  seed: string;
  followupAnswer: string;
  answers: Record<string, Answer>;
  currentIndex: number;
  hasSeenWowMoment: boolean;

  dynamicChoices: Record<string, Choice[]>;
  dynamicFollowupQuestion: string;
  dynamicReport: DynamicReport | null;

  setSeed: (seed: string) => void;
  setFollowupAnswer: (text: string) => void;
  setDynamicFollowupQuestion: (q: string) => void;
  answerQuestion: (a: Answer) => void;
  goNext: () => void;
  goPrev: () => void;
  jumpTo: (i: number) => void;
  markWowSeen: () => void;
  mergeDynamicChoices: (next: Record<string, Choice[]>) => void;
  clearDynamicChoices: () => void;
  setDynamicReport: (r: DynamicReport | null) => void;
  reset: () => void;
}

const initial = {
  seed: "",
  followupAnswer: "",
  answers: {} as Record<string, Answer>,
  currentIndex: 0,
  hasSeenWowMoment: false,
  dynamicChoices: {} as Record<string, Choice[]>,
  dynamicFollowupQuestion: "",
  dynamicReport: null as DynamicReport | null,
};

export const useStore = create<ThinkPickState>()(
  persist(
    (set) => ({
      ...initial,

      setSeed: (seed) => set({ seed }),
      setFollowupAnswer: (followupAnswer) => set({ followupAnswer }),
      setDynamicFollowupQuestion: (dynamicFollowupQuestion) =>
        set({ dynamicFollowupQuestion }),

      answerQuestion: (a) =>
        set((s) => ({
          answers: { ...s.answers, [a.questionId]: a },
          dynamicReport: null, // invalidate cached report when answers change
        })),

      goNext: () => set((s) => ({ currentIndex: s.currentIndex + 1 })),
      goPrev: () => set((s) => ({ currentIndex: Math.max(0, s.currentIndex - 1) })),
      jumpTo: (i) => set({ currentIndex: i }),
      markWowSeen: () => set({ hasSeenWowMoment: true }),

      mergeDynamicChoices: (next) =>
        set((s) => ({ dynamicChoices: { ...s.dynamicChoices, ...next } })),
      clearDynamicChoices: () => set({ dynamicChoices: {} }),
      setDynamicReport: (dynamicReport) => set({ dynamicReport }),

      reset: () => set({ ...initial }),
    }),
    {
      name: "thinkpick-store",
    }
  )
);
