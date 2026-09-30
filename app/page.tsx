import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getIntegrationStatuses } from "@/lib/integrations/status";
import DraftCard from "@/components/DraftCard";
import GenerateButton from "@/components/GenerateButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ContentItem = {
  id: string;
  slug: string;
  topic: string;
  format: string;
  hook: string | null;
  caption: string | null;
  hashtags: string[] | null;
  timestamp_lines: unknown;
  status: string;
  scheduled_at: string | null;
  created_at: string;
  asset_url: string | null;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
}

export default async function Home() {
  if (!isAdminAuthenticated()) redirect("/login");

  const supabase = getSupabaseServerClient();
  const integration = getIntegrationStatuses();

  let drafts: ContentItem[] = [];
  let reviewCount = 0;
  let queueCount = 0;
  let publishedCount = 0;
  let rejectedCount = 0;
  let trendCount = 0;
  let redditCount = 0;
  let dbError: string | null = null;

  if (supabase) {
    const [draftsResult, reviewResult, queueResult, publishedResult, rejectedResult, trendResult, redditResult] = await Promise.all([
      supabase
        .from("content_items")
        .select("id,slug,topic,format,hook,caption,hashtags,timestamp_lines,status,scheduled_at,created_at,asset_url")
        .order("created_at", { ascending: false })
        .limit(12),
      supabase.from("content_items").select("id", { count: "exact", head: true }).eq("status", "needs_review"),
      supabase.from("content_items").select("id", { count: "exact", head: true }).in("status", ["idea", "draft", "needs_review", "approved", "scheduled", "publishing"]),
      supabase.from("content_items").select("id", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("content_items").select("id", { count: "exact", head: true }).eq("status", "rejected"),
      supabase.from("trend_items").select("id", { count: "exact", head: true }).eq("status", "candidate"),
      supabase.from("reddit_opportunities").select("id", { count: "exact", head: true }).eq("status", "needs_review"),
    ]);

    if (draftsResult.error) dbError = draftsResult.error.message;
    drafts = (draftsResult.data || []) as ContentItem[];
    reviewCount = reviewResult.count ?? 0;
    queueCount = queueResult.count ?? 0;
    publishedCount = publishedResult.count ?? 0;
    rejectedCount = rejectedResult.count ?? 0;
    trendCount = trendResult.count ?? 0;
    redditCount = redditResult.count ?? 0;
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brandmark">dkb</div>
        <div className="brandcopy"><strong>Dil Ki Baat AI</strong><span>Content operating system</span></div>
        <div className="top-actions">
          <a className="secondary small" href="https://app.n8n.cloud" target="_blank" rel="noreferrer">Open n8n ↗</a>
          <form action="/api/auth/logout" method="post"><button className="secondary small" type="submit">Sign out</button></form>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">YOUR CREATIVE COMMAND CENTER</p>
          <h1>Make room for<br /><em>every story.</em></h1>
          <p className="intro">Generate thoughtful content, review every draft, and keep publishing decisions in human hands.</p>
          <div className="actions">
            <div className="actions">
              <GenerateButton />

              <a
                className="secondary"
                href="/api/health"
                target="_blank"
                rel="noreferrer"
              >
                System health
              </a>
            </div>
          </div>
        </div>
        <div className="hero-note">
          <span className="spark">✳</span>
          <p>Today’s creative principle</p>
          <strong>Make it feel like a message someone needed to hear.</strong>
          <small>Simple · warm · human · non-judgmental</small>
        </div>
      </section>

      <section className="stats">
        <article className="stat"><span>Needs review</span><strong>{reviewCount}</strong><small>Waiting for your decision</small></article>
        <article className="stat"><span>Content queue</span><strong>{queueCount}</strong><small>Active pipeline items</small></article>
        <article className="stat"><span>Published</span><strong>{publishedCount}</strong><small>Stored publishing history</small></article>
        <article className="stat"><span>Instagram</span><strong>{integration.instagram.configured ? "Ready" : "Pending"}</strong><small>{integration.instagram.detail}</small></article>
      </section>

      {!supabase || dbError ? (
        <section className="panel alert-panel">
          <p className="eyebrow">DATABASE</p>
          <h3>Database connection needs attention</h3>
          <p className="muted">{dbError || "Add SUPABASE_URL and SUPABASE_SECRET_KEY to Vercel and redeploy."}</p>
        </section>
      ) : null}

      <section className="sectionhead">
        <div><p className="eyebrow">WORKSPACE</p><h2>Content pipeline</h2></div>
        <span className="muted">{reviewCount} waiting for approval</span>
      </section>

      {drafts.length === 0 ? (
        <section className="panel"><h3>No content yet</h3><p className="muted">Run the working <b>DKB AI Studio</b> workflow in n8n. Saved drafts with <b>needs_review</b> will appear here automatically.</p></section>
      ) : (
        <section className="drafts">
          {drafts.map((draft, index) => <DraftCard key={draft.id} draft={draft} index={index} />)}
        </section>
      )}

      <section className="bottomgrid">
        <article className="panel">
          <p className="eyebrow">COMMUNITY RADAR</p>
          <h3>Reddit opportunities</h3>
          <p className="muted">Relevant conversations can be surfaced for useful reply drafts. Posting remains a deliberate human action.</p>
          <div className="reportrow"><span>Needs review</span><b>{redditCount}</b></div>
          <div className="reportrow"><span>Integration</span><b>{integration.reddit.label}</b></div>
        </article>
        <article className="panel">
          <p className="eyebrow">TREND + MORNING BRIEF</p>
          <h3>Daily intelligence</h3>
          <p className="muted">Trend candidates feed content research. The morning brief is planned for 9:00 AM IST after WhatsApp Business setup.</p>
          <div className="reportrow"><span>Trend candidates</span><b>{trendCount}</b></div>
          <div className="reportrow"><span>WhatsApp</span><b>{integration.whatsapp.label}</b></div>
          <div className="reportrow"><span>Rejected drafts</span><b>{rejectedCount}</b></div>
        </article>
      </section>

      <footer>Built for Dil Ki Baat · AI-assisted, human-approved publishing · refreshed {new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</footer>
    </main>
  );
}
