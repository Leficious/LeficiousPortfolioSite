import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AmbientBackdrop } from "./components/AmbientBackdrop";
import { AtelierIntroCurtain, type IntroStage } from "./components/AtelierMotion";
import { useDeskParallax } from "./lib/atelierMotion";
import { SiteNav } from "./components/SiteNav";
import { AboutPage } from "./pages/AboutPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useLanguage } from "./lib/language";

let projectPageLoaded = false;
const loadProjectPage = () =>
  import("./pages/ProjectPage").then((module) => {
    projectPageLoaded = true;
    return { default: module.ProjectPage };
  });
const ProjectPage = lazy(loadProjectPage);

function stripZhPrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/zh(?=\/|$)/, "");
  return stripped || "/";
}

function getRoomOrder(cleanPath: string): number | null {
  if (cleanPath === "/") return 0;
  if (cleanPath.startsWith("/gallery")) return 1;
  if (cleanPath.startsWith("/about")) return 2;
  return null;
}

function classifyRouteTransition(fromPath: string, toPath: string): string {
  const cleanFrom = stripZhPrefix(fromPath);
  const cleanTo = stripZhPrefix(toPath);

  if (cleanTo.startsWith("/projects/") && !cleanFrom.startsWith("/projects/")) {
    return "folio-open";
  }
  if (!cleanTo.startsWith("/projects/") && cleanFrom.startsWith("/projects/")) {
    return "folio-close";
  }

  const fromOrder = getRoomOrder(cleanFrom);
  const toOrder = getRoomOrder(cleanTo);
  if (fromOrder !== null && toOrder !== null && fromOrder !== toOrder) {
    return toOrder > fromOrder ? "pan-right" : "pan-left";
  }
  return "folio-swap";
}

type ViewTransitionHandle = {
  finished: Promise<void>;
  skipTransition: () => void;
};

export function App() {
  const { text } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, hash } = location;
  const previousLocation = useRef({ pathname, hash });
  const activeTransitionRef = useRef<ViewTransitionHandle | null>(null);
  const [activeFolioSlug, setActiveFolioSlug] = useState<string>("reel");
  const [dialStep, setDialStep] = useState<number>(0);
  const [backdropReady, setBackdropReady] = useState(false);
  const [introStage, setIntroStage] = useState<IntroStage>("veiled");

  useDeskParallax();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadProjectPage();
    }, 550);
    return () => window.clearTimeout(timer);
  }, []);

  const handleBackdropReady = useCallback(() => {
    setBackdropReady(true);
  }, []);

  const handleSelectFolio = useCallback((slug: string) => {
    setActiveFolioSlug(slug);
    setDialStep((prev) => prev + 1);
  }, []);

  // Intercept internal route link clicks to run true, direction-aware View Transitions
  // (BrowserRouter ignores React Router's <Link viewTransition> prop without a Data Router).
  useEffect(() => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => ViewTransitionHandle;
    };

    const onClickCapture = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self") ||
        anchor.origin !== window.location.origin
      ) {
        return;
      }

      const destPath = anchor.pathname.replace(/\/+$/, "") || "/";
      const curPath = window.location.pathname.replace(/\/+$/, "") || "/";

      // Let same-pathname hash jumps or search-param gallery modal opens run natively without full-stage fade
      if (destPath === curPath) return;

      if (
        !doc.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const nextDestination = `${anchor.pathname}${anchor.search}${anchor.hash}`;
      const vtKind = classifyRouteTransition(curPath, destPath);

      const runTransition = () => {
        if (activeTransitionRef.current) {
          try {
            activeTransitionRef.current.skipTransition();
          } catch {
            // Ignore already-settled transition handles
          }
          activeTransitionRef.current = null;
        }

        document.documentElement.dataset.vtKind = vtKind;

        const vt = doc.startViewTransition!(() => {
          flushSync(() => {
            navigate(nextDestination);
          });
          if (!anchor.hash) {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
        });

        activeTransitionRef.current = vt;
        void vt.finished.finally(() => {
          if (activeTransitionRef.current === vt) {
            activeTransitionRef.current = null;
            delete document.documentElement.dataset.vtKind;
          }
        });
      };

      // Guarantee lazy ProjectPage chunk is already in memory before snapshotting
      if (stripZhPrefix(destPath).startsWith("/projects/") && !projectPageLoaded) {
        void loadProjectPage().then(runTransition, runTransition);
      } else {
        runTransition();
      }
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [navigate]);

  useEffect(() => {
    const previous = previousLocation.current;
    previousLocation.current = { pathname, hash };

    if (!hash) {
      const returningFromSection = previous.pathname === pathname && Boolean(previous.hash);
      if (returningFromSection) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (!activeTransitionRef.current) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
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
      <AtelierIntroCurtain
        backdropReady={backdropReady}
        pathname={pathname}
        onStageChange={setIntroStage}
      />
      <AmbientBackdrop
        dialStep={dialStep}
        onBackdropReady={handleBackdropReady}
        dustActive={introStage !== "veiled"}
      />
      <SiteNav activeFolioSlug={activeFolioSlug} onSelectFolioSlug={handleSelectFolio} />

      <div className="relative z-10 lg:pl-[88px]">
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
