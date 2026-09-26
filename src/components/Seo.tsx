import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
};

const defaultImage = "/social/leficious-og-1200x630.png";

const setMeta = (selector: string, attribute: "name" | "property", value: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.content = content;
};

const buildStructuredData = (title: string, description: string, path: string, image: string) => {
  const url = new URL(path, "https://leficious.com").toString();
  const contentPath = path.replace(/^\/zh(?=\/|$)/, "") || "/";
  const person = {
    "@type": "Person",
    "@id": "https://leficious.com/#person",
    name: "Lefi (Kevin) Shan",
    alternateName: "Leficious",
    url: "https://leficious.com/",
    jobTitle: "Technical Game Designer",
    sameAs: ["https://www.linkedin.com/in/leficious/", "https://github.com/Leficious"],
  };

  if (contentPath.startsWith("/projects/")) {
    return { "@context": "https://schema.org", "@graph": [person, { "@type": "CreativeWork", name: title.replace(" — Leficious", ""), description, url, image, creator: { "@id": person["@id"] } }] };
  }

  if (contentPath === "/gallery") {
    return { "@context": "https://schema.org", "@graph": [person, { "@type": "CollectionPage", name: title, description, url, image, author: { "@id": person["@id"] } }] };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      { "@type": contentPath === "/about" ? "ProfilePage" : "WebSite", "@id": `${url}#page`, name: title, description, url, image, author: { "@id": person["@id"] } },
    ],
  };
};

export function Seo({ title, description, path = "/", image, imageWidth = 1200, imageHeight = 630 }: SeoProps) {
  useEffect(() => {
    const url = new URL(path, "https://leficious.com").toString();
    const resolvedImage = new URL(image ?? defaultImage, "https://leficious.com").toString();
    document.title = title;
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:locale"]', "property", "og:locale", path === "/zh" || path.startsWith("/zh/") ? "zh_CN" : "en_US");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[property="og:image"]', "property", "og:image", resolvedImage);
    setMeta('meta[property="og:image:width"]', "property", "og:image:width", String(imageWidth));
    setMeta('meta[property="og:image:height"]', "property", "og:image:height", String(imageHeight));
    setMeta('meta[property="og:image:type"]', "property", "og:image:type", resolvedImage.endsWith(".png") ? "image/png" : resolvedImage.endsWith(".webp") ? "image/webp" : "image/avif");
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", resolvedImage);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const englishPath = path.replace(/^\/zh(?=\/|$)/, "") || "/";
    const chinesePath = englishPath === "/" ? "/zh" : `/zh${englishPath}`;
    const alternates = [
      ["en", englishPath],
      ["zh-CN", chinesePath],
      ["x-default", englishPath],
    ] as const;
    alternates.forEach(([hreflang, alternatePath]) => {
      let alternate = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
      if (!alternate) {
        alternate = document.createElement("link");
        alternate.rel = "alternate";
        alternate.hreflang = hreflang;
        document.head.appendChild(alternate);
      }
      alternate.href = new URL(alternatePath, "https://leficious.com").toString();
    });

    let structuredData = document.head.querySelector<HTMLScriptElement>('script[data-portfolio-structured-data]');
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.type = "application/ld+json";
      structuredData.dataset.portfolioStructuredData = "true";
      document.head.appendChild(structuredData);
    }
    structuredData.textContent = JSON.stringify(buildStructuredData(title, description, path, resolvedImage));
  }, [title, description, path, image, imageWidth, imageHeight]);

  return null;
}
