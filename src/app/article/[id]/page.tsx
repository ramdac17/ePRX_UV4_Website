import { Metadata } from "next";
import ArticleDetailClient from "./ArticleDetailClient";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    const res = await fetch(`${BACKEND_API}/articles/${id}`);
    const article = await res.json();
    const imageUrl = article.image?.startsWith("http")
      ? article.image
      : `${BACKEND_API.replace("/api", "")}/uploads/${article.image}`;

    return {
      title: `${article.title.toUpperCase()} | PRX ARCHIVES`,
      openGraph: {
        title: article.title,
        description: article.content.substring(0, 160),
        images: [imageUrl],
      },
    };
  } catch (e) {
    return { title: "PRX ARCHIVE" };
  }
}

export default function Page({ params }: Props) {
  return <ArticleDetailClient id={params.id} />;
}
