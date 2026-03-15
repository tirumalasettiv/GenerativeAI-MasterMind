import { useState, useEffect, useRef } from "react";

const KNOWLEDGE_BASE = [
  { id: 1, title: "Employee Handbook", icon: "📘", content: "Annual leave: 20 days per year. Sick leave: 10 days. Parental leave: 12 weeks paid." },
  { id: 2, title: "Product Catalog", icon: "📦", content: "Widget Pro costs $49.99. Widget Lite costs $29.99. Enterprise license starts at $999/year." },
  { id: 3, title: "IT Policy", icon: "🔒", content: "Passwords must be 12+ characters. VPN required for remote access. 2FA mandatory for all accounts." },
  { id: 4, title: "Company History", icon: "🏢", content: "Founded in 2015 by Jane Smith. Headquarters in Austin, TX. 500+ employees across 3 offices." },
  { id: 5, title: "Benefits Guide", icon: "💊", content: "Health insurance covers dental and vision. 401k match up to 4%. Free gym membership included." },
  { id: 6, title: "Travel Policy", icon: "✈️", content: "Economy class for flights under 6 hours. $150/night hotel limit. Meals reimbursed up to $75/day." },
];

const SAMPLE_QUESTIONS = [
  { q: "How many vacation days do I get?", matchIds: [1], keyword: "leave" },
  { q: "How much does Widget Pro cost?", matchIds: [2], keyword: "cost" },
  { q: "What's the password policy?", matchIds: [3], keyword: "password" },
  { q: "Who founded the company?", matchIds: [4], keyword: "founded" },
  { q: "Do we get gym membership?", matchIds: [5], keyword: "gym" },
  { q: "What's the hotel budget for travel?", matchIds: [6], keyword: "hotel" },
];

const ANSWERS = {
  1: "Based on our Employee Handbook, you get 20 days of annual leave per year, plus 10 sick days and 12 weeks of paid parental leave.",
  2: "According to our Product Catalog, Widget Pro is priced at $49.99. If you're looking for a budget option, Widget Lite is available at $29.99.",
  3: "Per our IT Policy, passwords must be at least 12 characters long. You'll also need to set up 2FA (two-factor authentication) on all your accounts.",
  4: "The company was founded in 2015 by Jane Smith. We're headquartered in Austin, TX, and have grown to over 500 employees across 3 offices.",
  5: "Yes! According to our Benefits Guide, you do get a free gym membership. That's on top of health insurance (with dental and vision) and a 401k match up to 4%.",
  6: "Per our Travel Policy, the hotel budget is $150 per night. Flights should be economy class for trips under 6 hours, and meals are reimbursed up to $75 per day.",
};

const STAGES = [
  { icon: "🤖", label: "Problem", title: "The Problem", sub: "AI Has a Memory Gap" },
  { icon: "📚", label: "Analogy", title: "The Analogy", sub: "Think of a Brilliant Librarian" },
  { icon: "🔍", label: "Retrieve", title: "Step 1: Retrieve", sub: "Search for Relevant Info" },
  { icon: "📎", label: "Augment", title: "Step 2: Augment", sub: "Attach Info to the Question" },
  { icon: "✨", label: "Generate", title: "Step 3: Generate", sub: "AI Crafts an Informed Answer" },
  { icon: "🎮", label: "Try It", title: "Try It Yourself", sub: "See RAG in Action" },
];

const A = "#6c5ce7", G = "#2ecc71", GD = "#1a9456";

const INSIGHTS = [
  ["💡", "Without access to your data, AI fills in the blanks with guesses — sometimes confidently wrong."],
  ["💡", "RAG is like a brilliant librarian: finds the right book first, then gives you an accurate answer."],
  ["💡", "Semantic search goes beyond keywords — it understands meaning, so 'vacation' matches 'annual leave'."],
  ["💡", "Like an open-book exam — the AI gets the question PLUS the relevant pages, so no guessing needed."],
  ["💡", "The answer cites real data. If info isn't in the knowledge base, it says \"I don't know.\""],
  ["💡", "Try different questions to see how RAG retrieves different documents and generates grounded answers."],
];

// ─── Components ─────────────────────────────────────────────────────

