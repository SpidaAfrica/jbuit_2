import { useState } from "react";

/* Floating WhatsApp widget.
   A bottom-right button that opens a small card, then launches WhatsApp
   with a pre-filled message to your business number.

   Props:
     phone   - your WhatsApp number in international format, digits only,
               no "+" or spaces. e.g. Nigeria: "2348012345678"
     name    - the name shown in the little chat header (default "JBUIT")
     message - the pre-filled message the user sends (optional)
*/
function WhatsAppWidget({
  phone = "2348012345678",
  name = "JBUIT",
  message = "Hi JBUIT! I'd like to know more about your services.",
}) {
  const [open, setOpen] = useState(false);

  const WHATSAPP_GREEN = "#25D366";
  const link = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  const WhatsAppIcon = ({ size = 30, color = "#fff" }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill={color} aria-hidden>
      <path d="M16.003 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.257.59 4.46 1.71 6.405L3.2 28.8l6.57-1.72a12.74 12.74 0 0 0 6.233 1.59h.005c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.052A12.71 12.71 0 0 0 16.003 3.2zm0 23.36h-.004a10.6 10.6 0 0 1-5.4-1.48l-.388-.23-4.003 1.05 1.07-3.9-.253-.4a10.56 10.56 0 0 1-1.62-5.64c0-5.87 4.78-10.65 10.66-10.65a10.6 10.6 0 0 1 7.53 3.123 10.56 10.56 0 0 1 3.12 7.535c0 5.872-4.78 10.652-10.66 10.652zm5.84-7.976c-.32-.16-1.894-.935-2.188-1.042-.293-.107-.507-.16-.72.16-.214.32-.826 1.042-1.013 1.256-.187.213-.373.24-.693.08-.32-.16-1.352-.498-2.575-1.59-.952-.848-1.594-1.896-1.78-2.216-.187-.32-.02-.493.14-.652.144-.143.32-.373.48-.56.16-.187.213-.32.32-.533.107-.214.053-.4-.027-.56-.08-.16-.72-1.735-.987-2.376-.26-.624-.524-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.094-1.12 2.668 0 1.574 1.146 3.095 1.306 3.308.16.214 2.255 3.443 5.464 4.828.764.33 1.36.527 1.824.674.767.244 1.464.21 2.016.127.615-.092 1.894-.774 2.16-1.522.267-.747.267-1.388.187-1.522-.08-.133-.293-.213-.613-.373z"/>
    </svg>
  );

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 1000, fontFamily: "'Inter',system-ui,-apple-system,sans-serif" }}>
      {/* Pop-up card */}
      {open && (
        <div
          style={{
            position: "absolute", bottom: 78, right: 0, width: 300,
            background: "#fff", borderRadius: 16, overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            animation: "waPop .25s ease",
          }}
        >
          {/* header */}
          <div style={{ background: "#0C006E", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: WHATSAPP_GREEN, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <WhatsAppIcon size={24} />
            </div>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>{name}</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: WHATSAPP_GREEN, display: "inline-block" }} />
                Typically replies instantly
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{ marginLeft: "auto", background: "transparent", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: 0 }}
            >
              ×
            </button>
          </div>

          {/* body */}
          <div style={{ background: "#E5DDD5", padding: "18px 16px" }}>
            <div style={{ background: "#fff", borderRadius: "0 12px 12px 12px", padding: "12px 14px", fontSize: 14, color: "#222", lineHeight: 1.5, boxShadow: "0 1px 1px rgba(0,0,0,0.08)", maxWidth: "92%" }}>
              👋 Hi there! How can we help you today? Tap below to chat with us on WhatsApp.
            </div>
          </div>

          {/* CTA */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              background: WHATSAPP_GREEN, color: "#fff", textDecoration: "none",
              padding: "15px", fontWeight: 700, fontSize: 15,
            }}
          >
            <WhatsAppIcon size={22} /> Start Chat
          </a>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Chat on WhatsApp"
        style={{
          width: 60, height: 60, borderRadius: "50%", border: "none", cursor: "pointer",
          background: WHATSAPP_GREEN, display: "grid", placeItems: "center",
          boxShadow: "0 8px 24px rgba(37,211,102,0.45)",
          transition: "transform .2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? (
          <span style={{ color: "#fff", fontSize: 26, lineHeight: 1 }}>×</span>
        ) : (
          <WhatsAppIcon size={32} />
        )}
      </button>

      <style>{`
        @keyframes waPop {
          from { opacity: 0; transform: translateY(10px) scale(.96); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}

export default WhatsAppWidget;
