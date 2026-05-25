import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

export const runtime = "nodejs";
export const maxDuration = 30;

// Kill switch — paired with the "Coming soon" state on /contact. Keeps the
// route inert (no OpenAI calls, no body parsing) until the assistant is
// re-enabled. Flip to false to restore the live AI route.
const CHAT_DISABLED: boolean = true;

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function POST(req: Request) {
  if (CHAT_DISABLED) {
    return new Response(
      JSON.stringify({ error: "AI chat is temporarily unavailable." }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      "OPENAI_API_KEY is not set on the server.",
      { status: 500 },
    );
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Missing messages.", { status: 400 });
  }

  const result = streamText({
    model: openai(MODEL),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
