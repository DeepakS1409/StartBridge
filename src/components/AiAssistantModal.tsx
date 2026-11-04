import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  activeRole?: UserRole;
  currentCategory?: string;
}

interface MessageItem {
  id: string;
  type: 'text' | 'card';
  sender?: 'user' | 'assistant';
  text?: string;
  html?: string;
}

// Sample dataset provided by user
const P = [
  { n: "MediScan Pro", t: "healthcare", d: "Handheld AI device that screens for diabetic retinopathy.", tech: "Python, TensorFlow, React Native", hw: "Raspberry Pi 5, 12MP camera", cost: 18, ask: 60, r: 4.8, rev: 42, pat: "Granted" },
  { n: "PulseBand", t: "healthcare", d: "Wearable for continuous heart-rhythm monitoring with alerts.", tech: "C++, Flutter, Firebase", hw: "ESP32, PPG sensor", cost: 9, ask: 35, r: 4.5, rev: 31, pat: "Granted" },
  { n: "LearnLoop", t: "education", d: "Adaptive tutoring app that personalises lessons in regional languages.", tech: "JavaScript, Node.js, PyTorch", hw: "None (cloud)", cost: 7, ask: 25, r: 4.6, rev: 57, pat: "Granted" },
  { n: "BrailleBuddy", t: "education", d: "Low-cost refreshable braille reader for visually impaired students.", tech: "C, Python", hw: "Arduino, micro-actuators", cost: 12, ask: 40, r: 4.3, rev: 19, pat: "Filed & published" },
  { n: "AgroSense", t: "agriculture", d: "Soil-moisture IoT kit with crop-advice app for small farmers.", tech: "Python, MQTT, Kotlin", hw: "ESP32, soil sensors, LoRa", cost: 10, ask: 45, r: 4.7, rev: 36, pat: "Granted" },
  { n: "PayEasy Lite", t: "fintech", d: "Offline-first UPI payments for low-connectivity villages.", tech: "Java, Go, PostgreSQL", hw: "None", cost: 15, ask: 80, r: 4.4, rev: 24, pat: "Granted" },
  { n: "SolarSmart Grid", t: "energy", d: "Smart controller that balances rooftop solar and grid use.", tech: "Rust, Python, MQTT", hw: "STM32, smart meters", cost: 20, ask: 100, r: 4.5, rev: 28, pat: "Granted" }
];

const I = [
  { n: "Ananya Ventures", th: ["healthcare", "education"], min: 25, max: 150, past: 14, profit: 22, r: 4.8, rev: 35, c: "ananya@example.com" },
  { n: "GreenRoot Capital", th: ["agriculture", "energy"], min: 40, max: 300, past: 9, profit: 18, r: 4.5, rev: 21, c: "hello@greenroot.example" },
  { n: "Nova Angels", th: ["fintech", "education"], min: 10, max: 80, past: 21, profit: 26, r: 4.6, rev: 48, c: "team@novaangels.example" },
  { n: "Kaveri Health Fund", th: ["healthcare"], min: 50, max: 500, past: 11, profit: 20, r: 4.7, rev: 29, c: "invest@kaverihf.example" },
  { n: "Horizon Seed", th: ["healthcare", "fintech", "energy"], min: 15, max: 120, past: 30, profit: 17, r: 4.2, rev: 60, c: "seed@horizon.example" }
];

const TH: Record<string, string[]> = {
  healthcare: ["health", "medical", "hospital", "patient", "doctor", "disease", "medicine"],
  education: ["educat", "school", "student", "learn", "teach", "tutor", "college"],
  agriculture: ["agri", "farm", "crop", "soil", "irrigation"],
  fintech: ["fintech", "payment", "bank", "loan", "finance", "upi"],
  energy: ["energy", "solar", "power", "battery", "grid", "environment", "climate"]
};

