import { NextResponse } from "next/server";
import { getAssistantKnowledgeContext } from "@/lib/assistantKnowledge";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const DEFAULT_MODEL = "mistral-small-latest";
const MAX_MESSAGES = 12;

function cleanMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];

  return input
    .filter((message): message is ChatMessage => {
      if (!message || typeof message !== "object") return false;
      const candidate = message as Partial<ChatMessage>;
      return (
        (candidate.role === "user" || candidate.role === "assistant") &&
        typeof candidate.content === "string" &&
        candidate.content.trim().length > 0
      );
    })
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, 1600),
    }));
}

function systemPrompt(lang: string) {
  const language =
    lang === "ar" ? "Arabic" : lang === "en" ? "English" : "French";

  return [
    `You are the UNIVMAR website assistant. Reply in ${language}.`,
    "Use only the UNIVMAR knowledge base below for company, product, stock and project facts.",
    "If a detail is not present, say it is available on request and suggest contacting UNIVMAR.",
    "Never provide prices. For price questions, ask for measurements and suggest contacting UNIVMAR for a quote.",
    "Never invent dimensions, lead times, promotions or stock quantities.",
    "Be concise, helpful and commercial. For quotes, ask for stone type, measurements, city and project photos.",
    "Knowledge base:",
    getAssistantKnowledgeContext(),
  ].join("\n\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Assistant is not configured." },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as {
      messages?: unknown;
      lang?: unknown;
    };
    const messages = cleanMessages(body.messages);

    if (!messages.length) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const lang = typeof body.lang === "string" ? body.lang : "fr";
    const mistralResponse = await fetch(MISTRAL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.MISTRAL_MODEL ?? DEFAULT_MODEL,
        temperature: 0.25,
        max_tokens: 520,
        messages: [
          { role: "system", content: systemPrompt(lang) },
          ...messages,
        ],
      }),
    });

    if (!mistralResponse.ok) {
      const detail = await mistralResponse.text();
      console.error("Mistral assistant error", mistralResponse.status, detail);
      return NextResponse.json(
        { error: "Assistant service is unavailable." },
        { status: 502 },
      );
    }

    const data = await mistralResponse.json();
    const answer = data?.choices?.[0]?.message?.content;

    if (typeof answer !== "string" || !answer.trim()) {
      return NextResponse.json(
        { error: "Assistant returned an empty answer." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer: answer.trim() });
  } catch (error) {
    console.error("Assistant route error", error);
    return NextResponse.json(
      { error: "Assistant request failed." },
      { status: 500 },
    );
  }
}
