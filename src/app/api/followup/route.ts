import { NextResponse } from "next/server";
import { callText } from "@/lib/llm/gemini";
import { followupSystem, followupUser } from "@/lib/llm/prompts";
import { followupSchema } from "@/lib/llm/schema";

interface FollowupResponse {
  needFollowup: boolean;
  question: string;
}

export async function POST(req: Request) {
  try {
    const { seed } = (await req.json()) as { seed?: string };
    if (!seed || !seed.trim()) {
      return NextResponse.json({ error: "seed is required" }, { status: 400 });
    }

    const result = await callText<FollowupResponse>({
      systemInstruction: followupSystem,
      userPrompt: followupUser(seed.trim()),
      schema: followupSchema,
      temperature: 0.7,
    });

    return NextResponse.json(result);
  } catch (e) {
    const msg = (e as Error).message ?? "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
