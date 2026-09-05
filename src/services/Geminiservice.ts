import { categories } from "../data/categories";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export interface DiagnosisResult {
  category: string | null;
  reply: string;
}

const CATEGORY_LABELS = categories.map((c) => c.label);

const SYSTEM_INSTRUCTION = `You are the diagnosis assistant for SkillNear, a service marketplace that
matches home-repair problems in Ibadan, Nigeria to the right local technician.

A customer will describe a problem in their own words. Your job:
1. Work out which single trade category best fits the problem, from this exact list: ${CATEGORY_LABELS.join(", ")}.
   If nothing fits, use null.
2. Write a short (1-2 sentence), warm, plain-language reply confirming what you understood and naming the trade,
   the way you'd explain it to a neighbour. Do not mention specific providers, prices, or availability \u2014
   the app attaches real provider matches separately.`;

/**
 * Calls the Gemini API to classify a free-text problem description into a
 * SkillNear service category, with a short natural-language reply.
 * Throws if the API key is missing or the request fails \u2014 callers should
 * catch and fall back to the local keyword matcher.
 */
export async function diagnoseProblem(text: string): Promise<DiagnosisResult> {
  if (!API_KEY) {
    throw new Error(
      "Missing VITE_GEMINI_API_KEY. Add it to a .env file at your project root."
    );
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ parts: [{ text }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: [...CATEGORY_LABELS, "null"],
            },
            reply: { type: "string" },
          },
          required: ["category", "reply"],
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: { category: string | null; reply: string };
  try {
    parsed = JSON.parse(raw) as { category: string | null; reply: string };
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }

  if (typeof parsed.reply !== "string" || !parsed.reply.trim()) {
    throw new Error("Gemini returned an invalid diagnosis.");
  }

  return {
    category: parsed.category === "null" ? null : parsed.category,
    reply: parsed.reply,
  };
}

export function hasGeminiKey(): boolean {
  return Boolean(API_KEY);
}