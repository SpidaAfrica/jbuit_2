/* Labeled input with error state */
function Field({ theme, label, value, onChange, placeholder, type = "text", error }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: theme.textDim, display: "block", marginBottom: 7 }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: theme.name === "dark" ? "rgba(0,0,0,0.2)" : "#fff", border: `1px solid ${error ? "#E0405C" : theme.border}`, borderRadius: 12, padding: "13px 15px", color: theme.text, fontSize: 15, outline: "none" }}
        onFocus={(e) => (e.target.style.borderColor = theme.gold)} onBlur={(e) => (e.target.style.borderColor = error ? "#E0405C" : theme.border)} />
      {error && <div style={{ color: "#E0405C", fontSize: 12.5, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

export default Field;
