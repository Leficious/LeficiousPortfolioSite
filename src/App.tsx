import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnimationEvent,
} from "react";
import { Link, Route, Routes, useLocation, type Location } from "react-router-dom";
import { AmbientBackdrop } from "./components/AmbientBackdrop";
import {
  AstrolabeCrest,
  AtelierHeaderRail,
  type AtelierSection,
} from "./components/AtelierChrome";
import { AtelierIntroCurtain, type IntroStage } from "./components/AtelierMotion";
import { SiteNav } from "./components/SiteNav";
import { markClientHydratedForPortals, useDeskParallax } from "./lib/atelierMotion";
import { useLanguage } from "./lib/language";
import { getProject } from "./lib/projects";
import { AboutPage } from "./pages/AboutPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

let projectPageLoaded = false;
const loadProjectPage = () =>
  import("./pages/ProjectPage").then((module) => {
    projectPageLoaded = true;
    return { default: module.ProjectPage };
  });
const ProjectPage = lazy(loadProjectPage);

const ORDERED_FOLIO_SLUGS = [
  "still-life",
  "an-echo-has-no-shape",
  "fallen-valkyrie",
  "starshore",
  "sacred-forest",
] as const;
const FOLIO_ROMAN = ["I", "II", "III", "IV", "V"] as const;

type TransitionKind =
  | "pan-right"
  | "pan-left"
  | "folio-open"
  | "folio-close"
  | "lang-swap";

type StagePhase =
  | { state: "idle" }
  | { state: "exiting"; kind: TransitionKind }
  | { state: "entering"; kind: TransitionKind };

function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, "") || "/";
}

function stripZhPrefix(pathname: string): string {
  const stripped = normalizePath(pathname).replace(/^\/zh(?=\/|$)/, "");
  return stripped || "/";
}

function getRoomOrder(cleanPath: string): number | null {
  if (cleanPath === "/") return 0;
  if (cleanPath.startsWith("/gallery")) return 1;
  if (cleanPath.startsWith("/about")) return 2;
  return null;
}

function classifyRouteTransition(fromPath: string, toPath: string): TransitionKind {
  const cleanFrom = stripZhPrefix(fromPath);
  const cleanTo = stripZhPrefix(toPath);

  if (cleanFrom === cleanTo) {
    return "lang-swap";
  }
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
  if (cleanTo.startsWith("/projects/") && cleanFrom.startsWith("/projects/")) {
    const fromSlug = cleanFrom.slice("/projects/".length);
    const toSlug = cleanTo.slice("/projects/".length);
    const fi = ORDERED_FOLIO_SLUGS.indexOf(fromSlug as (typeof ORDERED_FOLIO_SLUGS)[number]);
    const ti = ORDERED_FOLIO_SLUGS.indexOf(toSlug as (typeof ORDERED_FOLIO_SLUGS)[number]);
    if (fi !== -1 && ti !== -1 && fi !== ti) {
      return ti > fi ? "pan-right" : "pan-left";
    }
  }
  return "pan-right";
}

function getStageMotionClass(phase: StagePhase): string {
  if (phase.state === "idle") return "";
  if (phase.state === "exiting") {
    switch (phase.kind) {
      case "pan-right":
        return "stage-exit-left";
      case "pan-left":
        return "stage-exit-right";
      case "folio-open":
        return "stage-exit-folio-open";
      case "folio-close":
        return "stage-exit-folio-close";
      case "lang-swap":
        return "stage-exit-lang";
    }
  }
  switch (phase.kind) {
    case "pan-right":
      return "stage-enter-right";
    case "pan-left":
      return "stage-enter-left";
    case "folio-open":
      return "stage-enter-folio-open";
    case "folio-close":
      return "stage-enter-folio-close";
    case "lang-swap":
      return "stage-enter-lang";
  }
}

