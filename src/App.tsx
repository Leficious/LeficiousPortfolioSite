import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AmbientBackdrop } from "./components/AmbientBackdrop";
import { SignalAcquisition } from "./components/SignalAcquisition";
import { SiteNav } from "./components/SiteNav";
import { HomePage } from "./pages/HomePage";

const AboutPage = lazy(() => import("./pages/AboutPage").then((module) => ({ default: module.AboutPage })));
const GalleryPage = lazy(() => import("./pages/GalleryPage").then((module) => ({ default: module.GalleryPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const ProjectPage = lazy(() => import("./pages/ProjectPage").then((module) => ({ default: module.ProjectPage })));

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
  const [suppressInitialRouteReveal, setSuppressInitialRouteReveal] = useState(signalActive);
  const previousLocation = useRef({ pathname, hash });

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

  useEffect(() => {
    if (pathname !== "/") setSuppressInitialRouteReveal(false);
  }, [pathname]);

  useLayoutEffect(() => {
    const previous = previousLocation.current;
    previousLocation.current = { pathname, hash };

    if (!hash) {
      const returningFromSection = previous.pathname === pathname && Boolean(previous.hash);
      window.scrollTo({ top: 0, behavior: returningFromSection ? "smooth" : "instant" });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return (
    <div className={`relative min-h-screen ${signalActive ? "signal-intro-running" : ""} ${suppressInitialRouteReveal && pathname === "/" ? "suppress-initial-route-reveal" : ""}`}>
      <AmbientBackdrop />
      <SignalAcquisition active={signalActive} />
      <div className="relative z-10">
        <SiteNav />
        <div key={pathname} className={`route-stage ${supportsViewTransitions ? "" : "route-stage-fallback"}`}>
          <Suspense fallback={<div className="mx-auto min-h-[70vh] max-w-6xl px-6 py-24" aria-live="polite"><span className="sr-only">Loading page</span></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects/:slug" element={<ProjectPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
