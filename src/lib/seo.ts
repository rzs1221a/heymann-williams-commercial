/**
 * Client-side head management for the SPA layer. The crawler-facing head is
 * stamped statically by scripts/prerender.mjs; these hooks keep the document
 * honest during client navigation so the tab title and canonical follow the
 * route.
 */
import { useEffect } from "react";
import { SITE } from "./site";

export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:title"]', title);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:title"]', title);
      setMeta('meta[name="twitter:description"]', description);
    }
  }, [title, description]);
}

export function useCanonical(path: string) {
  useEffect(() => {
    const url = `${SITE.domain}${path}`;
    const link = document.querySelector('link[rel="canonical"]');
    if (link) link.setAttribute("href", url);
    setMeta('meta[property="og:url"]', url);
  }, [path]);
}

/** Keep the share preview accurate after client-side navigation. */
function setMeta(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

/** Inject route-scoped JSON-LD during client navigation. */
export function useJsonLd(id: string, data: object | null) {
  useEffect(() => {
    if (!data) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.dataset.jsonld = id;
    // JSON-LD is data, but it still sits in a script element. Escaping `<`
    // prevents a CMS-authored value from accidentally closing that element.
    el.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [id, data]);
}
