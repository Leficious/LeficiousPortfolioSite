import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-lg font-semibold tracking-tight">
          leficious<span className="text-accent">.</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground" }}
            className="transition-colors hover:text-foreground"
          >
            Work
          </Link>
          <Link
            to="/about"
            activeProps={{ className: "text-foreground" }}
            className="transition-colors hover:text-foreground"
          >
            About
          </Link>
          <a
            href="mailto:hello@leficious.com"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} leficious — Technical & Combat Design</p>
        <p className="font-mono text-xs">leficious.com</p>
      </div>
    </footer>
  );
}