export function App() {
  const { isChinese, text, localizedPath } = useLanguage();
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState<Location>(location);
  const [stagePhase, setStagePhase] = useState<StagePhase>({ state: "idle" });
  const latestLocationRef = useRef<Location>(location);
  latestLocationRef.current = location;

  const exitTimerRef = useRef<number | null>(null);
  const enterSafetyTimerRef = useRef<number | null>(null);
  const pendingScrollResetRef = useRef<{ resetTop: boolean; hash: string } | null>(null);
  const previousSamePathHashRef = useRef<string>(location.hash);

  const [activeFolioSlug, setActiveFolioSlug] = useState<string>("reel");
  const [dialStep, setDialStep] = useState<number>(0);
  const [backdropReady, setBackdropReady] = useState(false);
  const [introStage, setIntroStage] = useState<IntroStage>("veiled");

  useDeskParallax();

  useEffect(() => {
    markClientHydratedForPortals();
    const timer = window.setTimeout(() => {
      void loadProjectPage();
    }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  const handleBackdropReady = useCallback(() => {
    setBackdropReady(true);
  }, []);

  const handleSelectFolio = useCallback((slug: string) => {
    setActiveFolioSlug(slug);
    setDialStep((prev) => prev + 1);
  }, []);

  const cleanDisplayed = normalizePath(displayedLocation.pathname);
  const cleanActual = normalizePath(location.pathname);
  const samePathname = cleanDisplayed === cleanActual;

  // Keep search/hash updates on the same pathname immediate (e.g. gallery filter tags & lightbox modal)
  useEffect(() => {
    if (samePathname && displayedLocation !== location) {
      setDisplayedLocation(location);
    }
  }, [samePathname, displayedLocation, location]);

  // Orchestrate crisp 2-beat live-DOM directional transitions across routes (zero raster-bitmap snap)
  useEffect(() => {
    if (samePathname) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      if (enterSafetyTimerRef.current) window.clearTimeout(enterSafetyTimerRef.current);
      setStagePhase({ state: "idle" });
      setDisplayedLocation(location);
      if (!location.hash && stripZhPrefix(cleanDisplayed) !== stripZhPrefix(cleanActual)) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      return;
    }

    const kind = classifyRouteTransition(cleanDisplayed, cleanActual);
    const exitMs = kind === "lang-swap" ? 110 : 155;

    setStagePhase({ state: "exiting", kind });

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
    }
    if (enterSafetyTimerRef.current) {
      window.clearTimeout(enterSafetyTimerRef.current);
      enterSafetyTimerRef.current = null;
    }

    const needProjectChunk =
      stripZhPrefix(cleanActual).startsWith("/projects/") && !projectPageLoaded
        ? loadProjectPage()
        : Promise.resolve();

    let cancelled = false;
    const minWait = new Promise<void>((resolve) => {
      exitTimerRef.current = window.setTimeout(resolve, exitMs);
    });

    void Promise.all([minWait, needProjectChunk]).then(() => {
      if (cancelled) return;
      const dest = latestLocationRef.current;
      const finalKind = classifyRouteTransition(cleanDisplayed, normalizePath(dest.pathname));
      pendingScrollResetRef.current = {
        resetTop: finalKind !== "lang-swap" && !dest.hash,
        hash: dest.hash,
      };
      setDisplayedLocation(dest);
      setStagePhase({ state: "entering", kind: finalKind });
      setDialStep((prev) => prev + 1);

      // Fallback safety cleanup slightly past 380ms enter duration in case tab is backgrounded
      enterSafetyTimerRef.current = window.setTimeout(() => {
        setStagePhase((prev) => (prev.state === "entering" ? { state: "idle" } : prev));
      }, 430);
    });

    return () => {
      cancelled = true;
    };
  }, [cleanActual, cleanDisplayed, location, samePathname]);

  // Reset scroll position strictly while stage opacity is 0 before Beat 2 paints frame 1
  useIsomorphicLayoutEffect(() => {
    const pending = pendingScrollResetRef.current;
    if (!pending) return;
    pendingScrollResetRef.current = null;

    if (pending.resetTop) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (pending.hash) {
      const target = document.getElementById(decodeURIComponent(pending.hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  }, [displayedLocation]);

  // Same-page hash anchor smooth scrolling (e.g. ProjectPage chapter index bar)
  useEffect(() => {
    if (!samePathname) return;
    const prevHash = previousSamePathHashRef.current;
    previousSamePathHashRef.current = location.hash;

    if (!location.hash) {
      if (prevHash) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const scrollToTarget = () => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
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
  }, [location.hash, samePathname]);

  const handleStageAnimationEnd = useCallback((event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    setStagePhase((prev) => {
      if (prev.state === "entering") {
        if (enterSafetyTimerRef.current) {
          window.clearTimeout(enterSafetyTimerRef.current);
          enterSafetyTimerRef.current = null;
        }
        return { state: "idle" };
      }
      return prev;
    });
  }, []);

  // Derive persistent header spec immediately from target `location.pathname` so the
  // sunlit-vellum carriage starts gliding at t=0ms the instant a top tab is clicked.
  const targetCleanPath = stripZhPrefix(cleanActual);
  const activeHeaderSection: AtelierSection = targetCleanPath.startsWith("/gallery")
    ? "gallery"
    : targetCleanPath.startsWith("/about")
      ? "about"
      : "atelier";

  const headerSpec = useMemo(() => {
    const gameResumeHref = isChinese
      ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
      : "/resume/Leficious_Technical_Game_Designer_Resume.pdf";
    const artResumeHref = isChinese
      ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
      : "/resume/Leficious_3D_Environment_Artist_Resume.pdf";
    const plaqueClass =
      "brass-plaque inline-flex h-[36px] cursor-pointer items-center gap-1.5 px-4 font-display text-[13px] font-bold tracking-[0.09em] whitespace-nowrap uppercase transition-colors xl:px-4.5 xl:text-[13.5px]";

    if (targetCleanPath === "/") {
      const isReelActive = activeFolioSlug === "reel";
      return {
        eyebrow: "LEFICIOUS",
        subtitle: text("Game, Level & Technical Designer", "游戏、关卡与技术设计师"),
        rightSlotKey: isReelActive ? "home-resume" : "home-reel",
        rightSlot: isReelActive ? (
          <a href={gameResumeHref} download className={plaqueClass}>
            <span>{text("Résumé (PDF)", "下载简历")}</span>
            <span aria-hidden="true">↓</span>
          </a>
        ) : (
          <button type="button" onClick={() => handleSelectFolio("reel")} className={plaqueClass}>
            <span aria-hidden="true" className="text-[11px]">▶</span>
            <span>{text("Master Reel", "年度集锦")}</span>
          </button>
        ),
      };
    }

    if (targetCleanPath.startsWith("/gallery")) {
      return {
        eyebrow: "LEFICIOUS",
        subtitle: text("3D Environments, Shaders & Tools", "3D 场景、程序化材质与工具"),
        rightSlotKey: "gallery-resume",
        rightSlot: (
          <a href={artResumeHref} download className={plaqueClass}>
            <span>{text("3D Art Résumé", "下载简历")}</span>
            <span aria-hidden="true">↓</span>
          </a>
        ),
      };
    }

    if (targetCleanPath.startsWith("/about")) {
      return {
        eyebrow: "LEFICIOUS",
        subtitle: text("Little Tokyo, LA · USC SCA & Gnomon", "洛杉矶小东京 · 南加大 & Gnomon"),
        rightSlotKey: "about-resume",
        rightSlot: (
          <a href={gameResumeHref} download className={plaqueClass}>
            <span>{text("Résumé (PDF)", "下载简历")}</span>
            <span aria-hidden="true">↓</span>
          </a>
        ),
      };
    }

    const projectMatch = targetCleanPath.match(/^\/projects\/([^/]+)/);
    if (projectMatch) {
      const slug = projectMatch[1];
      const project = getProject(slug);
      const folioIdx = ORDERED_FOLIO_SLUGS.indexOf(slug as (typeof ORDERED_FOLIO_SLUGS)[number]);
      const roman = folioIdx >= 0 ? FOLIO_ROMAN[folioIdx] : "I";
      return {
        eyebrow: "LEFICIOUS",
        subtitle: project
          ? `${text("Case Folio", "项目拆解卷")} ${roman} / V · ${project.year}`
          : text("Atelier Archive", "作品档案馆"),
        rightSlotKey: "project-back",
        rightSlot: (
          <Link to={localizedPath("/")} className={plaqueClass}>
            <span aria-hidden="true">←</span>
            <span>{text("Atelier Desk", "返回案台")}</span>
          </Link>
        ),
      };
    }

    return {
      eyebrow: "LEFICIOUS",
      subtitle: text("Atelier Archive", "作品档案馆"),
      rightSlotKey: "fallback-back",
      rightSlot: (
        <Link to={localizedPath("/")} className={plaqueClass}>
          <span aria-hidden="true">←</span>
          <span>{text("Atelier Desk", "返回案台")}</span>
        </Link>
      ),
    };
  }, [activeFolioSlug, handleSelectFolio, isChinese, localizedPath, targetCleanPath, text]);

  const effectiveRoutesLocation = samePathname ? location : displayedLocation;
  const stageMotionClass = getStageMotionClass(stagePhase);

  const homeElement = (
    <HomePage activeFolioSlug={activeFolioSlug} onSelectFolioSlug={handleSelectFolio} />
  );

  return (
    <div className="relative min-h-screen">
      <AtelierIntroCurtain
        backdropReady={backdropReady}
        pathname={location.pathname}
        onStageChange={setIntroStage}
      />
      <AmbientBackdrop
        dialStep={dialStep}
        onBackdropReady={handleBackdropReady}
        dustActive={introStage !== "veiled"}
      />
      <SiteNav
        activeFolioSlug={activeFolioSlug}
        onSelectFolioSlug={handleSelectFolio}
        detentStep={dialStep}
      />

      <div className="relative z-10 flex min-h-[calc(100vh-56px)] flex-col lg:min-h-screen lg:pl-[88px]">
        {/* Persistent Top Archival Header Rail — never unmounts across route switches */}
        <div className="px-4 pt-5 sm:px-8 lg:px-10 lg:pt-6 xl:pl-11 xl:pr-28">
          <AtelierHeaderRail
            eyebrow={headerSpec.eyebrow}
            subtitle={headerSpec.subtitle}
            activeSectionOverride={activeHeaderSection}
            rightSlot={headerSpec.rightSlot}
            rightSlotKey={headerSpec.rightSlotKey}
          />
        </div>

        <div
          onAnimationEnd={handleStageAnimationEnd}
          className={`route-stage flex flex-1 flex-col ${stageMotionClass}`}
        >
          <Suspense
            fallback={
              <div
                className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-6 py-24"
                aria-live="polite"
              >
                <AstrolabeCrest calibrating interactive={false} className="h-14 w-14 opacity-80" />
                <span className="sr-only">{text("Opening folio", "正在展开档案")}</span>
              </div>
            }
          >
            <Routes location={effectiveRoutesLocation}>
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