function TW({ text, speed = 20 }) {
  const [d, setD] = useState("");
  const i = useRef(0);
  useEffect(() => {
    setD(""); i.current = 0;
    const t = setInterval(() => { i.current++; setD(text.slice(0, i.current)); if (i.current >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text]);
  return <span>{d}{d.length < text.length && <span className="cur">|</span>}</span>;
}

// ─── Scenes ─────────────────────────────────────────────────────────

function S1() {
  const [showBad, setShowBad] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShowBad(true), 1200); return () => clearTimeout(t); }, []);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ background: A, color: "#fff", padding: "8px 16px", borderRadius: "14px 14px 4px 14px", fontSize: 16, fontWeight: 600, maxWidth: 400, marginLeft: "auto", marginBottom: 14, lineHeight: 1.5 }}>
        <TW text="How many vacation days do I get at our company?" speed={30} />
      </div>
      {showBad && (
        <div style={{ background: "#f4f4fa", padding: "12px 16px", borderRadius: "14px 14px 14px 4px", fontSize: 16, maxWidth: 440, marginBottom: 10, lineHeight: 1.6, animation: "fadeIn 0.5s" }}>
          <div style={{ fontSize: 14, color: "#b45555", fontWeight: 700, marginBottom: 6 }}>⚠️ Without RAG:</div>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            "Typically, companies offer 10-15 days of PTO... but I don't actually have access to <em>your</em> company's specific policy. I might be making this up!"
          </p>
          <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: "#c0392b", background: "#fdeaea", display: "inline-block", padding: "3px 10px", borderRadius: 8 }}>❌ Hallucination Risk</div>
        </div>
      )}
    </div>
  );
}

