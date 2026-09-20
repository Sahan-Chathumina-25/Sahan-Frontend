import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { articles } from "@/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = ["", "/about", "/projects", "/articles", "/contact"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
  const articleRoutes = articles.map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: new Date(a.date),
  }));
  return [...staticRoutes, ...articleRoutes];
}
