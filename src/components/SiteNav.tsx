import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage, type Language } from "../lib/language";
import { BrandCrest, NavbarBrandLockup } from "./BrandMark";

export function SiteNav() {
  const { pathname, hash } = useLocation();
  const { language, setLanguage, text, localizedPath } = useLanguage();
  const navClass = (isActive: boolean) =>
    `relative py-1 transition-colors hover:text-foreground ${
      isActive
        ? "text-foreground after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[1.5px] after:bg-warm"
        : "text-muted-foreground"
    }`;

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-xs bg-foreground px-4 py-2 text-sm font-medium text-background transition-transform focus:translate-y-0"
      >
        {text("Skip to content", "跳至主要内容")}
      </a>
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-x-6 sm:px-6 sm:py-3.5">
        <Link
          to={localizedPath("/")}
          viewTransition
          aria-label="Leficious"
          className="inline-flex items-center py-0.5"
        >
          <NavbarBrandLockup />
        </Link>
        <nav
          aria-label={text("Primary", "主导航")}
          className="col-span-2 row-start-2 flex min-w-0 items-center justify-start gap-6 text-xs sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:justify-self-end sm:gap-7 sm:text-sm"
        >
          <NavLink to={localizedPath("/")} end viewTransition className={({ isActive }) => navClass(isActive)}>
            {text("Work", "项目")}
          </NavLink>
          <NavLink to={localizedPath("/gallery")} viewTransition className={({ isActive }) => navClass(isActive)}>
            {text("Gallery", "作品集")}
          </NavLink>
          <NavLink to={localizedPath("/about")} viewTransition className={({ isActive }) => navClass(isActive && hash !== "#contact")}>
            {text("About", "关于")}
          </NavLink>
          <Link
            to={`${localizedPath("/about")}#contact`}
            className={navClass((pathname === "/about" || pathname === "/zh/about") && hash === "#contact")}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            {text("Contact", "联系")}
          </Link>
          <a
            href={language === "zh" ? "/resume/Kevin_Shan_CN_Game_Resume.pdf" : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"}
            download
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {text("Résumé", "简历")} ↓
          </a>
        </nav>
        <div className="hidden h-4 w-px bg-border sm:col-start-3 sm:row-start-1 sm:block" aria-hidden="true" />
        <div
          className="col-start-2 row-start-1 flex items-center justify-self-end rounded-xs border border-border bg-surface text-[11px] font-medium sm:col-start-4 sm:row-start-1"
          aria-label={text("Choose language", "选择语言")}
        >
          {(["en", "zh"] as Language[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLanguage(option)}
              aria-pressed={language === option}
              lang={option === "zh" ? "zh-CN" : "en"}
              className={`min-w-9 px-2 py-1 antialiased transition-colors sm:min-w-10 sm:px-2.5 ${
                language === option
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option === "en" ? "EN" : "中文"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { text } = useLanguage();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-9 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="inline-flex items-center gap-2.5">
          <BrandCrest className="h-3.5 w-3.5 opacity-90" />
          <span>© {new Date().getFullYear()} Lefi Shan · {text("Game, Level & Technical Design", "游戏、关卡与技术设计")}</span>
        </p>
        <p className="font-mono text-[11px] text-muted-foreground/80">Los Angeles, CA</p>
      </div>
    </footer>
  );
}
