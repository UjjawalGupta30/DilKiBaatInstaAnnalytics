import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const webhookUrl = process.env.N8N_AI_STUDIO_WEBHOOK_URL;
  const sharedSecret = process.env.N8N_SHARED_SECRET;

  if (!webhookUrl || !sharedSecret) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "n8n is not configured. Add N8N_AI_STUDIO_WEBHOOK_URL and N8N_SHARED_SECRET.",
      },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55_000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-dkb-secret": sharedSecret,
      },
      body: JSON.stringify({
        source: "dashboard",
        requested_at: new Date().toISOString(),
        ...(body && typeof body === "object" ? body : {}),
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    const rawText = await response.text();

    let data: unknown = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { raw: rawText };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "n8n workflow failed.",
          n8n_status: response.status,
          n8n_response: data,
          n8n_raw: rawText,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      result: data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown n8n request error";

    return NextResponse.json(
      {
        ok: false,
        message:
          message === "This operation was aborted"
            ? "n8n generation timed out."
            : message,
      },
      { status: 504 },
    );
  } finally {
    clearTimeout(timeout);
  }
}
