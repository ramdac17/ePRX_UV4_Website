import { Metadata } from "next";
import EventDetailClient from "./EventDetailClient";

// --- Types & Interfaces ---
interface RouteProps {
  params: Promise<{ id: string }>;
}

interface EventApiPayload {
  title?: string;
  description?: string;
  image?: string;
}

// --- Configuration Constants ---
const BACKEND_API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const STATIC_BASE_URL = BACKEND_API.replace("/api", "");

// --- Helper Utilities ---
/**
 * Resolves full asset URLs for SEO and OpenGraph metadata images.
 */
const resolveMetadataImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "";
  return imagePath.startsWith("http")
    ? imagePath
    : `${STATIC_BASE_URL}/uploads/${imagePath}`;
};

// --- SEO Metadata Generator ---
export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const res = await fetch(`${BACKEND_API}/events/${id}`, {
      next: { revalidate: 300 }, // Cache optimization: revalidate every 5 minutes
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch metadata for event ID: ${id}`);
    }

    const event: EventApiPayload = await res.json();

    if (!event || !event.title) {
      throw new Error("API payload did not contain expected event attributes");
    }

    const imageUrl = resolveMetadataImageUrl(event.image);
    const fallbackDescription =
      event.description?.substring(0, 160) ||
      "Explore details about this event.";
    const capitalizedTitle = event.title.toUpperCase();

    return {
      title: `${capitalizedTitle} | ARTICLES ARCHIVE`,
      description: fallbackDescription,
      openGraph: {
        title: event.title,
        description: fallbackDescription,
        images: imageUrl ? [{ url: imageUrl }] : [],
        type: "article",
      },
    };
  } catch (error) {
    console.error("Metadata resolution fallback activated:", error);
    return {
      title: "PRX | ARTICLES ARCHIVE",
    };
  }
}

// --- Main Server Component Router Entry ---
export default async function Page({ params }: RouteProps) {
  const { id } = await params;

  // We pass the id down. To satisfy the prop contract safely without crossing
  // serialization boundaries, let's make sure Client handles the share implementation.
  return <EventDetailClient id={id} />;
}
