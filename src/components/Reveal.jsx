import { useState, useEffect, useRef } from "react";

/* Scroll-reveal wrapper */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVis(true), { threshold: 0.15 });
    if (el) io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: `all .7s ${delay}s cubic-bezier(.2,.7,.2,1)` }}>
      {children}
    </div>
  );
}


export default Reveal;
