import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { useLanguage } from "../lib/language";

export function NotFoundPage({ message }: { message?: string }) {
  const { text, localizedPath } = useLanguage();
  const resolvedMessage = message ?? text("Page not found", "未找到页面");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title={text("Page not found — Leficious", "未找到页面 — Leficious")} description={text("The requested page could not be found.", "无法找到请求的页面。")} path={window.location.pathname} />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-6 py-32 text-center"><p className="font-display text-7xl font-bold">404</p><h1 className="mt-4 font-display text-2xl font-semibold">{resolvedMessage}</h1><p className="mt-2 text-muted-foreground">{text("The page doesn't exist or may have moved.", "该页面不存在或可能已被移动。")}</p><Link to={localizedPath("/")} viewTransition className="mt-6 inline-block text-accent hover:underline">← {text("Back to work", "返回作品页")}</Link></main>
    </div>
  );
}
