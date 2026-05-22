import { NextResponse } from "next/server";
import { callGrounded, callText } from "@/lib/llm/gemini";
import {
  groundingSystem,
  groundingUser,
  reportSystem,
  reportUser,
} from "@/lib/llm/prompts";
import { reportSchema } from "@/lib/llm/schema";
import { QUESTIONS } from "@/lib/mockData";
import type { Answer } from "@/lib/types";

interface ReportResponse {
  pitch: string;
  sections: {
    title: string;
    emoji: string;
    items: { label: string; value: string; isTodo: boolean }[];
  }[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      seed?: string;
      followupAnswer?: string;
      answers?: Record<string, Answer>;
      score?: number;
    };
    const seed = (body.seed ?? "").trim();
    const followupAnswer = (body.followupAnswer ?? "").trim();
    const answers = body.answers ?? {};
    const score = body.score;

    if (!seed) {
      return NextResponse.json({ error: "seed is required" }, { status: 400 });
    }

    let groundingNotes = "";
    try {
      groundingNotes = await callGrounded({
        systemInstruction: groundingSystem,
        userPrompt: groundingUser({
          seed,
          followupAnswer,
          answers,
          questions: QUESTIONS,
        }),
      });
    } catch {
      // 그라운딩 실패해도 리포트는 진행 — 본문 합성에서 보유 지식으로 보강
      groundingNotes = "";
    }

    const result = await callText<ReportResponse>({
      systemInstruction: reportSystem,
      userPrompt: reportUser({
        seed,
        followupAnswer,
        answers,
        questions: QUESTIONS,
        groundingNotes,
        score,
      }),
      schema: reportSchema,
      temperature: 0.7,
    });

    return NextResponse.json(result);
  } catch (e) {
    const msg = (e as Error).message ?? "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
