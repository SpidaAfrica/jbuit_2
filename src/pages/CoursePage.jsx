import React, { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import Icon from "../components/Icon";

/* ============================================================
   JBUIT — Course page
   States:
     1) locked  → curriculum + "Pay & unlock" (Paystack)
     2) verifying → after Paystack redirect (?reference=...)
     3) unlocked → video library (device-based access token)
   Access token is stored in-memory + via a cookie-less localStorage
   key ONLY in production builds; in the preview it stays in memory.
   ============================================================ */

const ACCESS_KEY = "jbuit_course_access";

/* Curriculum — drop real video URLs into `video` later */
const MODULES = [
  { n: 1, title: "Foundations of AI Automation", len: "42 min",
    lessons: ["What automation can (and can't) do", "The tools we use", "Your first workflow"], video: "" },
  { n: 2, title: "Connecting WhatsApp, Instagram & Facebook", len: "55 min",
    lessons: ["Official APIs vs unofficial", "Setting up WhatsApp Cloud API", "IG & FB messaging"], video: "" },
  { n: 3, title: "Building Deal-Closing Flows", len: "1h 08min",
    lessons: ["Qualifying buyers", "Handling objections", "Closing logic"], video: "" },
  { n: 4, title: "Auto-Invoicing & Follow-ups", len: "47 min",
    lessons: ["Generating invoices", "Payment links", "Smart follow-up timing"], video: "" },
  { n: 5, title: "Deploying & Selling Your System", len: "1h 02min",
    lessons: ["Going live safely", "Pricing your service", "Landing your first client"], video: "" },
];

function getStoredAccess() {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(ACCESS_KEY);
    }
  } catch { /* ignore */ }
  return null;
}
function storeAccess(token) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(ACCESS_KEY, token);
    }
  } catch { /* ignore */ }
}

