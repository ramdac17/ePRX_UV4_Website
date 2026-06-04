import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "facebookexternalhit",
        allow: ["/event/", "/article/", "/gear/", "/mind/", "/fuel/"],
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://www.prxph.com/sitemap.xml",
  };
}
