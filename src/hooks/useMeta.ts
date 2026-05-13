import { useEffect } from "react";

interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product";
}

const BASE_TITLE = "German Parra – Detalles & Sorpresas";
const BASE_DESC = "Desayunos sorpresa, arreglos florales y fresas con chocolate entregados con amor en Bogotá, Colombia.";
const BASE_IMAGE = "/img/evoka-logo.png.png";
const BASE_URL = "https://germanparra.com";

function setMeta(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useMeta({ title, description, image, url, type = "website" }: MetaOptions = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | German Parra` : BASE_TITLE;
    const desc = description || BASE_DESC;
    const img = image || BASE_IMAGE;
    const pageUrl = url ? `${BASE_URL}${url}` : BASE_URL;

    // Title
    document.title = fullTitle;

    // Basic meta
    setMeta("description", desc, true);

    // Open Graph (Facebook, WhatsApp)
    setMeta("og:title", fullTitle);
    setMeta("og:description", desc);
    setMeta("og:image", img);
    setMeta("og:url", pageUrl);
    setMeta("og:type", type === "product" ? "product" : "website");
    setMeta("og:site_name", "German Parra");
    setMeta("og:locale", "es_CO");

    // Twitter Card
    setMeta("twitter:card", "summary_large_image", true);
    setMeta("twitter:title", fullTitle, true);
    setMeta("twitter:description", desc, true);
    setMeta("twitter:image", img, true);

    // Cleanup on unmount: restore defaults
    return () => {
      document.title = BASE_TITLE;
      setMeta("description", BASE_DESC, true);
      setMeta("og:title", BASE_TITLE);
      setMeta("og:description", BASE_DESC);
      setMeta("og:image", BASE_IMAGE);
      setMeta("og:url", BASE_URL);
      setMeta("og:type", "website");
    };
  }, [title, description, image, url, type]);
}