export default function CoursePage({ theme, mode, priceLabel = "₦50,000", onBack }) {
  const [token, setToken] = useState(() => getStoredAccess());
  const [view, setView] = useState(token ? "unlocked" : "locked");
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeVideo, setActiveVideo] = useState(null);

  // On load: if Paystack redirected back with ?reference=..., verify it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (reference && !token) {
      setView("verifying");
      (async () => {
        let res = await api.courseVerify({ reference });
        if (res.status === 419) res = await api.courseVerify({ reference });
        if (res.ok && res.data?.token) {
          storeAccess(res.data.token);
          setToken(res.data.token);
          setView("unlocked");
          // clean the ?reference from the URL
          window.history.replaceState({}, "", window.location.pathname);
        } else {
          setNotice(res.data?.error || "We couldn't confirm your payment. If you were charged, contact support.");
          setView("locked");
        }
      })();
    }
  }, []); // eslint-disable-line

  const pay = useCallback(async (e) => {
    e.preventDefault();
    setErrors({});
    setNotice("");
    if (form.company) return; // honeypot

    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setBusy(true);
    try {
      let res = await api.courseInit(form);
      if (res.status === 419) res = await api.courseInit(form);
      if (res.ok && res.data?.authorization_url) {
        window.location.href = res.data.authorization_url; // go to Paystack
      } else if (res.status === 422 && res.data?.fields) {
        setErrors(res.data.fields);
      } else {
        setNotice(res.data?.error || "Couldn't start payment. Please try again.");
      }
    } catch {
      setNotice("We couldn't reach the server. Please check your connection.");
    } finally {
      setBusy(false);
    }
  }, [form]);

  const t = theme;
  const card = { background: t.panel, border: `1px solid ${t.border}`, borderRadius: 18 };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, color: t.text, fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`
        .cp-mod{transition:border-color .2s ease, transform .2s ease}
        .cp-mod:hover{transform:translateY(-2px)}
        .cp-btn{cursor:pointer;border:none;font-weight:700;border-radius:12px;transition:transform .15s ease}
        .cp-btn:hover{transform:translateY(-2px)}
        .cp-topbar-title{font-weight:800;letter-spacing:0.14em}
        @media(max-width:780px){
          .cp-locked-grid{grid-template-columns:1fr !important}
          .cp-pay-card{position:static !important}
        }
        @media(max-width:480px){
          .cp-topbar-title{font-size:13px;letter-spacing:0.08em}
          .cp-topbar-spacer{display:none}
        }
      `}</style>

      {/* top bar */}
      <div style={{ borderBottom: `1px solid ${t.border}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
        <button onClick={onBack} className="cp-btn" style={{ background: "transparent", color: t.textDim, border: `1px solid ${t.border}`, padding: "8px 14px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name="ChevronLeft" size={16} /> Back to site</button>
        <span className="cp-topbar-title">JBUIT · COURSE</span>
        <span className="cp-topbar-spacer" style={{ width: 110 }} />
      </div>

      {/* VERIFYING */}
      {view === "verifying" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "120px 24px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Icon name="Lock" size={44} color={t.gold} /></div>
          <h2 style={{ fontSize: 26, fontWeight: 800 }}>Confirming your payment…</h2>
          <p style={{ color: t.textDim, marginTop: 10 }}>Hang tight, this only takes a moment.</p>
        </div>
      )}

      {/* LOCKED — sales + pay */}
      {view === "locked" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
          <div className="cp-locked-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40, alignItems: "start" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: t.panel, border: `1px solid ${t.border}`, padding: "7px 14px", borderRadius: 100, fontSize: 13, color: t.textDim, marginBottom: 20 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.gold }} /> Lifetime access · one-time payment
              </div>
              <h1 style={{ fontSize: "clamp(30px,4.4vw,48px)", lineHeight: 1.08, fontWeight: 800, letterSpacing: "-0.02em" }}>
                AI Automation <span style={{ color: t.gold }}>Mastery</span>
              </h1>
              <p style={{ marginTop: 16, fontSize: 17, lineHeight: 1.6, color: t.textDim, maxWidth: 520 }}>
                Build the exact AI systems we sell to clients — from your first automated reply to a full deal-closing assistant on WhatsApp. Practical, hands-on, no fluff.
              </p>

              <div style={{ marginTop: 28, display: "flex", gap: 26, flexWrap: "wrap" }}>
                {[["5", "modules"], ["20+", "lessons"], ["∞", "lifetime access"]].map(([n, l]) => (
                  <div key={l}><div style={{ fontSize: 26, fontWeight: 800, color: t.gold }}>{n}</div><div style={{ fontSize: 13, color: t.textDim }}>{l}</div></div>
                ))}
              </div>

              <div style={{ marginTop: 34 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: t.gold, marginBottom: 16 }}>What's inside</h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {MODULES.map((m) => (
                    <div key={m.n} className="cp-mod" style={{ ...card, padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
                      <span style={{ width: 34, height: 34, borderRadius: 9, background: t.gold, color: "#0C006E", display: "grid", placeItems: "center", fontWeight: 800, flexShrink: 0 }}>{m.n}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15.5 }}>{m.title}</div>
                        <div style={{ fontSize: 13, color: t.textDim, marginTop: 2 }}>{m.lessons.join(" · ")}</div>
                      </div>
                      <span style={{ fontSize: 12, color: t.textDim, display: "flex", gap: 6, alignItems: "center" }}><Icon name="Lock" size={13} /> {m.len}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* pay card */}
            <div className="cp-pay-card" style={{ ...card, padding: 28, position: "sticky", top: 24 }}>
              <div style={{ fontSize: 14, color: t.textDim }}>One-time payment</div>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em", margin: "6px 0 2px" }}>{priceLabel}</div>
              <div style={{ fontSize: 13, color: t.textDim, marginBottom: 22 }}>Lifetime access · all future updates</div>

              {notice && (
                <div style={{ background: "rgba(220,40,40,0.12)", border: "1px solid rgba(220,40,40,0.4)", color: mode === "dark" ? "#FFB4B4" : "#B00020", borderRadius: 10, padding: "11px 14px", fontSize: 13, marginBottom: 16 }}>{notice}</div>
              )}

              <div style={{ display: "grid", gap: 12 }}>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden style={{ position: "absolute", left: "-9999px" }} />
                <CInput t={t} mode={mode} label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ada Obi" error={errors.name} />
                <CInput t={t} mode={mode} label="Email (your receipt & access)" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" type="email" error={errors.email} />
                <button onClick={pay} disabled={busy} className="cp-btn" style={{ background: t.gold, color: "#0C006E", padding: "15px", fontSize: 16, opacity: busy ? 0.7 : 1, cursor: busy ? "wait" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {busy ? "Starting payment…" : <>Pay {priceLabel} & unlock <Icon name="ArrowRight" size={18} /></>}
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, fontSize: 12, color: t.textDim }}>
                <Icon name="ShieldCheck" size={14} /> Secured by Paystack · cards, transfer & USSD
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UNLOCKED — video library */}
      {view === "unlocked" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ background: t.gold, color: "#0C006E", fontSize: 12, fontWeight: 800, padding: "5px 12px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="Check" size={14} strokeWidth={3} /> UNLOCKED</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, letterSpacing: "-0.02em" }}>Welcome to AI Automation Mastery</h1>
          <p style={{ color: t.textDim, marginTop: 8, marginBottom: 30 }}>You have lifetime access on this device. Pick a module to begin.</p>

          {/* player */}
          {activeVideo !== null && (
            <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 28 }}>
              <div style={{ aspectRatio: "16/9", background: "#000", display: "grid", placeItems: "center", color: "#fff" }}>
                {MODULES[activeVideo].video ? (
                  <video src={MODULES[activeVideo].video} controls style={{ width: "100%", height: "100%" }} />
                ) : (
                  <div style={{ textAlign: "center", opacity: 0.8 }}>
                    <div style={{ display: "flex", justifyContent: "center" }}><Icon name="PlayCircle" size={46} /></div>
                    <div style={{ marginTop: 8, fontSize: 14 }}>Video for “{MODULES[activeVideo].title}” goes here</div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>Add the URL in MODULES[{activeVideo}].video</div>
                  </div>
                )}
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>Module {MODULES[activeVideo].n}: {MODULES[activeVideo].title}</div>
                <div style={{ color: t.textDim, fontSize: 14, marginTop: 4 }}>{MODULES[activeVideo].lessons.join(" · ")}</div>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gap: 12 }}>
            {MODULES.map((m, i) => (
              <button key={m.n} onClick={() => setActiveVideo(i)} className="cp-mod" style={{ ...card, padding: 18, display: "flex", gap: 14, alignItems: "center", textAlign: "left", cursor: "pointer", borderColor: activeVideo === i ? t.gold : t.border }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: activeVideo === i ? t.gold : t.panel, color: activeVideo === i ? "#0C006E" : t.text, border: `1px solid ${t.border}`, display: "grid", placeItems: "center", fontWeight: 800, flexShrink: 0 }}>{m.n}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15.5, color: t.text }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: t.textDim, marginTop: 2 }}>{m.lessons.join(" · ")}</div>
                </div>
                <span style={{ fontSize: 12, color: t.textDim, display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0 }}><Icon name="PlayCircle" size={14} /> {m.len}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CInput({ t, mode, label, value, onChange, placeholder, type = "text", error }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: t.textDim, display: "block", marginBottom: 7 }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: mode === "dark" ? "rgba(0,0,0,0.2)" : "#fff", border: `1px solid ${error ? "#E0405C" : t.border}`, borderRadius: 12, padding: "13px 15px", color: t.text, fontSize: 15, outline: "none" }}
        onFocus={(e) => (e.target.style.borderColor = t.gold)} onBlur={(e) => (e.target.style.borderColor = error ? "#E0405C" : t.border)} />
      {error && <div style={{ color: "#E0405C", fontSize: 12.5, marginTop: 6 }}>{error}</div>}
    </div>
  );
}
