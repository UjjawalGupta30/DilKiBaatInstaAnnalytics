import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const allowedStatuses = new Set(["idea", "draft", "needs_review", "approved", "scheduled", "rejected"]);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Database not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};

  if (typeof body.topic === "string") updates.topic = body.topic.trim();
  if (typeof body.hook === "string") updates.hook = body.hook.trim();
  if (typeof body.caption === "string") updates.caption = body.caption.trim();
  if (Array.isArray(body.hashtags)) updates.hashtags = body.hashtags.filter((v: unknown) => typeof v === "string");
  if (typeof body.timestamp_lines === "object" && Array.isArray(body.timestamp_lines)) {
    updates.timestamp_lines = body.timestamp_lines;
  }

  if (typeof body.status === "string") {
    if (!allowedStatuses.has(body.status)) {
      return NextResponse.json({ ok: false, message: "Invalid status" }, { status: 400 });
    }
    updates.status = body.status;

    if (body.status === "approved") {
      updates.approved_at = new Date().toISOString();
      updates.approved_by = "dashboard";
    }
    if (body.status === "rejected") {
      updates.approved_at = null;
      updates.approved_by = null;
    }
  }

  if (body.scheduled_at === null || typeof body.scheduled_at === "string") {
    updates.scheduled_at = body.scheduled_at;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: false, message: "No changes supplied" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("content_items")
    .update(updates)
    .eq("id", params.id)
    .select("id,slug,topic,hook,caption,hashtags,timestamp_lines,status,scheduled_at,approved_at,approved_by,asset_url")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }

  if (typeof body.status === "string" && ["approved", "rejected"].includes(body.status)) {
    const action = body.status === "approved" ? "approved" : "rejected";
    await supabase.from("approvals").insert({
      content_item_id: params.id,
      action,
      reviewer: "dashboard",
      notes: typeof body.notes === "string" ? body.notes : null,
    });
  }

  return NextResponse.json({ ok: true, item: data });
}
