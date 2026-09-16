import { useEffect, useLayoutEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AmbientBackdrop } from "./components/AmbientBackdrop";
import { SignalAcquisition } from "./components/SignalAcquisition";
import { SiteNav } from "./components/SiteNav";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { GalleryPage } from "./pages/GalleryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectPage } from "./pages/ProjectPage";

export function App() {
  const { pathname, hash } = useLocation();
  const supportsViewTransitions = typeof document !== "undefined" && "startViewTransition" in document;
  const [signalActive, setSignalActive] = useState(() => {
    if (typeof window === "undefined" || pathname !== "/") return false;

    try {
      return (
        sessionStorage.getItem("signal-acquisition-seen") !== "1" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch {
      return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  });

  useEffect(() => {
    if (!signalActive) return;

    try {
      sessionStorage.setItem("signal-acquisition-seen", "1");
    } catch {
      // Session storage can be unavailable in privacy-restricted contexts.
    }

    const timer = window.setTimeout(() => setSignalActive(false), 1300);
    return () => window.clearTimeout(timer);
  }, [signalActive]);

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <div className={`relative min-h-screen ${signalActive ? "signal-intro-running" : ""}`}>
      <AmbientBackdrop />
      <SignalAcquisition active={signalActive} />
      <div className="relative z-10">
        <SiteNav />
        <div key={pathname} className={`route-stage ${supportsViewTransitions ? "" : "route-stage-fallback"}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
