import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage, type Language } from "../lib/language";

export function SiteNav() {
  const { pathname, hash } = useLocation();
  const { language, setLanguage, text, localizedPath } = useLanguage();
  const navClass = (isActive: boolean) =>
    `transition-colors hover:text-foreground ${isActive ? "text-foreground" : ""}`;

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform focus:translate-y-0"
      >
        {text("Skip to content", "跳至主要内容")}
      </a>
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-3 py-3 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-x-6 sm:px-6 sm:py-4">
        <Link to={localizedPath("/")} viewTransition className="site-mark-enter font-display text-base font-semibold tracking-tight sm:text-lg">
          leficious<span className="site-mark-dot text-accent">.</span>
        </Link>
        <nav aria-label={text("Primary", "主导航")} className="signal-nav-enter col-span-2 row-start-2 flex min-w-0 items-center justify-between gap-3 text-[11px] text-muted-foreground sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:gap-6 sm:text-sm">
          <NavLink to={localizedPath("/")} end viewTransition className={({ isActive }) => navClass(isActive)}>{text("Work", "作品")}</NavLink>
          <NavLink to={localizedPath("/gallery")} viewTransition className={({ isActive }) => navClass(isActive)}>{text("Gallery", "画廊")}</NavLink>
          <NavLink to={localizedPath("/about")} viewTransition className={({ isActive }) => navClass(isActive && hash !== "#contact")}>{text("About", "关于")}</NavLink>
          <Link
            to={`${localizedPath("/about")}#contact`}
            className={navClass((pathname === "/about" || pathname === "/zh/about") && hash === "#contact")}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            {text("Contact", "联系")}
          </Link>
        </nav>
        <div className="hidden h-4 w-px bg-border sm:col-start-3 sm:row-start-1 sm:block" aria-hidden="true" />
        <div className="signal-nav-enter col-start-2 row-start-1 flex items-center rounded-full border border-border/80 bg-surface/65 p-0.5 text-[10px] font-semibold tracking-[0.04em] shadow-sm sm:col-start-4 sm:row-start-1 sm:text-[11px]" aria-label={text("Choose language", "选择语言")}>
          {(["en", "zh"] as Language[]).map((option) => (
            <span key={option} className="flex items-center">
              <button
                type="button"
                onClick={() => setLanguage(option)}
                aria-pressed={language === option}
                lang={option === "zh" ? "zh-CN" : "en"}
                className={`min-w-8 rounded-full px-1.5 py-1.5 antialiased transition-colors hover:text-foreground sm:min-w-10 sm:px-2.5 ${language === option ? "bg-accent/12 text-accent" : "text-muted-foreground"}`}
              >
                {option === "en" ? "EN" : "中文"}
              </button>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { text } = useLanguage();
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} leficious — {text("Technical & Combat Design", "技术与战斗设计")}</p>
        <p className="font-mono text-xs">leficious.com</p>
      </div>
    </footer>
  );
}