const PLAN: Record<string, { team: string; tech: string; legal: string; cost: string; time: string }> = {
  healthcare: {
    team: "Medical advisor, ML/embedded engineer, regulatory consultant",
    tech: "Sensors or imaging, an ML model trained on validated clinical data, secure patient-data handling",
    legal: "Medical-device approval (CDSCO in India), clinical validation, data-privacy compliance",
    cost: "₹15–60 lakh to a validated prototype",
    time: "9–18 months"
  },
  education: {
    team: "Developer, instructional designer, subject experts",
    tech: "Mobile/web app, content engine, analytics; optionally AI for personalisation",
    legal: "Student-data privacy, content licensing",
    cost: "₹5–20 lakh to MVP",
    time: "4–8 months"
  },
  agriculture: {
    team: "Embedded engineer, agronomist, field-operations lead",
    tech: "Low-power sensors, LoRa/GSM connectivity, simple local-language app",
    legal: "Device certification, subsidy and scheme alignment",
    cost: "₹8–30 lakh to field pilot",
    time: "6–12 months"
  },
  fintech: {
    team: "Backend engineers, security lead, compliance officer",
    tech: "Secure APIs, encryption, fraud detection, audit logging",
    legal: "RBI/NPCI rules, KYC/AML, partnership with a licensed bank",
    cost: "₹15–50 lakh plus compliance",
    time: "8–15 months"
  },
  energy: {
    team: "Power-electronics engineer, firmware developer, field installer",
    tech: "Controllers, smart meters, cloud monitoring",
    legal: "Electrical safety standards, utility approvals",
    cost: "₹20–80 lakh to pilot",
    time: "9–18 months"
  },
  general: {
    team: "Technical co-founder, domain expert, business lead",
    tech: "Choose the simplest stack that proves the core idea",
    legal: "Business registration, IP search and patent filing",
    cost: "₹5–25 lakh to MVP",
    time: "4–12 months"
  }
};

const fmt = (l: number) => (l >= 100 ? "₹" + (l / 100) + " Cr" : "₹" + l + " L");
const stars = (r: number) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r)) + " " + r;

function detectTheme(t: string): string | null {
  const lower = t.toLowerCase();
  for (const k in TH) {
    if (TH[k].some((w) => lower.includes(w)) || lower.includes(k)) {
      return k;
    }
  }
  return null;
}

