import { useState } from "react";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import Icon from "./Icon";

/* FAQ accordion — reinforces the service vs product distinction. */
function FAQ({ theme, mode, faqs }) {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" style={{ maxWidth: 820, margin: "0 auto", padding: "90px 24px" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <Eyebrow theme={theme} center>FAQ</Eyebrow>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Questions, answered
          </h2>
        </div>
      </Reveal>

      <div style={{ display: "grid", gap: 12 }}>
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.04}>
              <div style={{ border: `1px solid ${isOpen ? theme.gold : theme.border}`, borderRadius: 14, background: theme.panel, transition: "border-color .2s ease" }}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  style={{
                    width: "100%", textAlign: "left", cursor: "pointer", background: "transparent", border: "none",
                    padding: "20px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
                    color: theme.text, fontFamily: "inherit",
                  }}
                >
                  <span style={{ fontSize: 16.5, fontWeight: 700, lineHeight: 1.4 }}>{f.q}</span>
                  <span style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: 8, display: "grid", placeItems: "center",
                    background: isOpen ? theme.gold : "transparent", color: isOpen ? "#0C006E" : theme.textDim,
                    border: isOpen ? "none" : `1px solid ${theme.border}`, fontSize: 18, fontWeight: 700,
                    transition: "all .2s ease",
                  }}>
                    {isOpen ? <Icon name="Minus" size={17} /> : <Icon name="Plus" size={17} />}
                  </span>
                </button>
                <div style={{ maxHeight: isOpen ? 320 : 0, overflow: "hidden", transition: "max-height .3s ease" }}>
                  <p style={{ padding: "0 22px 22px", color: theme.textDim, fontSize: 15, lineHeight: 1.65, margin: 0 }}>
                    {f.a}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default FAQ;
