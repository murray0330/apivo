import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/clients";

const VAPI_CHAT_URL = "https://api.vapi.ai/chat";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const userMessage = body?.userMessage;
  const previousChatId = body?.previousChatId;
  const widgetId = body?.widgetId;

  if (!widgetId || typeof widgetId !== "string") {
    return NextResponse.json(
      { error: "widgetId is required" },
      { status: 400, headers: corsHeaders() }
    );
  }

  const client = getClient(widgetId);
  if (!client) {
    return NextResponse.json(
      { error: "Unknown widget ID" },
      { status: 404, headers: corsHeaders() }
    );
  }

  if (!userMessage || typeof userMessage !== "string" || !userMessage.trim()) {
    return NextResponse.json(
      { error: "userMessage is required" },
      { status: 400, headers: corsHeaders() }
    );
  }

  const payload: Record<string, unknown> = {
    assistantId: client.assistantId,
    input: [{ role: "user", content: userMessage.trim() }],
  };

  if (previousChatId && typeof previousChatId === "string") {
    payload.previousChatId = previousChatId;
  }

  let vapiRes: Response;
  try {
    vapiRes = await fetch(VAPI_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach Vapi API" },
      { status: 502, headers: corsHeaders() }
    );
  }

  if (!vapiRes.ok) {
    const details = await vapiRes.text().catch(() => "");
    return NextResponse.json(
      { error: "Vapi API error", details },
      { status: vapiRes.status, headers: corsHeaders() }
    );
  }

  const data = await vapiRes.json();

  const assistantMsgs = (data.output ?? data.messages ?? []).filter(
    (m: { role: string; content?: string }) =>
      m.role === "assistant" && m.content && m.content.trim()
  );

  const reply = assistantMsgs.length
    ? assistantMsgs[assistantMsgs.length - 1].content
    : "I'm sorry, I couldn't process that request. Please try again.";

  return NextResponse.json(
    { reply, chatId: data.id ?? null },
    { headers: corsHeaders() }
  );
}