function parseAmounts(t: string): number[] {
  const u: Record<string, number> = { cr: 100, crore: 100, l: 1, lakh: 1, lakhs: 1, k: 0.01, m: 10, million: 10 };
  const out: number[] = [];
  const matches = t.toLowerCase().matchAll(/(\d+(?:\.\d+)?)\s*(crores?|cr|lakhs?|l|k|million|m)?\b/g);
  for (const m of matches) {
    if (!m[2] && out.length === 0 && !/₹|rs|inr|fund|range|between/.test(t.toLowerCase())) continue;
    const key = (m[2] || "l").replace(/s$/, "").replace("crore", "cr");
    out.push(+m[1] * (u[key] || 1));
  }
  return out.slice(0, 2);
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpen,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init',
      type: 'text',
      sender: 'assistant',
      text: "Hello! I’m your StartupBridge assistant. Investors: ask for top startups by theme. Developers: ask for investors by theme and funding range. Have a new idea? Describe it and I’ll tell you if it’s feasible and how to build it."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  const chips = [
    { label: "Top healthcare startups", query: "Top healthcare startups" },
    { label: "Top education projects", query: "Top education projects" },
    { label: "Investors for ₹40L–1Cr in agriculture", query: "Investors for ₹40L–1Cr in agriculture" },
    { label: "Investors for healthcare around 50 lakh", query: "Investors for healthcare around 50 lakh" },
    { label: "Check my startup idea", query: "I have an idea: a solar-powered smart irrigation device for small farmers" },
  ];

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const say = (text: string, sender: 'user' | 'assistant' = 'assistant') => {
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}-${Math.random()}`, type: 'text', sender, text }
    ]);
  };

  const addCard = (html: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `card-${Date.now()}-${Math.random()}`, type: 'card', html }
    ]);
  };

  const handleProjectsIntent = (th: string | null) => {
    const list = P.filter((p) => !th || p.t === th)
      .sort((a, b) => b.r - a.r)
      .slice(0, 4);

    if (!list.length) {
      say("No projects found for that theme yet.");
      return;
    }

    say("Top " + (th || "") + " projects by rating:");
    list.forEach((p) => {
      addCard(
        `<h4>${p.n}</h4><div class="s">${stars(p.r)} · ${p.rev} reviews · <span class="tag">${p.t}</span></div><div>${p.d}</div><div><b>Tech:</b> ${p.tech}</div><div><b>Hardware:</b> ${p.hw}</div><div><b>Build cost:</b> ${fmt(p.cost)} · <b>Seeking:</b> ${fmt(p.ask)}</div><div><b>Patent:</b> ${p.pat} · 🎥 Demo video on project page</div>`
      );
    });
  };

  const handleInvestorsIntent = (th: string | null, a: number[]) => {
    let list = I.filter((i) => !th || i.th.includes(th));
    if (a.length === 2) {
      list = list.filter((i) => i.min <= a[1] && i.max >= a[0]);
    } else if (a.length === 1) {
      list = list.filter((i) => i.min <= a[0] && i.max >= a[0]);
    }
    list.sort((x, y) => y.r - x.r);

    if (!list.length) {
      say("No investors match that theme and range. Try widening the funding range or theme.");
      return;
    }

    say(
      "Matching investors" +
        (th ? " for " + th : "") +
        (a.length ? " (around " + a.map(fmt).join("–") + ")" : "") +
        ":"
    );
    list.slice(0, 4).forEach((i) => {
      addCard(
        `<h4>${i.n}</h4><div class="s">${stars(i.r)} · ${i.rev} reviews</div><div>${i.th
          .map((t) => `<span class="tag">${t}</span>`)
          .join("")}</div><div><b>Ticket size:</b> ${fmt(i.min)} – ${fmt(
          i.max
        )}</div><div><b>Past investments:</b> ${i.past} · <b>Avg. profit:</b> ${
          i.profit
        }%</div><div><b>Contact:</b> ${i.c}</div>`
      );
    });
  };

  const handleIdeaIntent = (t: string, th: string | null) => {
    const p = PLAN[th || "general"] || PLAN.general;
    let s = 55;
    if (th) s += 10;
    if (/user|customer|problem|farmer|patient|student|people/i.test(t)) s += 10;
    if (/app|sensor|ai|software|iot|device|platform/i.test(t)) s += 8;
    if (t.split(/\s+/).length < 15) s -= 10;
    if (/patent|prototype|pilot|tested/i.test(t)) s += 7;
    s = Math.max(30, Math.min(90, s));

    const v =
      s >= 75
        ? "Looks feasible"
        : s >= 60
        ? "Feasible with changes"
        : "Needs more clarity before it can work";

    addCard(
      `<h4>${v}</h4><div class="s">Feasibility estimate: ${s}/100 (${
        th || "general"
      })</div><div class="bar"><i style="width:${s}%"></i></div>`
    );
    addCard(
      `<h4>What to change to make it possible</h4><div>• Start with one narrow user group and one core feature.</div><div>• Build a working prototype or demo video before approaching investors.</div><div>• ${
        s < 75
          ? "Describe the problem, who has it and how you solve it in more detail."
          : "Gather early user feedback or pilot data."
      }</div><div>• Run a patent search and file early. Only patented products can be listed on the platform.</div>`
    );
    addCard(
      `<h4>Requirements overview</h4><div><b>Team:</b> ${p.team}</div><div><b>Technology:</b> ${p.tech}</div><div><b>Legal:</b> ${p.legal}</div><div><b>Estimated cost:</b> ${p.cost}</div><div><b>Timeline:</b> ${p.time}</div>`
    );
    addCard(
      `<h4>How to make it work</h4><div>1. Validate the problem with 20–30 target users.</div><div>2. Build a minimum prototype and record a demo.</div><div>3. File for a patent or IP protection.</div><div>4. Pilot with a small group and collect results.</div><div>5. Prepare a cost sheet, then list the product and contact matching investors.</div>`
    );
    say(
      "This is a quick estimate, not a guarantee. Share more details (budget, tech, target users) for a sharper assessment."
    );
  };

  const processReply = (t: string) => {
    const th = detectTheme(t);
    const a = parseAmounts(t);
    const l = t.toLowerCase();

    if (/\b(hi|hello|hey)\b/.test(l) && l.split(/\s+/).length < 4) {
      say("Hi! I can show top startups, find investors, or assess your startup idea. What would you like?");
      return;
    }
    if (/investor|funder|funding range|who can fund|venture|angel/.test(l) && !/idea:/.test(l)) {
      handleInvestorsIntent(th, a);
      return;
    }
    if (
      /idea|feasib|possible|will it work|how to make|want to build|i want to|my startup/.test(l) ||
      (l.split(/\s+/).length > 14 && !/top|best/.test(l))
    ) {
      handleIdeaIntent(t, th);
      return;
    }
    if (/top|best|startup|project|product|show|find/.test(l)) {
      handleProjectsIntent(th);
      return;
    }
    say(
      "I can help with: (1) top startups by theme, (2) investors by theme and funding range, (3) feasibility of your startup idea. Try one of the suggestions below."
    );
  };

  const handleSend = (text: string) => {
    const t = text.trim();
    if (!t) return;
    say(t, 'user');
    setTimeout(() => {
      processReply(t);
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSend(inputText);
    setInputText('');
  };

  return (
    <>
      <style>{`
        :root {
          --cb-bg: #f7f8fb;
          --cb-surf: #ffffff;
          --cb-tx: #1b1f2a;
          --cb-mut: #667085;
          --cb-bd: #e2e5ec;
          --cb-ac: #4f46e5;
          --cb-act: #ffffff;
          --cb-bub: #eef0f6;
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --cb-bg: #12141b;
            --cb-surf: #1b1e28;
            --cb-tx: #eceef5;
            --cb-mut: #9aa1b3;
            --cb-bd: #2b2f3d;
            --cb-ac: #7c83ff;
            --cb-act: #10121a;
            --cb-bub: #262a38;
          }
        }
        .cb-fab {
          position: fixed;
          right: 20px;
          bottom: calc(20px + env(safe-area-inset-bottom, 0px));
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 0;
          background: var(--cb-ac);
          color: var(--cb-act);
          font-size: 26px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .cb-fab:hover {
          transform: scale(1.06);
          box-shadow: 0 8px 22px rgba(79,70,229,0.35);
        }
        .cb-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 400px;
          max-width: 100%;
          background: var(--cb-surf);
          border-left: 1px solid var(--cb-bd);
          color: var(--cb-tx);
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 60;
          box-shadow: -8px 0 30px rgba(0,0,0,0.15);
          font: 14.5px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        }
        .cb-panel.cb-open {
          transform: translateX(0);
        }
        .cb-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(2px);
          z-index: 55;
          animation: cbFadeIn 0.2s ease-out;
        }
        @keyframes cbFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cb-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--cb-bd);
          background: var(--cb-surf);
        }
        .cb-header b {
          flex: 1;
          font-size: 15px;
          font-weight: 700;
          color: var(--cb-tx);
        }
        .cb-header button {
          background: none;
          border: 0;
          color: var(--cb-mut);
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
        .cb-header button:hover {
          color: var(--cb-tx);
          background: var(--cb-bub);
        }
        .cb-log {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cb-m {
          max-width: 92%;
          padding: 9px 12px;
          border-radius: 14px;
          background: var(--cb-bub);
          color: var(--cb-tx);
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 13.5px;
          line-height: 1.45;
        }
        .cb-u {
          align-self: flex-end;
          background: var(--cb-ac);
          color: var(--cb-act);
        }
        .cb-card {
          border: 1px solid var(--cb-bd);
          border-radius: 12px;
          padding: 10px 12px;
          background: var(--cb-surf);
          color: var(--cb-tx);
          align-self: stretch;
          font-size: 13.5px;
          line-height: 1.45;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .cb-card h4 {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 700;
          color: var(--cb-tx);
        }
        .cb-card .s {
          color: var(--cb-mut);
          font-size: 12.5px;
        }
        .cb-card .tag {
          display: inline-block;
          background: var(--cb-bub);
          color: var(--cb-tx);
          border-radius: 6px;
          padding: 1px 6px;
          margin: 2px 3px 0 0;
          font-size: 11.5px;
          font-weight: 500;
        }
        .cb-card div {
          margin-top: 4px;
        }
        .cb-card .bar {
          height: 8px;
          border-radius: 4px;
          background: var(--cb-bub);
          overflow: hidden;
          margin-top: 6px;
        }
        .cb-card .bar i {
          display: block;
          height: 100%;
          background: var(--cb-ac);
          transition: width 0.4s ease;
        }
        .cb-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 14px 8px;
        }
        .cb-chips button {
          border: 1px solid var(--cb-bd);
          background: var(--cb-surf);
          color: var(--cb-tx);
          border-radius: 16px;
          padding: 5px 10px;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .cb-chips button:hover {
          background: var(--cb-bub);
          border-color: var(--cb-mut);
        }
        .cb-form {
          display: flex;
          gap: 8px;
          padding: 10px 14px;
          border-top: 1px solid var(--cb-bd);
          background: var(--cb-surf);
        }
        .cb-input {
          flex: 1;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid var(--cb-bd);
          background: var(--cb-bg);
          color: var(--cb-tx);
          font: inherit;
          font-size: 13.5px;
          outline: none;
        }
        .cb-input:focus {
          border-color: var(--cb-ac);
        }
        .cb-btn {
          border: 0;
          border-radius: 10px;
          background: var(--cb-ac);
          color: var(--cb-act);
          padding: 0 16px;
          cursor: pointer;
          font: inherit;
          font-weight: 600;
          font-size: 13.5px;
          transition: opacity 0.15s;
        }
        .cb-btn:hover {
          opacity: 0.9;
        }
      `}</style>

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="cb-fab"
          aria-label="Open AI assistant"
          onClick={() => {
            if (onOpen) onOpen();
          }}
        >
          💬
        </button>
      )}

      {/* Backdrop (on mobile or click to close) */}
      {isOpen && <div className="cb-backdrop" onClick={onClose} />}

      {/* Slide-out Panel */}
      <aside
        className={`cb-panel ${isOpen ? 'cb-open' : ''}`}
        aria-label="AI assistant"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cb-header">
          <b>🤖 StartupBridge Assistant</b>
          <button onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="cb-log" ref={logRef}>
          {messages.map((m) => {
            if (m.type === 'card' && m.html) {
              return (
                <div
                  key={m.id}
                  className="cb-card"
                  dangerouslySetInnerHTML={{ __html: m.html }}
                />
              );
            }
            return (
              <div
                key={m.id}
                className={`cb-m ${m.sender === 'user' ? 'cb-u' : ''}`}
              >
                {m.text}
              </div>
            );
          })}
        </div>

        <div className="cb-chips">
          {chips.map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(c.query)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <form className="cb-form" onSubmit={handleSubmit}>
          <input
            className="cb-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about startups, investors or your idea…"
            autoComplete="off"
          />
          <button type="submit" className="cb-btn">
            Send
          </button>
        </form>
      </aside>
    </>
  );
};
