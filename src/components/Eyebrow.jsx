/* Small section eyebrow label */
function Eyebrow({ children, theme, center }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, justifyContent: center ? "center" : "flex-start" }}>
      <span style={{ width: 26, height: 2, background: theme.gold }} />
      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.gold }}>{children}</span>
    </div>
  );
}

export default Eyebrow;