function S2() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 2200);
    const t3 = setTimeout(() => setPhase(3), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  const steps = [
    { emoji: "🗣️", text: "You ask: \"What's our refund policy?\"" },
    { emoji: "📚", text: "Librarian searches the shelves for the right book" },
    { emoji: "📖", text: "Reads the relevant pages" },
    { emoji: "💬", text: "Gives you an accurate, sourced answer" },
  ];
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>📚</div>
      <p style={{ color: "#4a4a5a", fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 20px" }}>
        Imagine a <strong>brilliant librarian</strong> who knows how to find anything — but only answers using the actual books on the shelves. That's RAG!
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420, margin: "0 auto" }}>
        {steps.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "10px 14px",
            background: "#fafafe", borderRadius: 10, border: "1px solid #eeeef5", textAlign: "left",
            opacity: i <= phase ? 1 : 0.15, transform: i <= phase ? "translateX(0)" : "translateX(20px)",
            transition: "all 0.5s ease",
          }}>
            <span style={{ fontSize: 22 }}>{s.emoji}</span>
            <span style={{ fontSize: 16, color: "#2d2d3d" }}>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function S3() {
  const [searching, setSearching] = useState(true);
  const [found, setFound] = useState([]);
  useEffect(() => {
    const t1 = setTimeout(() => { setFound([1]); }, 800);
    const t2 = setTimeout(() => { setFound([1, 5]); setSearching(false); }, 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div>
      <div style={{ background: A, color: "#fff", padding: "8px 16px", borderRadius: "14px 14px 4px 14px", fontSize: 16, fontWeight: 600, maxWidth: 340, marginLeft: "auto", marginBottom: 12 }}>How many vacation days do I get?</div>
      <p style={{ color: "#4a4a5a", fontSize: 16, textAlign: "center", margin: "12px 0" }}>
        {searching ? "🔍 Searching knowledge base..." : "✅ Found 2 relevant documents!"}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {KNOWLEDGE_BASE.map((doc) => {
          const isMatch = found.includes(doc.id);
          return (
            <div key={doc.id} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: 10, borderRadius: 10, border: `2px solid ${isMatch ? G : "#e8e8ef"}`,
              background: isMatch ? "#f0faf4" : "#fafafe",
              transform: isMatch ? "scale(1.04)" : "scale(1)",
              boxShadow: isMatch ? `0 4px 16px ${G}20` : "none", transition: "all 0.4s ease",
            }}>
              <span style={{ fontSize: 20 }}>{doc.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: isMatch ? GD : "#8a8a9a" }}>{doc.title}</span>
              {isMatch && <span style={{ fontSize: 11, color: G, fontWeight: 700 }}>MATCH ✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function S4() {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPh(1), 600);
    const t2 = setTimeout(() => setPh(2), 1800);
    const t3 = setTimeout(() => setPh(3), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  const bl = [
    { color: A, bg: "#faf9fe", label: "① YOUR QUESTION", text: '"How many vacation days do I get?"' },
    { color: GD, bg: "#eefaf2", label: "② RETRIEVED CONTEXT", text: '📘 "Annual leave: 20 days per year. Sick leave: 10 days..." 💊 "Health insurance, 401k match..."' },
    { color: "#d63031", bg: "#fdf2ef", label: "③ AUGMENTED PROMPT → AI", text: '"Using ONLY the following context, answer the user\'s question. Context: [Employee Handbook + Benefits Guide] Question: How many vacation days?"' },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {bl.map((b, i) => (
        <div key={i}>
          <div style={{
            padding: "10px 14px", borderRadius: 10, border: `2px solid ${b.color}28`, background: b.bg,
            opacity: ph >= i ? 1 : 0.1, transition: "opacity 0.5s",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: b.color, letterSpacing: 1 }}>{b.label}</div>
            <div style={{ fontSize: 16, color: "#2d2d3d", marginTop: 5, fontFamily: "monospace", lineHeight: 1.6 }}>{b.text}</div>
          </div>
          {i < 2 && <div style={{ textAlign: "center", fontSize: 18, color: "#c0c0d0", margin: "1px 0", opacity: ph >= i + 1 ? 1 : 0.1 }}>＋</div>}
        </div>
      ))}
      {ph >= 3 && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.3s" }}>
          <div style={{ fontSize: 20, color: "#c0c0d0" }}>⬇️</div>
          <div style={{ padding: "8px 14px", borderRadius: 10, border: "2px solid #f39c12", background: "linear-gradient(135deg, #fef9f3, #fdf4ea)", display: "inline-block" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#c87f0a", letterSpacing: 1 }}>SENT TO LLM →</span>
          </div>
        </div>
      )}
    </div>
  );
}

function S5() {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 600); return () => clearTimeout(t); }, []);
  return (
    <div>
      <div style={{ background: A, color: "#fff", padding: "8px 16px", borderRadius: "14px 14px 4px 14px", fontSize: 16, fontWeight: 600, maxWidth: 340, marginLeft: "auto", marginBottom: 12 }}>How many vacation days do I get?</div>
      {show && (
        <div style={{ background: "#f4f4fa", border: `1px solid ${G}44`, padding: "12px 16px", borderRadius: "14px 14px 14px 4px", fontSize: 18, lineHeight: 1.7, color: "#1a1a2e", animation: "fadeIn 0.4s" }}>
          <div style={{ fontSize: 14, color: GD, fontWeight: 700, marginBottom: 6 }}>✅ With RAG:</div>
          <TW text="Based on our Employee Handbook, you get 20 days of annual leave per year, plus 10 sick days. You also have access to 12 weeks of paid parental leave. For more details, check the full handbook!" speed={18} />
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: GD, background: "#e2f5ea", display: "inline-block", padding: "3px 10px", borderRadius: 8 }}>📘 Source: Employee Handbook</div>
        </div>
      )}
    </div>
  );
}

function S6() {
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("idle");
  const [matchedDocs, setMatchedDocs] = useState([]);

  const handleQuestion = (idx) => {
    setSelected(idx); setPhase("searching"); setMatchedDocs([]);
    const sq = SAMPLE_QUESTIONS[idx];
    setTimeout(() => { setMatchedDocs(sq.matchIds); setPhase("found"); }, 1000);
    setTimeout(() => setPhase("answering"), 2200);
  };

  return (
    <div>
      {phase === "idle" ? (
        <div>
          <p style={{ color: "#4a4a5a", fontSize: 16, textAlign: "center", marginBottom: 12 }}>Pick a question and watch RAG in action:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {SAMPLE_QUESTIONS.map((sq, i) => (
              <button key={i} onClick={() => handleQuestion(i)} style={{
                padding: "10px 14px", borderRadius: 10, border: "2px solid #dddde8", background: "#fafafe",
                cursor: "pointer", fontSize: 16, color: "#1a1a2e", textAlign: "left", fontWeight: 500, fontFamily: "'DM Sans'",
              }}>{sq.q}</button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ background: A, color: "#fff", padding: "8px 16px", borderRadius: "14px 14px 4px 14px", fontSize: 16, fontWeight: 600, maxWidth: 360, marginLeft: "auto", marginBottom: 10 }}>{SAMPLE_QUESTIONS[selected].q}</div>

          {(phase === "searching" || phase === "found" || phase === "answering") && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
              {KNOWLEDGE_BASE.map((doc) => {
                const isMatch = matchedDocs.includes(doc.id);
                return (
                  <div key={doc.id} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                    padding: 8, borderRadius: 8, border: `2px solid ${isMatch ? G : "#e8e8ef"}`,
                    background: isMatch ? "#f0faf4" : "#fafafe", transition: "all 0.4s",
                  }}>
                    <span style={{ fontSize: 16 }}>{doc.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: isMatch ? GD : "#b0b0be" }}>{doc.title}</span>
                  </div>
                );
              })}
            </div>
          )}

          {phase === "answering" && (
            <div style={{ background: "#f4f4fa", border: `1px solid ${G}44`, padding: "12px 16px", borderRadius: "14px 14px 14px 4px", fontSize: 18, lineHeight: 1.7, color: "#1a1a2e", animation: "fadeIn 0.4s" }}>
              <TW text={ANSWERS[matchedDocs[0]]} speed={18} />
              <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, color: GD, background: "#e2f5ea", display: "inline-block", padding: "3px 10px", borderRadius: 8 }}>📄 Source: {KNOWLEDGE_BASE.find(d => d.id === matchedDocs[0])?.title}</div>
            </div>
          )}

          <button onClick={() => { setSelected(null); setPhase("idle"); setMatchedDocs([]); }} style={{ marginTop: 8, padding: "5px 14px", border: "1px solid #d0d0dd", borderRadius: 14, background: "#fff", cursor: "pointer", fontSize: 15, color: A, fontWeight: 700, fontFamily: "'DM Sans'" }}>← Try another</button>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────

export default function RAGExplainer() {
  const [stage, setStage] = useState(0);
  const cur = STAGES[stage];
  const scenes = [<S1 />, <S2 />, <S3 />, <S4 />, <S5 />, <S6 />];

  return (
    <div style={P.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap');
        @keyframes fadeIn { from {opacity:0;transform:translateY(6px)} to {opacity:1;transform:translateY(0)} }
        @keyframes pulse { from {transform:scale(1)} to {transform:scale(1.15)} }
        .cur { animation: blink 0.7s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:hover { filter: brightness(1.06); }
        html, body, #root { height: 100%; overflow: hidden; }
      `}</style>

      {/* Sidebar */}
      <div style={P.sidebar}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#a0a0b0", marginBottom: 10, textAlign: "center" }}>STEPS</div>
        {STAGES.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <button onClick={() => setStage(i)} style={{
              width: 44, height: 44, borderRadius: "50%", border: "none", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer",
              transition: "all 0.3s", fontFamily: "'DM Sans'",
              background: i === stage ? A : i < stage ? G : "#e8e8f0",
              color: i <= stage ? "#fff" : "#aaa",
              transform: i === stage ? "scale(1.15)" : "scale(1)",
              boxShadow: i === stage ? `0 0 14px ${A}30` : "none",
            }}>{s.icon}</button>
            <div style={{
              fontSize: 12, fontWeight: 700, marginTop: 2, textAlign: "center",
              color: i === stage ? A : i < stage ? GD : "#b0b0be", letterSpacing: 0.2,
            }}>{s.label}</div>
            {i < STAGES.length - 1 && (
              <div style={{ width: 3, height: 10, margin: "2px 0", background: i < stage ? G : "#e0e0ed", borderRadius: 2 }} />
            )}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={P.main}>
        {/* Top bar */}
        <div style={P.topBar}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={P.badge}>INTERACTIVE GUIDE</span>
              <h1 style={P.title}>What is <span style={{ color: A }}>RAG</span>?</h1>
            </div>
          </div>
          <div style={P.navRow}>
            <button disabled={stage === 0} onClick={() => setStage(stage - 1)} style={{ ...P.navBtn, opacity: stage === 0 ? 0.3 : 1 }}>←</button>
            <span style={{ fontSize: 15, color: "#6a6a7a", fontWeight: 600, minWidth: 40, textAlign: "center" }}>{stage + 1}/{STAGES.length}</span>
            <button disabled={stage === STAGES.length - 1} onClick={() => setStage(stage + 1)} style={{ ...P.navBtn, ...P.navP, opacity: stage === STAGES.length - 1 ? 0.3 : 1 }}>→</button>
          </div>
        </div>

        {/* Stage header */}
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: "#1a1a2e" }}>
            <span style={{ color: A }}>{cur.title}</span>
          </h2>
          <p style={{ fontSize: 18, color: "#4a4a5a", fontWeight: 500, marginTop: 2 }}>{cur.sub}</p>
        </div>

        {/* Content area */}
        <div style={P.content} key={stage}>
          {/* Explanation */}
          <div style={P.explainRow}>
            <p style={P.explain}>{
              ["Large Language Models are trained on general knowledge. They don't know your company's specific documents, policies, or data — so they guess, and sometimes get it completely wrong.",
               "Imagine a brilliant librarian who knows how to find anything — but only answers using the actual books on the shelves. That's exactly what RAG does for AI.",
               "The system converts your question into a search query and finds the most relevant documents from your knowledge base using semantic similarity.",
               "The magic: we combine the user's question with the retrieved documents into a single, enriched prompt. The AI now has the facts it needs.",
               "Now the AI generates an answer grounded in real company data — not guesses. It can even cite its sources!",
               "Pick a question below and watch the full RAG pipeline retrieve documents and generate a grounded answer."][stage]
            }</p>
          </div>

          {/* Scene */}
          <div style={P.scene}>
            <div style={{ animation: "fadeIn 0.3s" }}>{scenes[stage]}</div>
          </div>

          {/* Insight */}
          <div style={P.insight}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{INSIGHTS[stage][0]}</span>
            <span>{INSIGHTS[stage][1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────

const P = {
  root: {
    display: "flex", width: "100%", height: "100vh", overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif", color: "#1a1a2e",
    background: "linear-gradient(180deg, #f7f6fd 0%, #fff 50%, #fafafe 100%)",
  },
  sidebar: {
    width: 120, flexShrink: 0, background: "#fff", borderRight: "1px solid #e8e8f0",
    padding: "12px 0", display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center",
  },
  main: {
    width: "75%", maxWidth: "75%", display: "flex", flexDirection: "column", padding: "16px 32px 12px",
    overflow: "hidden", minWidth: 0, margin: "0 auto",
  },
  topBar: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 10, flexShrink: 0,
  },
  badge: {
    fontSize: 11, fontWeight: 700, letterSpacing: 2,
    color: A, background: "#eee9fd", padding: "3px 12px", borderRadius: 14,
  },
  title: {
    fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2,
  },
  navRow: { display: "flex", alignItems: "center", gap: 6 },
  navBtn: {
    width: 36, height: 36, borderRadius: 8, border: "1px solid #d0d0dd", background: "#fff",
    cursor: "pointer", fontSize: 18, fontWeight: 600, color: "#3d3d4d",
    fontFamily: "'DM Sans'", display: "flex", alignItems: "center", justifyContent: "center",
  },
  navP: { background: A, color: "#fff", border: "none" },
  content: {
    flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0,
  },
  explainRow: { flexShrink: 0, marginBottom: 10 },
  explain: { fontSize: 18, color: "#2d2d3d", lineHeight: 1.7, margin: 0 },
  scene: {
    flex: 1, background: "#fff", borderRadius: 14, padding: "14px 18px",
    border: "1px solid #e0e0ec", boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
    overflow: "auto", minHeight: 0,
  },
  insight: {
    display: "flex", alignItems: "center", gap: 10, background: "#f7f6fd",
    borderRadius: 10, padding: "10px 14px", marginTop: 10, border: "1px solid #e8e4f2",
    fontSize: 16, color: "#2d2d3d", lineHeight: 1.6, flexShrink: 0,
  },
};
