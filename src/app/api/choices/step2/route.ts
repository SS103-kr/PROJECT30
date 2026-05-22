import { NextResponse } from "next/server";
import { callText } from "@/lib/llm/gemini";
import { choicesSystem, choicesUser } from "@/lib/llm/prompts";
import { choicesSchema } from "@/lib/llm/schema";
import { QUESTIONS } from "@/lib/mockData";
import type { Answer, Choice } from "@/lib/types";

interface ChoicesResponse {
  questions: { questionId: string; choices: Choice[] }[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      seed?: string;
      followupAnswer?: string;
      answers?: Record<string, Answer>;
    };
    const seed = (body.seed ?? "").trim();
    const followupAnswer = (body.followupAnswer ?? "").trim();
    const answers = body.answers ?? {};

    if (!seed) {
      return NextResponse.json({ error: "seed is required" }, { status: 400 });
    }

    const step2Questions = QUESTIONS.filter((q) => q.step === 2).map((q) => ({
      id: q.id,
      prompt: q.prompt,
      sectionTitle: q.sectionTitle,
    }));

    const priorAnswers = QUESTIONS.filter((q) => q.step === 1)
      .map((q) => {
        const a = answers[q.id];
        if (!a || a.isTodo) return null;
        return { sectionTitle: q.sectionTitle, text: a.text };
      })
      .filter((x): x is { sectionTitle: string; text: string } => x !== null);

    const result = await callText<ChoicesResponse>({
      systemInstruction: choicesSystem,
      userPrompt: choicesUser({
        seed,
        followupAnswer,
        questions: step2Questions,
        priorAnswers,
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
