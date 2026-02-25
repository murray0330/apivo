import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/clients";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  const widgetId = req.nextUrl.searchParams.get("widgetId");

  if (!widgetId) {
    return NextResponse.json(
      { error: "widgetId query parameter is required" },
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

  // Return only public-facing config (never expose assistantId)
  return NextResponse.json(
    {
      businessName: client.businessName,
      greeting: client.greeting,
      quickReplies: client.quickReplies,
      primaryColor: client.primaryColor,
    },
    { headers: corsHeaders() }
  );
}
