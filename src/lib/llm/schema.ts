import "server-only";

/**
 * Gemini structured output schemas (OpenAPI 3.0 subset).
 * Reference: https://ai.google.dev/api/generate-content#schema
 */

export const followupSchema = {
  type: "object",
  properties: {
    needFollowup: {
      type: "boolean",
      description:
        "true if the seed is too short/vague and a follow-up question is needed",
    },
    question: {
      type: "string",
      description:
        "A single short Korean follow-up question (under 40 chars). Empty string when needFollowup is false.",
    },
  },
  required: ["needFollowup", "question"],
};

export const choicesSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      description:
        "One entry per input question, in the same order as provided.",
      items: {
        type: "object",
        properties: {
          questionId: { type: "string" },
          choices: {
            type: "array",
            minItems: 6,
            maxItems: 6,
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description:
                    "Format: {questionId}-s1 | -s2 | -i1 | -i2 | -n1 | -n2",
                },
                category: {
                  type: "string",
                  enum: ["stable", "innovative", "niche"],
                },
                label: {
                  type: "string",
                  description: "Korean, 8~20 chars",
                },
                detail: {
                  type: "string",
                  description: "Korean, one sentence, 30~60 chars",
                },
              },
              required: ["id", "category", "label", "detail"],
            },
          },
        },
        required: ["questionId", "choices"],
      },
    },
  },
  required: ["questions"],
};

export const reportSchema = {
  type: "object",
  properties: {
    pitch: {
      type: "string",
      description: "Korean elevator pitch, one sentence, under 80 chars",
    },
    sections: {
      type: "array",
      minItems: 8,
      maxItems: 8,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          emoji: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "string", description: "Korean, 1~2 sentences" },
                isTodo: { type: "boolean" },
              },
              required: ["label", "value", "isTodo"],
            },
          },
        },
        required: ["title", "emoji", "items"],
      },
    },
  },
  required: ["pitch", "sections"],
};
