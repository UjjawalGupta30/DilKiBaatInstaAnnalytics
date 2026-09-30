"use client";

import { useState } from "react";

type TimelineLine = { start_seconds: number; end_seconds: number; text: string };

type Draft = {
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

function parseTimeline(value: unknown): TimelineLine[] {
  if (!Array.isArray(value)) return [];
  return value.filter((line): line is TimelineLine => {
    if (!line || typeof line !== "object") return false;
    const item = line as Record<string, unknown>;
    return typeof item.start_seconds === "number" && typeof item.end_seconds === "number" && typeof item.text === "string";
  });
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function DraftCard({ draft, index }: { draft: Draft; index: number }) {
  const [item, setItem] = useState(draft);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState(draft.topic);
  const [hook, setHook] = useState(draft.hook || "");
  const [caption, setCaption] = useState(draft.caption || "");
  const [hashtags, setHashtags] = useState((draft.hashtags || []).join(", "));

  const timeline = parseTimeline(item.timestamp_lines);
  const cover = `cover cover${(index % 3) + 1}`;

  async function patch(payload: Record<string, unknown>) {
    setBusy(true);
    setMessage("");
    const response = await fetch(`/api/content/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setMessage(data.message || "Update failed");
      return false;
    }
    setItem(data.item);
    setMessage("Saved");
    return true;
  }

  async function saveEdit() {
    const ok = await patch({
      topic,
      hook,
      caption,
      hashtags: hashtags
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    });
    if (ok) setEditing(false);
  }

  async function approve() {
    await patch({ status: "approved" });
  }

  async function reject() {
    await patch({ status: "rejected" });
  }

  return (
    <article className="draft" id={item.id}>
      <div className={cover}>
        <span>{item.format || "Reel"}</span>
        <b>{item.topic.length > 82 ? `${item.topic.slice(0, 82)}…` : item.topic}</b>
        <small>DIL KI BAAT</small>
      </div>

      <div className="draftbody">
        <div className="draftmeta">
          <span>{item.slug}</span>
          <span className={`status ${item.status === "approved" || item.status === "published" ? "approved" : item.status === "failed" || item.status === "rejected" ? "failed" : ""}`}>
            {statusLabel(item.status)}
          </span>
        </div>

        {editing ? (
          <div className="editform">
            <label>Topic<input value={topic} onChange={(e) => setTopic(e.target.value)} /></label>
            <label>Hook<textarea value={hook} onChange={(e) => setHook(e.target.value)} rows={3} /></label>
            <label>Caption<textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={5} /></label>
            <label>Hashtags<input value={hashtags} onChange={(e) => setHashtags(e.target.value)} /></label>
          </div>
        ) : (
          <>
            <h3>{item.hook || item.topic}</h3>
            <p className="hook">“{item.hook || "No hook yet."}”</p>

            {timeline.length > 0 ? (
              <div className="timeline-preview">
                {timeline.map((line) => (
                  <div className="timeline-row" key={`${item.id}-${line.start_seconds}-${line.end_seconds}`}>
                    <span>{line.start_seconds}s–{line.end_seconds}s</span>
                    <p>{line.text}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {item.caption ? <p className="caption-preview">{item.caption}</p> : null}
          </>
        )}

        {item.asset_url ? (
          <video className="asset-preview" controls preload="metadata" src={item.asset_url} />
        ) : null}

        <div className="draftactions">
          {editing ? (
            <>
              <button className="secondary small" type="button" onClick={() => setEditing(false)} disabled={busy}>Cancel</button>
              <button className="primary small" type="button" onClick={saveEdit} disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            </>
          ) : (
            <>
              <button className="secondary small" type="button" onClick={() => setEditing(true)} disabled={busy}>Edit</button>
              {item.status === "needs_review" || item.status === "draft" || item.status === "idea" ? (
                <>
                  <button className="secondary small danger-button" type="button" onClick={reject} disabled={busy}>Reject</button>
                  <button className="primary small" type="button" onClick={approve} disabled={busy}>{busy ? "Working…" : "Approve"}</button>
                </>
              ) : null}
            </>
          )}
        </div>
        {message ? <small className="action-message">{message}</small> : null}
      </div>
    </article>
  );
}
