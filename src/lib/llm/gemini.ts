import "server-only";
import { API_KEY, TEXT_MODEL, GROUNDING_MODEL } from "./config";

const endpoint = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

interface CallTextArgs {
  systemInstruction: string;
  userPrompt: string;
  schema: object;
  temperature?: number;
}

export async function callText<T>(args: CallTextArgs): Promise<T> {
  const res = await fetch(endpoint(TEXT_MODEL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: args.systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: args.userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: args.schema,
        temperature: args.temperature ?? 0.9,
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini text call ${res.status}: ${body.slice(0, 300)}`);
  }

  const json = await res.json();
  const text: string | undefined =
    json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned empty content");

  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error(
      `Gemini returned non-JSON text: ${text.slice(0, 200)} (${(e as Error).message})`
    );
  }
}

interface CallGroundedArgs {
  systemInstruction: string;
  userPrompt: string;
  temperature?: number;
}

export async function callGrounded(args: CallGroundedArgs): Promise<string> {
  const res = await fetch(endpoint(GROUNDING_MODEL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: args.systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: args.userPrompt }] }],
      tools: [{ googleSearch: {} }],
      generationConfig: { temperature: args.temperature ?? 0.6 },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Gemini grounded call ${res.status}: ${body.slice(0, 300)}`
    );
  }

  const json = await res.json();
  const parts: { text?: string }[] = json.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text ?? "").join("\n").trim();
}
