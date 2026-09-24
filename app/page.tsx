const drafts = [
  { id: "DKB-001", title: "The person you never forgot", format: "Cinematic confession", status: "Needs review", hook: "Kya tum bhi kisi ko bhool nahi paa rahe?" },
  { id: "DKB-002", title: "Friendship that changed", format: "Story Reel", status: "Draft", hook: "Kya dosti khatam hone ke liye ladai zaroori hai?" },
  { id: "DKB-003", title: "A thought you needed today", format: "Thought card", status: "Approved", hook: "Tumhara har kisi ko samjhana zaroori nahi hai." },
];

const stats = [
  ["Followers", "60", "Baseline"],
  ["Drafts in queue", "3", "Sample data"],
  ["Awaiting approval", "1", "Sample data"],
  ["Publishing status", "Not connected", "Meta setup required"],
];

export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <div className="brandmark">dkb</div>
        <div className="brandcopy"><strong>Dil Ki Baat AI</strong><span>Content operating system</span></div>
        <span className="pill">MVP · Review mode</span>
      </header>
      <section className="hero">
        <div>
          <p className="eyebrow">YOUR CREATIVE COMMAND CENTER</p>
          <h1>Make room for<br/><em>every story.</em></h1>
          <p className="intro">Discover ideas, create original Reels, review every draft, and learn from your audience — all in one place.</p>
          <div className="actions"><button className="primary" type="button">+ New content brief</button><button className="secondary" type="button">Connect Instagram <span>↗</span></button></div>
        </div>
        <div className="hero-note"><span className="spark">✳</span><p>Today’s creative principle</p><strong>Make it feel like a message someone needed to hear.</strong><small>Brand voice · intimate, thoughtful, non-judgmental</small></div>
      </section>
      <section className="stats">{stats.map(([label,value,note]) => <article className="stat" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</section>
      <section className="sectionhead"><div><p className="eyebrow">WORKSPACE</p><h2>Content pipeline</h2></div><span className="muted">Sample drafts · not published</span></section>
      <section className="drafts">{drafts.map((draft, i) => <article className="draft" key={draft.id}><div className={`cover cover${i+1}`}><span>{draft.format}</span><b>{i===0 ? "Some people
stay with us." : i===1 ? "When friendship
quietly changes." : "You don't owe
everyone an explanation."}</b><small>DIL KI BAAT</small></div><div className="draftbody"><div className="draftmeta"><span>{draft.id}</span><span className={`status ${draft.status==="Approved"?"approved":""}`}>{draft.status}</span></div><h3>{draft.title}</h3><p className="hook">“{draft.hook}”</p><div className="draftactions"><button type="button" className="secondary small">Preview</button><button type="button" className="primary small">{draft.status==="Approved"?"View approval":"Review draft"}</button></div></div></article>)}</section>
      <section className="bottomgrid">
        <article className="panel"><p className="eyebrow">TREND INTELLIGENCE</p><h3>Today's discovery queue</h3><p className="muted">Trend ingestion is not connected yet. The production workflow will collect permitted sources, timestamp findings, and flag ideas for human review.</p><div className="empty"><span>✳</span><strong>No live trends connected</strong><small>Connect trend sources in the next build phase.</small></div></article>
        <article className="panel"><p className="eyebrow">MORNING BRIEF</p><h3>WhatsApp delivery</h3><p className="muted">Daily report delivery is planned for WhatsApp. A supported WhatsApp Business integration and recipient opt-in are required.</p><div className="reportrow"><span>Delivery status</span><b>Not configured</b></div><div className="reportrow"><span>Schedule</span><b>9:00 AM IST · planned</b></div></article>
      </section>
      <footer>Built for Dil Ki Baat · AI-assisted, human-approved publishing</footer>
    </main>
  );
}
