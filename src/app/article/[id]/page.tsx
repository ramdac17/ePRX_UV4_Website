import { Metadata } from "next";
import ArticleDetailClient from "./ArticleDetailClient";

type Props = {
  params: Promise<{ id: string }>; // ✅ params is correctly typed as a Promise for Next.js 15
};

// 🛰️ SERVER-SIDE METADATA GENERATOR
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. Unpack the routing parameters promise
  const { id } = await params;

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const PRODUCTION_URL = "https://www.prxph.com";

  try {
    const res = await fetch(`${BACKEND_API}/article/${id}`, {
      next: { revalidate: 3600 }, // Cache on the edge network for 1 hour to save database bandwidth
    });

    if (!res.ok) return { title: "PRX | ARTICLE_NOT_FOUND" };

    const article = await res.json();

    /**
     * 🌏 FIXED STATIC URL EXTRACTION:
     * Maps path resolutions cleanly to the '/api' prefix layout on Railway.
     */
    const imageUrl = article.image?.startsWith("http")
      ? article.image
      : `${BACKEND_API}/uploads/${article.image}`;

    const shortDescription = article.content
      ? `${article.content.substring(0, 155)}...`
      : "Read the full narrative on the ePRX platform.";

    return {
      title: `${article.title.toUpperCase()} | PRX ARCHIVES`,
      description: shortDescription,
      openGraph: {
        title: article.title,
        description: shortDescription,
        url: `${PRODUCTION_URL}/article/${id}`, // Double check if your folder structure uses /articles/ or /article/
        siteName: "PRX",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Cover graphic for ${article.title}`,
          },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: shortDescription,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: "PRX | MISSION ARCHIVE",
      description: "Access historical ePRX UV1 performance metrics.",
    };
  }
}

// THE MAIN PAGE WRAPPER
export default async function Page({ params }: Props) {
  // 2. Unpack the promise here as well
  const { id } = await params;

  return <ArticleDetailClient id={id} />;
}
