import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { isClientHydratedForPortals } from "../lib/atelierMotion";
import { useLanguage } from "../lib/language";
import { B04Crest, LeficiousWordmark, type B04CrestProps } from "./BrandMark";

/**
 * B-04 Cathedral Monolith, Detached 3-Blade Gothic Wings & Victorian Volute Crest.
 */
export function AstrolabeCrest({
  className = "h-11 w-11",
  tone = "gilt",
  interactive = true,
  ...rest
}: B04CrestProps) {
  return <B04Crest className={className} tone={tone} interactive={interactive} {...rest} />;
}

/**
 * Airy, precision-beveled vector brass L-corner mounts (~88% open negative space,
 * zero dense raster noise, crisp at every zoom level).
 */
export function BrassCornerClasps({ sizeClass = "h-7 w-7 sm:h-8 sm:w-8" }: { sizeClass?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradId = `bc-grad-${uid}`;

  const Clasp = ({ rotate, pos }: { rotate: string; pos: string }) => (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={`absolute ${pos} ${rotate} ${sizeClass} [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.82))]`}
    >
      <path d="M0 32 V0 H32 L28.8 3.2 H3.2 V28.8 Z" fill={`url(#${gradId})`} />
      <path d="M0.5 31 V0.5 H31" stroke="#fff4da" strokeWidth="0.7" opacity="0.75" />
      <path d="M3.2 14.5 A11.3 11.3 0 0 0 14.5 3.2" stroke={`url(#${gradId})`} strokeWidth="1.1" opacity="0.9" />
      <polygon points="0,0 5.6,0 0,5.6" fill="#fff0cc" opacity="0.85" />
      <circle cx="24.5" cy="1.6" r="0.9" fill="#2a190b" />
      <circle cx="1.6" cy="24.5" r="0.9" fill="#2a190b" />
    </svg>
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 select-none">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7e3ba" />
            <stop offset="52%" stopColor="#d4ad73" />
            <stop offset="100%" stopColor="#8c6330" />
          </linearGradient>
        </defs>
      </svg>
      <Clasp pos="-left-[1px] -top-[1px]" rotate="rotate-0" />
      <Clasp pos="-right-[1px] -top-[1px]" rotate="rotate-90" />
      <Clasp pos="-bottom-[1px] -right-[1px]" rotate="rotate-180" />
      <Clasp pos="-bottom-[1px] -left-[1px]" rotate="-rotate-90" />
    </div>
  );
}

/**
 * Clean 19th-century Chiswick-Press stepped plate-mark corner spandrels.
 * Uses only 2 open architectural strokes + 1 tiny diamond finial so corners stay
 * light, crisp, and breathable even at small card sizes.
 */
export function FolioCorners({
  tone = "parchment",
  inset = "inset-2.5 sm:inset-3.5",
  sizeClass = "h-7 w-7 sm:h-8 sm:w-8",
}: {
  tone?: "parchment" | "slate";
  inset?: string;
  sizeClass?: string;
}) {
  const isParchment = tone === "parchment";
  const stroke = isParchment ? "#704e26" : "#d8b47c";
  const accent = isParchment ? "#8a181a" : "#f0d5a3";

  const Corner = ({ rotate }: { rotate: string }) => (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`${sizeClass} ${rotate}`} fill="none">
      <path d="M0.6 26 V0.6 H26" stroke={stroke} strokeWidth="1.2" />
      <path d="M4.6 15.5 V7.6 H7.6 V4.6 H15.5" stroke={stroke} strokeWidth="0.95" opacity="0.82" />
      <polygon points="4.6,2.8 6.4,4.6 4.6,6.4 2.8,4.6" fill={accent} />
    </svg>
  );

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${inset}`}>
      <div
        className="absolute inset-0 border"
        style={{
          borderColor: isParchment ? "rgba(112, 78, 38, 0.32)" : "rgba(216, 180, 124, 0.26)",
        }}
      />
      <div className="absolute left-0 top-0"><Corner rotate="rotate-0" /></div>
      <div className="absolute right-0 top-0"><Corner rotate="rotate-90" /></div>
      <div className="absolute right-0 bottom-0"><Corner rotate="rotate-180" /></div>
      <div className="absolute left-0 bottom-0"><Corner rotate="-rotate-90" /></div>
    </div>
  );
}

/**
 * Authentic photorealistic Deep-Crimson Melted Sealing-Wax Stamp (`crimson-wax-seal.webp`).
 */
export function CrimsonStamp({
  className = "h-12 w-12",
  stamped = false,
}: {
  label?: string;
  className?: string;
  stamped?: boolean;
}) {
  return (
    <img
      src="/ornaments/crimson-wax-seal.webp"
      alt=""
      aria-hidden="true"
      width="96"
      height="96"
      decoding="async"
      className={`-rotate-2 shrink-0 select-none object-contain [filter:drop-shadow(0_5px_10px_rgba(0,0,0,0.68))_drop-shadow(0_1.5px_2px_rgba(0,0,0,0.86))] ${
        stamped ? "animate-stamp-press" : ""
      } ${className}`}
    />
  );
}

/**
 * Taut burnished-brass suspension wires + recessed brass grommet eyelets + central melted
 * crimson wax seal, locked rigidly to the folio header (zero wobble, exact 1:1 SVG aspect,
 * and 7.4px clear below the FolioCorners top rule).
 */
export function BrassPinThreads({ animKey }: { animKey?: string }) {
  void animKey;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const wireGradId = `wire-g-${uid}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-30 mx-auto -mb-[29px] h-[51px] w-[300px] select-none sm:-mb-[38px] sm:h-[68px] sm:w-[400px]"
    >
      <svg
        viewBox="0 0 400 68"
        fill="none"
        className="h-full w-full overflow-visible [filter:drop-shadow(0_1.5px_1.2px_rgba(0,0,0,0.45))]"
      >
        <defs>
          <linearGradient id={wireGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c79c5e" />
            <stop offset="50%" stopColor="#f2d7a4" />
            <stop offset="100%" stopColor="#c79c5e" />
          </linearGradient>
        </defs>

        {/* Taut brass suspension wires from beneath the wax seal out to the vellum grommets */}
        <line x1="200" y1="24" x2="28" y2="60" stroke={`url(#${wireGradId})`} strokeWidth="1.45" />
        <line x1="200" y1="24" x2="372" y2="60" stroke={`url(#${wireGradId})`} strokeWidth="1.45" />

        {/* Left & right sculpted brass grommet eyelets (cleanly below FolioCorners top rule) */}
        <circle cx="28" cy="60" r="4.2" fill="#d8b274" stroke="#5c3e1b" strokeWidth="0.9" />
        <circle cx="28" cy="60" r="2.1" fill="#14100c" />
        <circle cx="372" cy="60" r="4.2" fill="#d8b274" stroke="#5c3e1b" strokeWidth="0.9" />
        <circle cx="372" cy="60" r="2.1" fill="#14100c" />
      </svg>

      <CrimsonStamp className="absolute left-1/2 top-[2px] z-10 h-11 w-11 -translate-x-1/2 rotate-0 sm:h-14 sm:w-14" />
    </div>
  );
}

