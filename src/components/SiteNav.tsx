import { Link, NavLink, useLocation } from "react-router-dom";

export function SiteNav() {
  const { pathname, hash } = useLocation();
  const navClass = (isActive: boolean) =>
    `transition-colors hover:text-foreground ${isActive ? "text-foreground" : ""}`;

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" viewTransition className="site-mark-enter font-display text-lg font-semibold tracking-tight">
          leficious<span className="site-mark-dot text-accent">.</span>
        </Link>
        <nav aria-label="Primary" className="signal-nav-enter flex items-center gap-3 text-xs text-muted-foreground sm:gap-6 sm:text-sm">
          <NavLink to="/" end viewTransition className={({ isActive }) => navClass(isActive)}>Work</NavLink>
          <NavLink to="/gallery" viewTransition className={({ isActive }) => navClass(isActive)}>Gallery</NavLink>
          <NavLink to="/about" viewTransition className={({ isActive }) => navClass(isActive && hash !== "#contact")}>About</NavLink>
          <Link
            to="/about#contact"
            className={navClass(pathname === "/about" && hash === "#contact")}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} leficious — Technical &amp; Combat Design</p>
        <p className="font-mono text-xs">leficious.com</p>
      </div>
    </footer>
  );
}
