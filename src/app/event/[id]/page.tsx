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
const PRODUCTION_URL = "https://www.prxph.com";

// --- Helper Utilities ---
/**
 * Resolves full asset URLs for SEO and OpenGraph metadata images.
 * Aligned to match your production NestJS router bindings prefix.
 */
const resolveMetadataImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "";
  return imagePath.startsWith("http")
    ? imagePath
    : `${BACKEND_API}/uploads/${imagePath}`;
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
      event.description?.substring(0, 155) ||
      "Explore performance data and registration details for this ePRX event.";
    const capitalizedTitle = event.title.toUpperCase();

    return {
      title: `${capitalizedTitle} | PRX EVENTS`,
      description: fallbackDescription,
      openGraph: {
        title: event.title,
        description: fallbackDescription,
        url: `${PRODUCTION_URL}/events/${id}`,
        siteName: "PRX",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: `Event flyer for ${event.title}`,
              },
            ]
          : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: event.title,
        description: fallbackDescription,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Metadata resolution fallback activated:", error);
    return {
      title: "PRX | LIVE EVENTS",
      description: "Access live and upcoming ePRX performance assets.",
    };
  }
}

// --- Main Server Component Router Entry ---
export default async function Page({ params }: RouteProps) {
  const { id } = await params;

  // Pass the unwrapped ID safely down to the client container
  return <EventDetailClient id={id} />;
}
