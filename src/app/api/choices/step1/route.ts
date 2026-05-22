import { NextResponse } from "next/server";
import { callText } from "@/lib/llm/gemini";
import { choicesSystem, choicesUser } from "@/lib/llm/prompts";
import { choicesSchema } from "@/lib/llm/schema";
import { QUESTIONS } from "@/lib/mockData";
import type { Choice } from "@/lib/types";

interface ChoicesResponse {
  questions: { questionId: string; choices: Choice[] }[];
}

export async function POST(req: Request) {
  try {
    const { seed, followupAnswer } = (await req.json()) as {
      seed?: string;
      followupAnswer?: string;
    };
    if (!seed || !seed.trim()) {
      return NextResponse.json({ error: "seed is required" }, { status: 400 });
    }

    const step1Questions = QUESTIONS.filter((q) => q.step === 1).map((q) => ({
      id: q.id,
      prompt: q.prompt,
      sectionTitle: q.sectionTitle,
    }));

    const result = await callText<ChoicesResponse>({
      systemInstruction: choicesSystem,
      userPrompt: choicesUser({
        seed: seed.trim(),
        followupAnswer: (followupAnswer ?? "").trim(),
        questions: step1Questions,
      }),
      schema: choicesSchema,
      temperature: 0.95,
    });

    const map: Record<string, Choice[]> = {};
    for (const q of result.questions) {
      map[q.questionId] = q.choices;
    }
    return NextResponse.json({ choices: map });
  } catch (e) {
    const msg = (e as Error).message ?? "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
