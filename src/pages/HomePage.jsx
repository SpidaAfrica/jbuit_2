import { useState, useCallback } from "react";
import { api } from "../lib/api";
import { SALES_AI_URL } from "../lib/config";
import { SERVICES, STEPS, COURSE, PRODUCT, PRICING, FAQS } from "../data/services";
import Logo from "../components/Logo";
import Reveal from "../components/Reveal";
import Eyebrow from "../components/Eyebrow";
import Field from "../components/Field";
import FAQ from "../components/FAQ";
import Icon from "../components/Icon";
import HeroCarousel from "../components/HeroCarousel";

const NAV_LINKS = [
  ["Services", "#services"],
  ["How it works", "#how"],
  ["Sales AI", SALES_AI_URL],
  ["Pricing", "#pricing"],
  ["Course", "course"],
  ["FAQ", "#faq"],
];

function HomePage({ theme, mode, setMode, goCourse }) {
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const submit = useCallback(async (e) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    if (form.company) { setSent(true); return; }
    const errs = {};
    if (!form.name || form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setSubmitting(true);
    try {
      let res = await api.submitLead(form);
      if (res.status === 419) res = await api.submitLead(form);
      if (res.ok) {
        setSuccessMsg(res.data?.message || "Thanks! We'll be in touch shortly.");
        setSent(true);
      } else if (res.status === 422 && res.data?.fields) {
        setFieldErrors(res.data.fields);
      } else if (res.status === 429) {
        setFormError("You've sent a few messages already — please try again in a little while.");
      } else {
        setFormError(res.data?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setFormError("We couldn't reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }, [form]);

  const handleNav = (href, e) => {
    setMenuOpen(false);
    if (href === "course") { e.preventDefault(); goCourse(); }
  };

  const css = `
    *{box-sizing:border-box;margin:0;padding:0}
    @keyframes jbfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    ::selection{background:${theme.gold};color:#0C006E}
    .jb-btn{cursor:pointer;border:none;font-weight:700;border-radius:12px;transition:transform .15s ease,box-shadow .2s ease;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px}
    .jb-btn:hover{transform:translateY(-2px)}
    .jb-card{transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}
    .jb-card:hover{transform:translateY(-6px)}
    .jb-link{cursor:pointer;transition:color .2s ease}
    input,textarea{font-family:inherit}
    .jb-hamburger{display:none}
    @media(max-width:860px){
      .jb-nav-links{display:none !important}
      .jb-hamburger{display:inline-flex !important}
      .jb-hero-grid{grid-template-columns:1fr !important}
      .jb-course-grid{grid-template-columns:1fr !important}
      .jb-learn-grid{grid-template-columns:1fr !important}
      .jb-salesai-grid{grid-template-columns:1fr !important}
      .jb-start-project-desktop{display:none !important}
    }
  `;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'Inter',system-ui,-apple-system,sans-serif", transition: "background .4s ease,color .4s ease", overflowX: "hidden" }}>
      <style>{css}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)", background: mode === "dark" ? "rgba(8,0,58,0.7)" : "rgba(246,247,255,0.85)", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo theme={theme} />
          <div className="jb-nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {NAV_LINKS.map(([l, href]) => (
              <a key={l} className="jb-link" href={href === "course" ? "/course" : href}
                 onClick={(e) => handleNav(href, e)}
                 style={{ color: theme.textDim, textDecoration: "none", fontSize: 14, fontWeight: 600 }}
                 onMouseEnter={(e) => (e.target.style.color = theme.text)} onMouseLeave={(e) => (e.target.style.color = theme.textDim)}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button onClick={() => setMode(mode === "dark" ? "light" : "dark")} className="jb-btn"
              aria-label="Toggle theme"
              style={{ background: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, padding: "9px 11px", fontSize: 13 }}>
              <Icon name={mode === "dark" ? "Sun" : "Moon"} size={16} />
            </button>
            <a href="#contact" className="jb-btn jb-start-project-desktop" style={{ background: theme.gold, color: "#0C006E", padding: "10px 18px" }}>Start a project</a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="jb-btn jb-hamburger" aria-label="Menu"
              style={{ background: theme.panel, color: theme.text, border: `1px solid ${theme.border}`, padding: "9px 11px" }}>
              <Icon name={menuOpen ? "X" : "Menu"} size={18} />
            </button>
          </div>
        </div>

        {/* mobile menu drawer */}
        {menuOpen && (
          <div style={{ borderTop: `1px solid ${theme.border}`, background: mode === "dark" ? theme.bgDeep : "#fff", padding: "12px 24px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {NAV_LINKS.map(([l, href]) => (
                <a key={l} href={href === "course" ? "/course" : href}
                   onClick={(e) => handleNav(href, e)}
                   style={{ color: theme.text, textDecoration: "none", fontSize: 16, fontWeight: 600, padding: "12px 4px", borderBottom: `1px solid ${theme.border}` }}>
                  {l}
                </a>
              ))}
              <a href="#contact" onClick={() => setMenuOpen(false)} className="jb-btn" style={{ background: theme.gold, color: "#0C006E", padding: "14px", marginTop: 14 }}>Start a project</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO with video carousel background */}
      <header style={{ position: "relative" }}>
        <HeroCarousel mode={mode} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "110px 24px 104px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", padding: "7px 14px", borderRadius: 100, fontSize: 13, color: "#fff", marginBottom: 26, backdropFilter: "blur(4px)" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.gold }} /> Software development company
          </div>
          <h1 style={{ fontSize: "clamp(38px,6vw,68px)", lineHeight: 1.04, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff" }}>
            We build <span style={{ color: theme.gold }}>websites, apps & AI systems</span> that grow your business.
          </h1>
          <p style={{ marginTop: 24, fontSize: 19, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", maxWidth: 600, margin: "24px auto 0" }}>
            JBUIT is a software development company building modern websites, powerful mobile apps, and smart AI automation for businesses ready to scale.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contact" className="jb-btn" style={{ background: theme.gold, color: "#0C006E", padding: "15px 28px", boxShadow: "0 14px 30px rgba(255,193,7,0.3)" }}>
              Start a project <Icon name="ArrowRight" size={18} />
            </a>
            <a href="#services" className="jb-btn" style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", padding: "15px 28px", backdropFilter: "blur(4px)" }}>View services</a>
          </div>
        </div>
      </header>

      {/* SERVICES — the main event */}
      <section id="services" style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <Eyebrow theme={theme} center>What we do</Eyebrow>
          </div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
            Everything you need to build and grow online.
          </h2>
        </Reveal>
        <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 22 }}>
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.07}>
              <div className="jb-card" style={{ height: "100%", display: "flex", flexDirection: "column", padding: 30, borderRadius: 20, background: theme.panel, border: `1px solid ${theme.border}` }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: mode === "dark" ? "rgba(255,193,7,0.12)" : "rgba(255,193,7,0.18)", display: "grid", placeItems: "center", marginBottom: 18 }}>
                  <Icon name={s.icon} size={28} color={theme.gold} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em" }}>{s.title}</h3>
                <div style={{ color: theme.gold, fontWeight: 700, fontSize: 14.5, marginTop: 6, lineHeight: 1.4 }}>{s.headline}</div>
                <p style={{ color: theme.textDim, fontSize: 14.5, lineHeight: 1.6, marginTop: 12 }}>{s.desc}</p>
                <ul style={{ listStyle: "none", display: "grid", gap: 9, marginTop: 18 }}>
                  {s.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
                      <Icon name="Check" size={17} color={theme.gold} strokeWidth={3} /> {f}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 22, paddingTop: 20, borderTop: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 13, color: theme.textDim }}>Starting from</div>
                  <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 2 }}>{s.price}</div>
                </div>
                <a href="#contact" className="jb-btn" style={{ marginTop: 20, textAlign: "center", background: theme.gold, color: "#0C006E", padding: "13px 18px" }}>{s.cta} <Icon name="ArrowRight" size={16} /></a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: mode === "dark" ? theme.bgDeep : "#fff", borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 24px" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 14 }}><Eyebrow theme={theme} center>How it works</Eyebrow></div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>From idea to launch in 3 steps.</h2>
          </Reveal>
          <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 22 }}>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div style={{ padding: 28, borderRadius: 18, background: theme.panel, border: `1px solid ${theme.border}`, height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: mode === "dark" ? "rgba(255,193,7,0.12)" : "rgba(255,193,7,0.18)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon name={s.icon} size={24} color={theme.gold} strokeWidth={2} />
                    </div>
                    <div style={{ fontSize: 34, fontWeight: 800, color: theme.gold, letterSpacing: "-0.02em" }}>{s.n}</div>
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, marginTop: 16 }}>{s.title}</h3>
                  <p style={{ color: theme.textDim, fontSize: 14.5, lineHeight: 1.6, marginTop: 8 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SALES AI — our product (now before the setup pricing) */}
      <section id="salesai" style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 24px 0" }}>
        <Reveal>
          <div className="jb-salesai-grid" style={{ borderRadius: 22, background: mode === "dark" ? theme.bgDeep : "#fff", border: `1px solid ${theme.border}`, padding: "40px clamp(24px,4vw,48px)", display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: theme.gold, marginBottom: 12 }}>
                <Icon name="Zap" size={15} color={theme.gold} fill={theme.gold} /> {PRODUCT.tagline}
              </div>
              <h2 style={{ fontSize: "clamp(24px,3.4vw,34px)", fontWeight: 800, letterSpacing: "-0.02em" }}>{PRODUCT.name}</h2>
              <p style={{ marginTop: 12, fontSize: 16, lineHeight: 1.6, color: theme.textDim, maxWidth: 560 }}>{PRODUCT.desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "10px 22px", marginTop: 16 }}>
                {PRODUCT.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: theme.text }}>
                    <Icon name="Check" size={16} color={theme.gold} strokeWidth={3} /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <a href={SALES_AI_URL} target="_blank" rel="noopener noreferrer" className="jb-btn" style={{ background: theme.gold, color: "#0C006E", padding: "15px 28px", whiteSpace: "nowrap" }}>{PRODUCT.cta} <Icon name="ArrowRight" size={18} /></a>
          </div>
        </Reveal>
      </section>

      {/* PRICING — automation setup (after the product) */}
      <section id="pricing" style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 14 }}><Eyebrow theme={theme} center>AI automation setup</Eyebrow></div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>Done-for-you automation setup.</h2>
          <p style={{ marginTop: 14, color: theme.textDim, fontSize: 16, maxWidth: 580, margin: "14px auto 0", textAlign: "center" }}>
            Want us to set up your AI selling system end-to-end? Pick a setup package — a one-time build tailored to your business.
          </p>
        </Reveal>
        <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 20 }}>
          {PRICING.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className="jb-card" style={{
                height: "100%", padding: 30, borderRadius: 20,
                background: p.tag ? (mode === "dark" ? "linear-gradient(170deg,rgba(110,91,255,0.16),rgba(255,193,7,0.08))" : "#fff") : theme.panel,
                border: `1.5px solid ${p.tag ? theme.gold : theme.border}`,
                boxShadow: p.tag ? (mode === "dark" ? "0 24px 60px rgba(110,91,255,0.2)" : "0 24px 50px rgba(12,0,110,0.1)") : "none",
                position: "relative",
              }}>
                {p.tag && <span style={{ position: "absolute", top: -12, left: 30, background: theme.gold, color: "#0C006E", fontSize: 12, fontWeight: 800, padding: "5px 14px", borderRadius: 100 }}>{p.tag}</span>}
                <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.textDim }}>{p.name}</h3>
                <div style={{ margin: "14px 0 4px", fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>{p.price}</div>
                <div style={{ fontSize: 13, color: theme.textDim, marginBottom: 22 }}>{p.once}</div>
                <ul style={{ listStyle: "none", display: "grid", gap: 12 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: 10, fontSize: 14.5, color: theme.text }}>
                      <Icon name="Check" size={17} color={theme.gold} strokeWidth={3} />{f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="jb-btn" style={{ display: "flex", textAlign: "center", marginTop: 26, padding: "13px",
                  background: p.tag ? theme.gold : "transparent", color: p.tag ? "#0C006E" : theme.text, border: p.tag ? "none" : `1.5px solid ${theme.border}` }}>
                  {p.price === "Custom" ? "Request a quote" : "Get started"}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COURSE — now after the setup pricing */}
      <section id="course-band" style={{ background: mode === "dark" ? theme.bgDeep : "#fff", borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "90px 24px" }}>
          <Reveal>
            <div style={{ borderRadius: 26, overflow: "hidden", border: `1.5px solid ${theme.gold}`,
              background: mode === "dark" ? "linear-gradient(165deg,rgba(255,193,7,0.14),rgba(110,91,255,0.10))" : "linear-gradient(165deg,rgba(255,193,7,0.16),rgba(12,0,110,0.03))" }}>
              <div className="jb-course-grid" style={{ padding: "44px clamp(24px,5vw,56px)", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 44, alignItems: "center" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: theme.gold, color: "#0C006E", padding: "6px 13px", borderRadius: 100, fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 18 }}>
                    <Icon name="GraduationCap" size={15} /> Learn with us
                  </div>
                  <h2 style={{ fontSize: "clamp(26px,3.6vw,40px)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{COURSE.headline}</h2>
                  <p style={{ marginTop: 16, fontSize: 16.5, lineHeight: 1.6, color: theme.textDim }}>{COURSE.desc}</p>
                  <div style={{ marginTop: 22 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.gold, marginBottom: 12 }}>What you'll learn</div>
                    <ul className="jb-learn-grid" style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                      {COURSE.learn.map((l) => (
                        <li key={l} style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 14, lineHeight: 1.4 }}>
                          <Icon name="Check" size={16} color={theme.gold} strokeWidth={3} style={{ flexShrink: 0, marginTop: 2 }} /> {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div style={{ background: theme.panelSolid, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 30 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.textDim, marginBottom: 12 }}>Who is this for?</div>
                  <ul style={{ listStyle: "none", display: "grid", gap: 8, marginBottom: 22 }}>
                    {COURSE.who.map((w) => (
                      <li key={w} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 14.5 }}>
                        <Icon name="Check" size={16} color={theme.gold} strokeWidth={3} /> {w}
                      </li>
                    ))}
                  </ul>
                  <div style={{ paddingTop: 18, borderTop: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: 13, color: theme.textDim }}>Course fee · lifetime access</div>
                    <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", margin: "4px 0 2px" }}>{COURSE.price}</div>
                  </div>
                  <button onClick={goCourse} className="jb-btn" style={{ width: "100%", marginTop: 18, background: theme.gold, color: "#0C006E", padding: "15px" }}>Register now <Icon name="ArrowRight" size={18} /></button>
                  <div style={{ fontSize: 12, color: theme.textDim, textAlign: "center", marginTop: 12, display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                    <Icon name="Rocket" size={13} /> {COURSE.tagline}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <FAQ theme={theme} mode={mode} faqs={FAQS} />

      {/* CONTACT */}
      <section id="contact" style={{ maxWidth: 760, margin: "0 auto", padding: "90px 24px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <Eyebrow theme={theme} center>Let's talk</Eyebrow>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em" }}>Start your project today.</h2>
            <p style={{ marginTop: 14, color: theme.textDim, fontSize: 16 }}>Tell us what you want to build — we'll get back to you with next steps.</p>
          </div>
          <div style={{ background: theme.panel, border: `1px solid ${theme.border}`, borderRadius: 20, padding: 30 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Icon name="ShieldCheck" size={46} color={theme.gold} /></div>
                <h3 style={{ fontSize: 22, fontWeight: 800, margin: "12px 0 6px" }}>Got it — we'll be in touch!</h3>
                <p style={{ color: theme.textDim }}>{successMsg || "Your message is on its way to the JBUIT team."}</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} name="company" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} aria-hidden />
                <Field theme={theme} label="Your name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ada Obi" error={fieldErrors.name} />
                <Field theme={theme} label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@business.com" type="email" error={fieldErrors.email} />
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: theme.textDim, display: "block", marginBottom: 7 }}>What do you want to build?</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Tell us about your project..."
                    style={{ width: "100%", background: mode === "dark" ? "rgba(0,0,0,0.2)" : "#fff", border: `1px solid ${theme.border}`, borderRadius: 12, padding: "13px 15px", color: theme.text, fontSize: 15, resize: "vertical", outline: "none" }} />
                </div>
                {formError && (
                  <div style={{ background: "rgba(220,40,40,0.12)", border: "1px solid rgba(220,40,40,0.4)", color: mode === "dark" ? "#FFB4B4" : "#B00020", borderRadius: 10, padding: "11px 14px", fontSize: 13.5 }}>
                    {formError}
                  </div>
                )}
                <button onClick={submit} disabled={submitting} className="jb-btn" style={{ background: theme.gold, color: "#0C006E", padding: "15px", fontSize: 16, opacity: submitting ? 0.7 : 1, cursor: submitting ? "wait" : "pointer" }}>
                  {submitting ? "Sending…" : <>Send message <Icon name="ArrowRight" size={18} /></>}
                </button>
                <p style={{ fontSize: 12, color: theme.textDim, textAlign: "center", display: "flex", gap: 6, alignItems: "center", justifyContent: "center" }}>
                  <Icon name="Lock" size={13} /> Your info is sent securely. We never share your data.
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${theme.border}`, background: mode === "dark" ? theme.bgDeep : "#fff" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
          <div style={{ maxWidth: 340 }}>
            <Logo theme={theme} size={28} />
            <p style={{ color: theme.textDim, fontSize: 13, marginTop: 12 }}>JBUIT Technologies — building the future with AI & automation. Websites, mobile apps, AI systems, and our product Sales AI.</p>
          </div>
          <div style={{ display: "flex", gap: 22, color: theme.textDim, fontSize: 14, flexWrap: "wrap" }}>
            {[["Services", "#services"], ["How it works", "#how"], ["Pricing", "#pricing"], ["FAQ", "#faq"], ["Contact", "#contact"]].map(([l, href]) => (
              <a key={l} href={href} className="jb-link" style={{ color: theme.textDim, textDecoration: "none" }}>{l}</a>
            ))}
            <a href="/course" onClick={(e) => { e.preventDefault(); goCourse(); }} className="jb-link" style={{ color: theme.textDim, textDecoration: "none" }}>Course</a>
            <a href={SALES_AI_URL} target="_blank" rel="noopener noreferrer" className="jb-link" style={{ color: theme.textDim, textDecoration: "none" }}>Sales AI</a>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${theme.border}`, padding: "18px 24px", textAlign: "center", color: theme.textDim, fontSize: 13 }}>
          © {new Date().getFullYear()} JBUIT Technologies. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
