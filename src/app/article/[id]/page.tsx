import { Metadata } from "next";
import ArticleDetailClient from "./ArticleDetailClient";

type Props = {
  params: Promise<{ id: string }>; // ✅ params is now a Promise in Next.js 15
};

// 🛰️ SERVER-SIDE METADATA GENERATOR
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. Unpack the promise
  const { id } = await params;

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    const res = await fetch(`${BACKEND_API}/articles/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return { title: "PRX | ARTICLE_NOT_FOUND" };

    const article = await res.json();
    const imageUrl = article.image?.startsWith("http")
      ? article.image
      : `${BACKEND_API.replace("/api", "")}/uploads/${article.image}`;

    return {
      title: `${article.title.toUpperCase()} | PRX ARCHIVES`,
      description: article.content.substring(0, 160),
      openGraph: {
        title: article.title,
        description: article.content.substring(0, 160),
        images: [{ url: imageUrl }],
        type: "article",
      },
    };
  } catch (error) {
    return { title: "PRX | MISSION_ARCHIVE" };
  }
}

// THE MAIN PAGE WRAPPER
export default async function Page({ params }: Props) {
  // 2. Unpack the promise here too
  const { id } = await params;

  return <ArticleDetailClient id={id} />;
}