/**
 * Clean, airy horological & editorial divider rule (zero muddy raster centerpiece).
 */
export function BrassRule({
  tone = "parchment",
  ornate = false,
  className = "",
}: {
  tone?: "parchment" | "slate";
  ornate?: boolean;
  className?: string;
}) {
  const isParchment = tone === "parchment";
  const stroke = isParchment ? "#755228" : "#d8b47c";
  const gem = isParchment ? "#8a181a" : "#f0d5a3";

  if (ornate) {
    return (
      <div aria-hidden="true" className={`flex items-center gap-3 ${className}`}>
        <span
          className={`h-px flex-1 ${
            isParchment
              ? "bg-gradient-to-r from-transparent via-[#755228]/50 to-[#755228]/85"
              : "bg-gradient-to-r from-transparent via-[#d4ad73]/45 to-[#e5c58d]/85"
          }`}
        />

        <svg viewBox="0 0 92 16" fill="none" className="h-4 w-[92px] shrink-0 overflow-visible">
          <line x1="0" y1="8" x2="26" y2="8" stroke={stroke} strokeWidth="1" opacity="0.8" />
          <line x1="66" y1="8" x2="92" y2="8" stroke={stroke} strokeWidth="1" opacity="0.8" />
          <polygon points="18,8 21,5.6 24,8 21,10.4" fill={stroke} opacity="0.85" />
          <polygon points="68,8 71,5.6 74,8 71,10.4" fill={stroke} opacity="0.85" />
          <polygon points="30,8 46,1.6 62,8 46,14.4" stroke={stroke} strokeWidth="1.15" />
          <circle cx="46" cy="8" r="3.6" stroke={stroke} strokeWidth="0.95" opacity="0.85" />
          <polygon points="46,5.8 48.2,8 46,10.2 43.8,8" fill={gem} />
        </svg>

        <span
          className={`h-px flex-1 ${
            isParchment
              ? "bg-gradient-to-l from-transparent via-[#755228]/50 to-[#755228]/85"
              : "bg-gradient-to-l from-transparent via-[#d4ad73]/45 to-[#e5c58d]/85"
          }`}
        />
      </div>
    );
  }

  const line = isParchment ? "bg-[#755228]/42" : "bg-warm/38";

  return (
    <div aria-hidden="true" className={`flex items-center gap-2.5 ${className}`}>
      <span className={`h-px flex-1 ${line}`} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: stroke }} />
      <span className="h-2 w-2 rotate-45 border" style={{ borderColor: stroke, backgroundColor: gem }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: stroke }} />
      <span className={`h-px flex-1 ${line}`} />
    </div>
  );
}

export type AtelierSection = "atelier" | "gallery" | "about";

const TAB_OUTER_CLIP =
  "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)";
const TAB_INNER_CLIP =
  "polygon(5.12px 0, calc(100% - 5.12px) 0, 100% 5.12px, 100% calc(100% - 5.12px), calc(100% - 5.12px) 100%, 5.12px 100%, 0 calc(100% - 5.12px), 0 5.12px)";

/**
 * Persistent top Victorian Archival Header Rail shared across Atelier, Gallery, Project, and Dossier routes.
 * Uses a dual-layer sliding sunlit-vellum carriage + synchronized `clip-path: inset(...)` dark-ink mask
 * so clicking between top tabs glides smoothly across the rail with crisp text contrast at every millisecond
 * and 0.00px end-of-animation snap.
 */
