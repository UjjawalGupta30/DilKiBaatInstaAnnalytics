import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getIntegrationStatuses } from "@/lib/integrations/status";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabaseServerClient();
  const integrations = getIntegrationStatuses();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        database: "not_configured",
        integrations,
        message: "SUPABASE_URL and SUPABASE_SECRET_KEY (or legacy service role key) are missing",
      },
      { status: 503 },
    );
  }

  const { count, error } = await supabase
    .from("content_items")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json(
      { ok: false, database: "error", integrations, message: error.message },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    database: "connected",
    content_items: count ?? 0,
    integrations,
  });
}
