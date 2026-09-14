import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { SiteNav } from "../components/SiteNav";

export function NotFoundPage({ message = "Page not found" }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="Page not found — Leficious" description="The requested page could not be found." path={window.location.pathname} />
      <SiteNav />
      <main className="mx-auto max-w-3xl px-6 py-32 text-center"><p className="font-display text-7xl font-bold">404</p><h1 className="mt-4 font-display text-2xl font-semibold">{message}</h1><p className="mt-2 text-muted-foreground">The page doesn&apos;t exist or may have moved.</p><Link to="/" className="mt-6 inline-block text-accent hover:underline">← Back to work</Link></main>
    </div>
  );
}
