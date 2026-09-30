"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function generate() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: 1,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || "Generation failed.");
        return;
      }

      setMessage("Draft generated.");
      router.refresh();
    } catch {
      setMessage("Could not reach the automation service.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="generate-action">
      <button
        className="primary"
        type="button"
        onClick={generate}
        disabled={busy}
      >
        {busy ? "Generating…" : "Generate Reel"}
      </button>

      {message ? (
        <small className="action-message">{message}</small>
      ) : null}
    </div>
  );
}