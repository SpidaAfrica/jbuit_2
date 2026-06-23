import { useState, useEffect, useRef } from "react";

/* Background carousel for the hero.
   Cross-fades between slides (web / mobile / AI). Each slide can play a
   real video — drop files into /public/hero/ and list them below. If a
   video is missing or can't play, the slide shows a polished animated
   gradient so the hero always looks intentional, never broken. */

const SLIDES = [
  { key: "web",    label: "Web Apps",    video: "/hero/web.mp4",    grad: ["#1A1270", "#4632D4", "#0C006E"] },
  { key: "mobile", label: "Mobile Apps", video: "/hero/mobile.mp4", grad: ["#0C006E", "#6E5BFF", "#1A1270"] },
  { key: "ai",     label: "AI Systems",  video: "/hero/ai.mp4",     grad: ["#08003A", "#4632D4", "#6E5BFF"] },
];

function HeroCarousel({ mode }) {
  const [active, setActive] = useState(0);
  const [canPlay, setCanPlay] = useState({}); // key -> bool (video usable)
  const timer = useRef(null);

  // Rotate slides every 5s
  useEffect(() => {
    timer.current = setInterval(() => {
      setActive((a) => (a + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer.current);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }} aria-hidden>
      {SLIDES.map((s, i) => {
        const isActive = i === active;
        const [c1, c2, c3] = s.grad;
        return (
          <div
            key={s.key}
            style={{
              position: "absolute", inset: 0,
              opacity: isActive ? 1 : 0,
              transition: "opacity 1.4s ease",
            }}
          >
            {/* animated gradient fallback (always present, behind video) */}
            <div
              className="jb-hero-grad"
              style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(130deg, ${c1}, ${c2}, ${c3}, ${c1})`,
                backgroundSize: "300% 300%",
                animation: "jbGrad 16s ease infinite",
              }}
            />
            {/* video layer — only shown if it can actually play */}
            <video
              src={s.video}
              muted
              loop
              playsInline
              preload="auto"
              autoPlay={isActive}
              onCanPlay={() => setCanPlay((m) => ({ ...m, [s.key]: true }))}
              onError={() => setCanPlay((m) => ({ ...m, [s.key]: false }))}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover",
                opacity: canPlay[s.key] ? 1 : 0,
                transition: "opacity .6s ease",
              }}
            />
          </div>
        );
      })}

      {/* dark overlay so hero text stays readable over any slide */}
      <div style={{
        position: "absolute", inset: 0,
        background: mode === "dark"
          ? "linear-gradient(180deg, rgba(5,0,42,0.72), rgba(5,0,42,0.86))"
          : "linear-gradient(180deg, rgba(8,0,58,0.62), rgba(8,0,58,0.78))",
      }} />

      {/* slide indicators */}
      <div style={{ position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2 }}>
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(i)}
            aria-label={s.label}
            style={{
              width: i === active ? 26 : 9, height: 9, borderRadius: 100, border: "none", cursor: "pointer",
              background: i === active ? "#FFC107" : "rgba(255,255,255,0.45)",
              transition: "all .3s ease", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
