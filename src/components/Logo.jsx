/* JBUIT wordmark — text only */
function Logo({ theme, size = 34 }) {
  return (
    <span style={{
      fontWeight: 800,
      letterSpacing: "0.18em",
      fontSize: size * 0.62,
      color: theme.text,
      lineHeight: 1,
      userSelect: "none",
    }}>
      JBUIT
    </span>
  );
}

export default Logo;