export function AtelierHeaderRail({
  eyebrow = "LEFICIOUS",
  subtitle,
  activeSectionOverride,
  rightSlot,
  rightSlotKey,
  maxWidthClass = "max-w-[1380px]",
}: {
  eyebrow?: string;
  subtitle: string;
  activeSectionOverride?: AtelierSection;
  rightSlot?: ReactNode;
  rightSlotKey?: string;
  maxWidthClass?: string;
}) {
  const { pathname } = useLocation();
  const { language, text, localizedPath } = useLanguage();

  const cleanPath = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  const derivedSection: AtelierSection =
    cleanPath.startsWith("/gallery") ? "gallery" : cleanPath.startsWith("/about") ? "about" : "atelier";
  const activeSection = activeSectionOverride ?? derivedSection;

  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<AtelierSection, HTMLAnchorElement | null>>({
    atelier: null,
    gallery: null,
    about: null,
  });

  const [carriage, setCarriage] = useState<{
    left: number;
    width: number;
    navWidth: number;
    animate: boolean;
  } | null>(null);
  const prevSectionRef = useRef<AtelierSection>(activeSection);

  const measureCarriage = useCallback(
    (animate: boolean) => {
      const nav = navRef.current;
      const activeEl = tabRefs.current[activeSection];
      if (!nav || !activeEl) return;
      const navWidth = nav.offsetWidth;
      const width = activeEl.offsetWidth;
      if (navWidth === 0 || width === 0) return;
      setCarriage({
        left: activeEl.offsetLeft,
        width,
        navWidth,
        animate,
      });
    },
    [activeSection],
  );

  // Initial measurement + resize & language tracking without sliding lag
  useEffect(() => {
    measureCarriage(false);
    const nav = navRef.current;
    if (!nav || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      measureCarriage(false);
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, [language, measureCarriage]);

  // Smooth spring-like glide whenever the active volume tab changes
  useEffect(() => {
    if (prevSectionRef.current !== activeSection) {
      prevSectionRef.current = activeSection;
      measureCarriage(true);
    }
  }, [activeSection, measureCarriage]);

  const roomItems = [
    {
      id: "atelier" as const,
      roman: "I",
      label: text("Atelier & Reel", "作品案台与集锦"),
      to: localizedPath("/"),
    },
    {
      id: "gallery" as const,
      roman: "II",
      label: text("Gallery", "画廊"),
      to: localizedPath("/gallery"),
    },
    {
      id: "about" as const,
      roman: "III",
      label: text("About & Dossier", "个人档案与信函"),
      to: localizedPath("/about"),
    },
  ];

  const carriageTransition = carriage?.animate
    ? "transform 380ms cubic-bezier(0.22, 1, 0.36, 1), width 380ms cubic-bezier(0.22, 1, 0.36, 1)"
    : "none";
  const clipTransition = carriage?.animate
    ? "clip-path 380ms cubic-bezier(0.22, 1, 0.36, 1)"
    : "none";

  return (
    <div className={`atelier-header-rail relative z-30 mx-auto w-full ${maxWidthClass}`}>
      <header className="atelier-header-bar relative flex w-full flex-wrap items-center justify-between gap-3 border-b border-[#d4ad73]/38 pb-3.5 xl:flex-nowrap">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-0.5 xl:flex-nowrap">
          {eyebrow === "LEFICIOUS" ? (
            <Link
              to={localizedPath("/")}
              viewTransition
              aria-label="Leficious: Atelier Home"
              className="shrink-0 py-0.5"
            >
              <LeficiousWordmark
                className="h-[22px] w-auto translate-y-[1.5px] sm:h-[25px]"
                color="#f7f0e2"
                triggerKey={cleanPath}
                ariaLabel={null}
              />
            </Link>
          ) : (
            <p
              key={eyebrow}
              className="animate-header-meta shrink-0 font-display text-xl font-bold tracking-[0.18em] text-[#f7f0e2] uppercase sm:text-[22px]"
            >
              {eyebrow}
            </p>
          )}
          <span aria-hidden="true" className="hidden h-1.5 w-1.5 shrink-0 rotate-45 bg-[#d4ad73] sm:inline-block" />
          <p
            key={subtitle}
            className="animate-header-meta truncate font-display text-[16px] font-medium italic text-[#e6dac6] sm:text-[17.5px]"
          >
            {subtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 2xl:gap-3">
          <nav
            ref={navRef}
            aria-label={text("Primary Portfolio Volumes", "主要作品卷宗目录")}
            className="relative hidden items-center gap-1.5 select-none lg:flex"
          >
            {roomItems.map((item) => {
              const activeFallback = !carriage && activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[item.id] = el;
                  }}
                  to={item.to}
                  aria-current={activeSection === item.id ? "page" : undefined}
                  className="group relative inline-flex h-[36px]"
                >
                  <span
                    style={{ clipPath: TAB_OUTER_CLIP }}
                    className={`inline-flex h-full items-center p-[1.5px] transition-colors duration-200 ${
                      activeFallback
                        ? "bg-gradient-to-b from-[#fff3d6] via-[#dfb97b] to-[#b5894b] shadow-[0_4px_12px_rgba(0,0,0,0.65)]"
                        : "bg-gradient-to-b from-[#e5c489]/75 to-[#8c6736]/58 shadow-[0_3px_8px_rgba(0,0,0,0.55)] group-hover:from-[#fff0cc] group-hover:to-[#c89d62]"
                    }`}
                  >
                    <span
                      style={{ clipPath: TAB_INNER_CLIP }}
                      className={`inline-flex h-full items-center px-3.5 transition-colors duration-200 xl:px-4 ${
                        activeFallback
                          ? "bg-gradient-to-b from-[#fcf6e8] to-[#eae0c8] text-[#14100c]"
                          : "bg-gradient-to-b from-[#211913] via-[#17110d] to-[#100c09] text-[#ede2cf] group-hover:from-[#2c2119] group-hover:to-[#18120e] group-hover:text-white"
                      }`}
                    >
                      <span className="font-display text-[13px] font-bold tracking-[0.08em] uppercase whitespace-nowrap xl:text-[13.5px]">
                        <span className={activeFallback ? "text-rubric" : "text-[#e8c78c]"}>{item.roman}</span> ·{" "}
                        {item.label}
                      </span>
                    </span>
                  </span>
                </Link>
              );
            })}

            {carriage && (
              <>
                {/* 1. Physical gliding chamfered sunlit-vellum & champagne-gilt tab carriage */}
                <span
                  aria-hidden="true"
                  style={{
                    width: `${carriage.width}px`,
                    transform: `translate3d(${carriage.left}px, 0, 0)`,
                    transition: carriageTransition,
                    clipPath: TAB_OUTER_CLIP,
                  }}
                  className="pointer-events-none absolute top-0 left-0 z-10 inline-flex h-[36px] items-center bg-gradient-to-b from-[#fff3d6] via-[#dfb97b] to-[#b5894b] p-[1.5px] shadow-[0_5px_14px_rgba(0,0,0,0.68)]"
                >
                  <span
                    style={{ clipPath: TAB_INNER_CLIP }}
                    className="h-full w-full bg-gradient-to-b from-[#fcf6e8] to-[#eae0c8]"
                  />
                </span>

                {/* 2. Synchronized dark iron-gall & rubric text layer clipped strictly to the gliding carriage */}
                <span
                  aria-hidden="true"
                  style={{
                    clipPath: `inset(0px ${Math.max(0, carriage.navWidth - carriage.left - carriage.width)}px 0px ${carriage.left}px)`,
                    transition: clipTransition,
                  }}
                  className="pointer-events-none absolute inset-0 z-20 flex items-center gap-1.5"
                >
                  {roomItems.map((item) => (
                    <span key={item.id} className="inline-flex h-[36px] items-center p-[1.5px]">
                      <span className="inline-flex h-full items-center px-3.5 text-[#14100c] xl:px-4">
                        <span className="font-display text-[13px] font-bold tracking-[0.08em] uppercase whitespace-nowrap xl:text-[13.5px]">
                          <span className="text-rubric">{item.roman}</span> · {item.label}
                        </span>
                      </span>
                    </span>
                  ))}
                </span>

                {/* 3. Gliding champagne-gilt shuttle riding along the brass header rule */}
                <span
                  aria-hidden="true"
                  style={{
                    width: `${Math.max(0, carriage.width - 12)}px`,
                    transform: `translate3d(${carriage.left + 6}px, 0, 0)`,
                    transition: carriageTransition,
                  }}
                  className="pointer-events-none absolute -bottom-[15px] left-0 z-20 h-[2px] bg-gradient-to-r from-[#c89d62] via-[#fff2d2] to-[#c89d62] shadow-[0_0_10px_rgba(242,212,160,0.55)]"
                />
              </>
            )}
          </nav>

          {rightSlot && (
            <>
              <span aria-hidden="true" className="hidden h-4.5 w-px bg-[#d4ad73]/38 lg:block" />
              <div
                key={rightSlotKey ?? activeSection}
                className="animate-header-meta flex shrink-0 items-center justify-end lg:min-w-[158px]"
              >
                {rightSlot}
              </div>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export type SheafFlagSpec = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  to?: string;
  download?: boolean;
};

export type SheafTabSpec = {
  id: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  to?: string;
};

/**
 * Flush Right-Edge Bound Book-Block & Mahogany Fore-Edge Dock (`right-0 inset-y-0`).
 * Portals to `document.body` once hydrated so `.route-stage` directional transforms never
 * detach it from the right viewport wall; the bound vellum stack stays stationary (`z-20`)
 * while the inward-projecting index tabs (`z-10`) deal smoothly out from between the pages.
 */
export function ArchivalPaperSheaf({
  ariaLabel,
  topFlag,
  tabs,
}: {
  ariaLabel: string;
  topFlag?: SheafFlagSpec;
  tabs: SheafTabSpec[];
  progressPct?: number;
}) {
  const sheafUid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const backShadowId = `sheaf-bs-${sheafUid}`;
  const frontShadowId = `sheaf-fs-${sheafUid}`;

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(() =>
    isClientHydratedForPortals() && typeof document !== "undefined" ? document.body : null,
  );
  const dealOnMountRef = useRef<boolean>(isClientHydratedForPortals());

  const railRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLSpanElement | null>(null);
  const compactRailRef = useRef<HTMLDivElement | null>(null);
  const compactThumbRef = useRef<HTMLSpanElement | null>(null);
  const dragStateRef = useRef<{
    grabOffsetY: number;
    thumbH: number;
  } | null>(null);

  const syncScrollShuttle = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const vh = window.innerHeight;
    const sh = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
    );
    const maxScroll = Math.max(0, sh - vh);
    const scrollY = window.scrollY;
    const isScrollable = maxScroll > 6;

    const updatePair = (
      rail: HTMLDivElement | null,
      thumb: HTMLSpanElement | null,
      minThumbPx: number,
      fallbackTrackH: number,
    ) => {
      if (!rail || !thumb) return;
      rail.dataset.scrollable = isScrollable ? "true" : "false";
      if (!isScrollable) return;
      const measuredH = rail.clientHeight || fallbackTrackH;
      if (measuredH <= minThumbPx) return;
      const thumbH = Math.round(
        Math.max(minThumbPx, Math.min(measuredH * 0.86, (vh / sh) * measuredH)),
      );
      const travel = Math.max(0, measuredH - thumbH);
      const ratio = Math.min(1, Math.max(0, scrollY / maxScroll));
      const thumbY = ratio * travel;
      thumb.style.height = `${thumbH}px`;
      thumb.style.transform = `translate3d(0, ${thumbY.toFixed(1)}px, 0)`;
    };

    updatePair(railRef.current, thumbRef.current, 44, Math.max(0, vh - 32));
    updatePair(compactRailRef.current, compactThumbRef.current, 36, Math.max(0, vh - 72));
  }, []);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    let rafId = 0;
    const scheduleSync = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        syncScrollShuttle();
      });
    };

    syncScrollShuttle();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(scheduleSync);
      ro.observe(document.documentElement);
      if (document.body) ro.observe(document.body);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      ro?.disconnect();
    };
  }, [portalTarget, syncScrollShuttle]);

  const handleRailPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || typeof window === "undefined") return;
    const rail = e.currentTarget;
    if (rail.dataset.scrollable !== "true") return;

    const vh = window.innerHeight;
    const sh = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
    );
    const maxScroll = Math.max(0, sh - vh);
    if (maxScroll <= 6) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = rail.getBoundingClientRect();
    const trackH = rect.height;
    const minThumb = rail === compactRailRef.current ? 36 : 44;
    const thumbH = Math.round(Math.max(minThumb, Math.min(trackH * 0.86, (vh / sh) * trackH)));
    const travel = Math.max(1, trackH - thumbH);
    const curThumbY = Math.min(1, Math.max(0, window.scrollY / maxScroll)) * travel;
    const localY = e.clientY - rect.top;

    let grabOffsetY: number;
    if (localY >= curThumbY - 5 && localY <= curThumbY + thumbH + 5) {
      grabOffsetY = localY - curThumbY;
    } else {
      grabOffsetY = thumbH / 2;
      const nextThumbY = Math.max(0, Math.min(travel, localY - grabOffsetY));
      window.scrollTo({ top: (nextThumbY / travel) * maxScroll, behavior: "instant" });
    }

    dragStateRef.current = { grabOffsetY, thumbH };
    rail.dataset.dragging = "true";
    rail.setPointerCapture(e.pointerId);
    syncScrollShuttle();
  };

  const handleRailPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || typeof window === "undefined") return;
    const rail = e.currentTarget;
    const vh = window.innerHeight;
    const sh = Math.max(
      document.documentElement.scrollHeight,
      document.body ? document.body.scrollHeight : 0,
    );
    const maxScroll = Math.max(0, sh - vh);
    if (maxScroll <= 6) return;

    const rect = rail.getBoundingClientRect();
    const travel = Math.max(1, rect.height - state.thumbH);
    const localY = e.clientY - rect.top;
    const nextThumbY = Math.max(0, Math.min(travel, localY - state.grabOffsetY));
    window.scrollTo({ top: (nextThumbY / travel) * maxScroll, behavior: "instant" });
    syncScrollShuttle();
  };

  const handleRailPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    dragStateRef.current = null;
    e.currentTarget.dataset.dragging = "false";
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const renderFlagInner = (active: boolean, rawLabel: string) => {
    const hasBackArrow = rawLabel.startsWith("←");
    const cleanLabel = hasBackArrow ? rawLabel.replace(/^←\s*/, "") : rawLabel;

    return (
      <span
        style={{
          clipPath: "polygon(0 6px, 100% 0, 100% 100%, 0 calc(100% - 6px))",
        }}
        className={`relative flex flex-col items-center gap-1.5 py-2.5 transition-[width,background-color,color,border-color] duration-200 2xl:py-3 ${
          active
            ? "w-[48px] border-l-[3px] border-l-[#f2d7a4] bg-gradient-to-l from-[#6e1417] to-[#941c20] text-[#faf3e6] shadow-[inset_-3px_0_5px_rgba(10,3,3,0.38)] 2xl:w-[51px]"
            : "w-[40px] border-l-[1.5px] border-l-[#dfb97c]/68 bg-gradient-to-l from-[#4f0f12] to-[#731619] text-[#f3e6cf] shadow-[inset_-3px_0_5px_rgba(10,3,3,0.44)] group-hover:w-[45px] group-hover:from-[#631316] group-hover:to-[#8a1a1e] group-hover:text-[#fffaf0] 2xl:w-[43px] 2xl:group-hover:w-[48px]"
        }`}
      >
        {hasBackArrow ? (
          <span
            aria-hidden="true"
            className="font-numeral text-[12px] leading-none font-semibold text-[#f2d7a4]"
          >
            ←
          </span>
        ) : (
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#f2d7a4]" />
        )}
        <span
          className="font-display text-[12.5px] leading-none font-semibold tracking-[0.16em] uppercase whitespace-nowrap 2xl:text-[13.5px]"
          style={{ writingMode: "vertical-rl" }}
        >
          {cleanLabel}
        </span>
      </span>
    );
  };

  const parseTabParts = (raw: string): { roman: string | null; title: string } => {
    const match = raw.match(/^([IVX]+)\s*[.·]\s*(.+)$/);
    if (!match) return { roman: null, title: raw };
    return { roman: match[1], title: match[2] };
  };

  const sheafNode = (
    <>
      {/* Compact Flush-Right Gilt Scroll Shuttle for Narrow Viewports (< xl) Where Fore-Edge Dock Is Hidden */}
      <div
        ref={compactRailRef}
        aria-hidden="true"
        data-scrollable="false"
        data-dragging="false"
        onPointerDown={handleRailPointerDown}
        onPointerMove={handleRailPointerMove}
        onPointerUp={handleRailPointerEnd}
        onPointerCancel={handleRailPointerEnd}
        className="group/rail pointer-events-none fixed top-[62px] right-0 bottom-2 z-40 hidden w-[12px] touch-none select-none opacity-0 transition-opacity duration-200 data-[scrollable=true]:pointer-events-auto data-[scrollable=true]:opacity-100 pointer-fine:block xl:pointer-fine:hidden"
      >
        <span className="pointer-events-none absolute inset-y-0 right-[1.5px] w-px bg-[#d4ad73]/18" />
        <span
          ref={compactThumbRef}
          style={{ height: "44px", transform: "translate3d(0, 0, 0)" }}
          className="pointer-events-none absolute top-0 right-[0.5px] w-[3.5px] border-y border-[#fff3d6]/80 bg-gradient-to-b from-[#b98c4f] via-[#f2ddb2] to-[#9f733b] opacity-70 shadow-[0_1px_6px_rgba(0,0,0,0.85)] transition-opacity duration-150 group-hover/rail:w-[4.5px] group-hover/rail:opacity-100 group-data-[dragging=true]/rail:w-[4.5px] group-data-[dragging=true]/rail:opacity-100"
        />
      </div>

      <nav
        aria-label={ariaLabel}
        className="atelier-fore-edge pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-[96px] overflow-x-clip select-none xl:flex xl:flex-col xl:items-end xl:justify-center"
      >
        {/* 1. BACK LAYER (z-10, BEHIND Divider Tabs): Smoked Morocco Cover Board + 4 Fanned Deeper Rag-Vellum Signatures */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[36px]"
        >
          {/* Ambient desk cast-shadow from the overhanging leather cover board */}
          <span className="absolute inset-y-0 right-0 w-[26px] border-l border-[#cfa668]/42 bg-gradient-to-l from-[#060403] via-[#140d09] to-[#231710] shadow-[-18px_0_38px_rgba(0,0,0,0.95)]" />

          {/* 4 obliquely fanned deeper rag-vellum sheaves peeking behind & between the divider tabs */}
          <svg
            viewBox="0 0 36 1080"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <filter id={backShadowId} x="-35%" y="-2%" width="150%" height="104%">
                <feDropShadow dx="-1.6" dy="1.4" stdDeviation="1.35" floodColor="#0d0703" floodOpacity="0.62" />
              </filter>
            </defs>

            {/* Back Sheaf 1 (Deepest aged signature) */}
            <path
              d="M 10.6 17 L 29.8 15 L 29.8 1065 L 14.0 1063 Z"
              fill="#c5b08d"
              stroke="#efe2c8"
              strokeWidth="0.7"
              strokeOpacity="0.48"
              filter={`url(#${backShadowId})`}
            />
            {/* Back Sheaf 2 (Counter-fanned signature) */}
            <path
              d="M 14.4 26 L 29.8 24 L 29.8 1056 L 10.8 1054 Z"
              fill="#d3c09f"
              stroke="#f6ebcf"
              strokeWidth="0.75"
              strokeOpacity="0.56"
              filter={`url(#${backShadowId})`}
            />
            {/* Back Sheaf 3 (Stepped middle-back signature) */}
            <path
              d="M 12.2 35 L 29.8 33 L 29.8 1047 L 15.8 1045 Z"
              fill="#dfd0b2"
              stroke="#fbf2dd"
              strokeWidth="0.8"
              strokeOpacity="0.64"
              filter={`url(#${backShadowId})`}
            />
            {/* Back Sheaf 4 (Inner-saddle rag signature right behind divider tabs) */}
            <path
              d="M 16.2 44 L 29.8 42 L 29.8 1038 L 12.6 1036 Z"
              fill="#ebe0c7"
              stroke="#fffaf0"
              strokeWidth="0.85"
              strokeOpacity="0.72"
              filter={`url(#${backShadowId})`}
            />
          </svg>
        </div>

        {/* 2. MIDDLE LAYER (z-20): Die-Cut Index Divider Tabs Sandwiched Between Back & Front Page Sheaves */}
        <div
          className={`pointer-events-auto relative z-20 flex flex-col items-end py-7 pr-[15px] ${
            dealOnMountRef.current ? "animate-sheaf-tabs" : ""
          }`}
        >
        {topFlag &&
          (() => {
            const flagClass = `group relative cursor-pointer transition-transform duration-200 [filter:drop-shadow(-3px_3px_6px_rgba(0,0,0,0.78))] ${
              topFlag.active ? "z-30" : "z-20 hover:-translate-x-0.5"
            }`;
            if (topFlag.to) {
              return (
                <Link to={topFlag.to} className={flagClass}>
                  {renderFlagInner(Boolean(topFlag.active), topFlag.label)}
                </Link>
              );
            }
            if (topFlag.href) {
              return (
                <a href={topFlag.href} download={topFlag.download} className={flagClass}>
                  {renderFlagInner(Boolean(topFlag.active), topFlag.label)}
                </a>
              );
            }
            return (
              <button
                type="button"
                onClick={topFlag.onClick}
                aria-current={topFlag.active ? "true" : undefined}
                className={flagClass}
              >
                {renderFlagInner(Boolean(topFlag.active), topFlag.label)}
              </button>
            );
          })()}

        <div className={`${topFlag ? "mt-2.5 2xl:mt-3.5" : ""} flex flex-col items-end gap-1`}>
          {tabs.map((tab, idx) => {
            const active = Boolean(tab.active);
            const { roman, title } = parseTabParts(tab.label);
            const wrapperClass = `group relative cursor-pointer transition-transform duration-200 [filter:drop-shadow(-3px_3px_6px_rgba(0,0,0,0.72))] ${
              active ? "" : "hover:z-30 hover:-translate-x-0.5"
            }`;

            const tabInner = (
              <span
                style={{
                  clipPath: "polygon(0 7px, 100% 0, 100% 100%, 0 calc(100% - 7px))",
                }}
                className={`relative flex flex-col items-center justify-center overflow-hidden py-2.5 transition-[width,background-color,color,border-color] duration-200 2xl:py-3 ${
                  active
                    ? "w-[49px] border-l-[3px] border-l-rubric bg-[#fffdf8] text-[#7c1417] shadow-[inset_-3px_0_4px_rgba(44,26,10,0.16)] 2xl:w-[52px]"
                    : "w-[41px] border-l-[1.5px] border-l-[#8c6432]/72 bg-[#f5ecda] text-[#231912] shadow-[inset_-3px_0_5px_rgba(36,22,8,0.18)] group-hover:w-[46px] group-hover:bg-[#fcf7eb] group-hover:text-[#110c08] 2xl:w-[44px] 2xl:group-hover:w-[49px]"
                }`}
              >
                <span
                  aria-hidden="true"
                  style={{
                    backgroundImage: 'url("/textures/rag-paper-tile.webp")',
                    backgroundSize: "220px 220px",
                  }}
                  className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
                />
                <span
                  className={`relative z-10 max-h-[168px] overflow-hidden font-display text-[15.5px] leading-none tracking-[0.025em] whitespace-nowrap 2xl:text-[16.5px] ${
                    active ? "font-[640]" : "font-[570]"
                  }`}
                  style={{ writingMode: "vertical-rl" }}
                >
                  {roman && (
                    <>
                      <span className="font-[650] text-rubric">{roman}</span>
                      <span
                        aria-hidden="true"
                        className={`mx-0.5 ${active ? "text-rubric/65" : "text-[#7a5528]/70"}`}
                      >
                        ·
                      </span>
                    </>
                  )}
                  <span>{title}</span>
                </span>
              </span>
            );

            if (tab.to) {
              return (
                <Link
                  key={tab.id}
                  to={tab.to}
                  aria-current={active ? "page" : undefined}
                  style={{ zIndex: active ? 35 : 25 - idx }}
                  className={wrapperClass}
                >
                  {tabInner}
                </Link>
              );
            }

            if (tab.href) {
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  aria-current={active ? "true" : undefined}
                  style={{ zIndex: active ? 35 : 25 - idx }}
                  className={wrapperClass}
                >
                  {tabInner}
                </a>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                aria-current={active ? "true" : undefined}
                style={{ zIndex: active ? 35 : 25 - idx }}
                className={wrapperClass}
              >
                {tabInner}
              </button>
            );
          })}
        </div>
      </div>

        {/* 3. FRONT LAYER (z-30, OVERLAPPING Tab Roots): 4 Fanned Sunlit Rag-Vellum Signatures + Mahogany Lip & Brass Shuttle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-30 w-[36px]"
        >
          <svg
            viewBox="0 0 36 1080"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <filter id={frontShadowId} x="-40%" y="-2%" width="160%" height="104%">
                <feDropShadow dx="-1.8" dy="1.2" stdDeviation="1.35" floodColor="#120a04" floodOpacity="0.56" />
              </filter>
            </defs>

            {/* Front Sheaf 1 (Clamps directly over the right root of the divider tabs) */}
            <path
              d="M 17.8 52 L 29.8 50 L 29.8 1030 L 17.4 1028 L 19.5 540 Z"
              fill="#ece0c7"
              stroke="#fffaf0"
              strokeWidth="0.8"
              strokeOpacity="0.72"
              filter={`url(#${frontShadowId})`}
            />

            {/* Front Sheaf 2 (Counter-angled signature split into upper & lower folios so corner overlaps show mid-spine) */}
            <path
              d="M 21.0 62 L 29.8 60 L 29.8 565 L 18.9 562 Z"
              fill="#f3e8d2"
              stroke="#fffdf7"
              strokeWidth="0.85"
              strokeOpacity="0.82"
              filter={`url(#${frontShadowId})`}
            />
            <path
              d="M 19.2 548 L 29.8 546 L 29.8 1020 L 21.4 1018 Z"
              fill="#f5ead5"
              stroke="#fffdf8"
              strokeWidth="0.85"
              strokeOpacity="0.84"
              filter={`url(#${frontShadowId})`}
            />

            {/* Front Sheaf 3 (Stepped upper-inner rag signature) */}
            <path
              d="M 22.0 72 L 29.8 70 L 29.8 1010 L 21.8 1008 L 23.9 525 Z"
              fill="#faf2e2"
              stroke="#ffffff"
              strokeWidth="0.85"
              strokeOpacity="0.88"
              filter={`url(#${frontShadowId})`}
            />

            {/* Front Sheaf 4 (Topmost sunlit rag-vellum flyleaf) */}
            <path
              d="M 25.2 82 L 29.8 80 L 29.8 392 L 23.8 389 Z"
              fill="#fffaf0"
              stroke="#ffffff"
              strokeWidth="0.85"
              strokeOpacity="0.92"
              filter={`url(#${frontShadowId})`}
            />
            <path
              d="M 24.2 376 L 29.8 374 L 29.8 742 L 25.4 739 Z"
              fill="#fdf7eb"
              stroke="#ffffff"
              strokeWidth="0.85"
              strokeOpacity="0.92"
              filter={`url(#${frontShadowId})`}
            />
            <path
              d="M 23.9 726 L 29.8 724 L 29.8 1000 L 25.4 998 Z"
              fill="#fffaf0"
              stroke="#ffffff"
              strokeWidth="0.85"
              strokeOpacity="0.92"
              filter={`url(#${frontShadowId})`}
            />
          </svg>

          {/* Outer 6.5px ebony-mahogany book-cover fore-edge lip & gilt bevel */}
          <span className="absolute inset-y-0 right-0 w-[6.5px] border-l border-[#d4ad73]/55 bg-gradient-to-l from-[#070504] via-[#120d09] to-[#1e150f] shadow-[-2px_0_5px_rgba(0,0,0,0.65)]" />

          {/* Interactive Brass & Crimson Fore-Edge Scroll Shuttle Nested Inside the Outer Mahogany Channel */}
          <div
            ref={railRef}
            data-scrollable="false"
            data-dragging="false"
            onPointerDown={handleRailPointerDown}
            onPointerMove={handleRailPointerMove}
            onPointerUp={handleRailPointerEnd}
            onPointerCancel={handleRailPointerEnd}
            className="group/rail pointer-events-none absolute top-[15px] right-0 bottom-[15px] z-40 w-[15px] cursor-pointer touch-none opacity-0 transition-opacity duration-200 data-[dragging=true]:cursor-grabbing data-[scrollable=true]:pointer-events-auto data-[scrollable=true]:opacity-100"
          >
            <span className="pointer-events-none absolute inset-y-1.5 right-[2.5px] w-px bg-[#d4ad73]/22 transition-colors group-hover/rail:bg-[#ebd09e]/42" />
            <span
              ref={thumbRef}
              style={{ height: "56px", transform: "translate3d(0, 0, 0)" }}
              className="pointer-events-none absolute top-0 right-[0.5px] flex w-[5px] items-center justify-center border-y border-[#fff4db]/90 bg-gradient-to-b from-[#bd8f52] via-[#f4dfb4] to-[#9c6f38] opacity-80 shadow-[0_2px_8px_rgba(0,0,0,0.9),0_0_8px_rgba(212,173,115,0.28)] transition-[opacity,filter,box-shadow] duration-150 group-hover/rail:opacity-100 group-hover/rail:shadow-[0_2px_10px_rgba(0,0,0,0.95),0_0_12px_rgba(242,212,160,0.52)] group-data-[dragging=true]/rail:opacity-100 group-data-[dragging=true]/rail:brightness-110"
            >
              <span className="h-[6px] w-[3px] bg-[#9e191c] ring-[0.5px] ring-[#fff4db]/75" />
            </span>
          </div>

          {/* Sculpted bookbinding headband (top) & tailband (bottom) brass clasps */}
          <span className="absolute top-0 right-0 h-[15px] w-[26px] border-b border-[#d4ad73]/65 bg-gradient-to-b from-[#261b13] to-[#120c08] shadow-[0_3px_8px_rgba(0,0,0,0.82)]" />
          <span className="absolute bottom-0 right-0 h-[15px] w-[26px] border-t border-[#d4ad73]/65 bg-gradient-to-t from-[#261b13] to-[#120c08] shadow-[0_-3px_8px_rgba(0,0,0,0.82)]" />
        </div>
      </nav>
    </>
  );

  return portalTarget ? createPortal(sheafNode, portalTarget) : sheafNode;
}
