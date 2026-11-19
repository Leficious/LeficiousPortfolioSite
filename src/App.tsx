import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AmbientBackdrop } from "./components/AmbientBackdrop";
import { useDeskParallax } from "./lib/atelierMotion";
import { SiteNav } from "./components/SiteNav";
import { AboutPage } from "./pages/AboutPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useLanguage } from "./lib/language";

const loadProjectPage = () => import("./pages/ProjectPage").then((module) => ({ default: module.ProjectPage }));
const ProjectPage = lazy(loadProjectPage);

export function App() {
  const { text } = useLanguage();
  const { pathname, hash } = useLocation();
  const previousLocation = useRef({ pathname, hash });
  const [activeFolioSlug, setActiveFolioSlug] = useState<string>("still-life");
  const [dialStep, setDialStep] = useState<number>(0);

  useDeskParallax();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProjectPage();
    }, 350);
    return () => window.clearTimeout(timer);
  }, []);

  const handleSelectFolio = useCallback((slug: string) => {
    setActiveFolioSlug(slug);
    setDialStep((prev) => prev + 1);
  }, []);

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
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
      return true;
    };
    if (scrollToTarget()) return;
    const observer = new MutationObserver(() => {
      if (scrollToTarget()) observer.disconnect();
    });
    observer.observe(document.getElementById("root")!, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, hash]);

  const homeElement = (
    <HomePage activeFolioSlug={activeFolioSlug} onSelectFolioSlug={handleSelectFolio} />
  );

  return (
    <div className="relative min-h-screen">
      <AmbientBackdrop dialStep={dialStep} />
      <SiteNav activeFolioSlug={activeFolioSlug} onSelectFolioSlug={handleSelectFolio} />

      <div className="relative z-10 lg:pl-[76px]">
        <div key={pathname} className="route-stage">
          <Suspense
            fallback={
              <div className="mx-auto min-h-[70vh] max-w-6xl px-6 py-24" aria-live="polite">
                <span className="sr-only">{text("Opening folio", "正在展开档案")}</span>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={homeElement} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects/:slug" element={<ProjectPage />} />
              <Route path="/zh" element={homeElement} />
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
