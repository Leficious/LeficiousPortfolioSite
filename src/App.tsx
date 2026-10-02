import { lazy, Suspense, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AmbientBackdrop } from "./components/AmbientBackdrop";
import { SiteNav } from "./components/SiteNav";
import { HomePage } from "./pages/HomePage";
import { useLanguage } from "./lib/language";

const AboutPage = lazy(() => import("./pages/AboutPage").then((module) => ({ default: module.AboutPage })));
const GalleryPage = lazy(() => import("./pages/GalleryPage").then((module) => ({ default: module.GalleryPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const ProjectPage = lazy(() => import("./pages/ProjectPage").then((module) => ({ default: module.ProjectPage })));

export function App() {
  const { text } = useLanguage();
  const { pathname, hash } = useLocation();
  const previousLocation = useRef({ pathname, hash });
  useEffect(() => {
    const previous = previousLocation.current;
    previousLocation.current = { pathname, hash };

    if (!hash) {
      const returningFromSection = previous.pathname === pathname && Boolean(previous.hash);
      window.scrollTo({ top: 0, behavior: returningFromSection ? "smooth" : "instant" });
      return;
    }

    const scrollToTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return false;
      target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      return true;
    };
    if (scrollToTarget()) return;
    const observer = new MutationObserver(() => { if (scrollToTarget()) observer.disconnect(); });
    observer.observe(document.getElementById("root")!, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, hash]);

  return (
    <div className="relative min-h-screen">
      <AmbientBackdrop />
      <div className="relative z-10">
        <SiteNav />
        <div key={pathname} className="route-stage">
          <Suspense fallback={<div className="mx-auto min-h-[70vh] max-w-6xl px-6 py-24" aria-live="polite"><span className="sr-only">{text("Loading page", "页面加载中")}</span></div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects/:slug" element={<ProjectPage />} />
              <Route path="/zh" element={<HomePage />} />
              <Route path="/zh/gallery" element={<GalleryPage />} />
              <Route path="/zh/about" element={<AboutPage />} />
              <Route path="/zh/projects/:slug" element={<ProjectPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
