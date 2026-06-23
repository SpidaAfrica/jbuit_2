import { useState, useEffect, useCallback } from "react";
import { THEMES } from "./theme/themes";
import HomePage from "./pages/HomePage";
import CoursePage from "./pages/CoursePage";

export default function App() {
  const [mode, setMode] = useState("dark");
  const theme = THEMES[mode];

  // Simple routing: show the course page at /course (or when navigated to).
  const [route, setRoute] = useState(() =>
    typeof window !== "undefined" && window.location.pathname.replace(/\/$/, "").endsWith("/course")
      ? "course"
      : "home"
  );

  const goCourse = useCallback(() => {
    window.history.pushState({}, "", "/course");
    setRoute("course");
    window.scrollTo(0, 0);
  }, []);
  const goHome = useCallback(() => {
    window.history.pushState({}, "", "/");
    setRoute("home");
    window.scrollTo(0, 0);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onPop = () =>
      setRoute(window.location.pathname.replace(/\/$/, "").endsWith("/course") ? "course" : "home");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  if (route === "course") {
    return <CoursePage theme={theme} mode={mode} priceLabel="₦50,000" onBack={goHome} />;
  }

  return <HomePage theme={theme} mode={mode} setMode={setMode} goCourse={goCourse} />;
}
