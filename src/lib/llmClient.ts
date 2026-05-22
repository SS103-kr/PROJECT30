"use client";

import type { Answer, Choice } from "./types";
import type { DynamicReport } from "./store";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data?.error ?? "";
    } catch {
      detail = await res.text();
    }
    throw new Error(detail || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function fetchFollowup(seed: string) {
  return postJson<{ needFollowup: boolean; question: string }>(
    "/api/followup",
    { seed }
  );
}

export async function fetchStep1Choices(args: {
  seed: string;
  followupAnswer: string;
}) {
  return postJson<{ choices: Record<string, Choice[]> }>(
    "/api/choices/step1",
    args
  );
}

export async function fetchStep2Choices(args: {
  seed: string;
  followupAnswer: string;
  answers: Record<string, Answer>;
}) {
  return postJson<{ choices: Record<string, Choice[]> }>(
    "/api/choices/step2",
    args
  );
}

export async function fetchReport(args: {
  seed: string;
  followupAnswer: string;
  answers: Record<string, Answer>;
  score: number;
}) {
  return postJson<DynamicReport>("/api/report", args);
}
