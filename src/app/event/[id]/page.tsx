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
  let id = "";
  try {
    const resolvedParams = await params;
    id = resolvedParams?.id || "";
  } catch (e) {
    console.error("METADATA_PARAM_READ_CRASH:", e);
  }

  const fallbackTitle = "PRX | LIVE EVENTS";
  const fallbackDesc = "Access live and upcoming ePRX performance assets.";

  if (!id) {
    return { title: fallbackTitle, description: fallbackDesc };
  }

  try {
    // 🌐 1. Ensure this points to your exact backend route pluralization
    const res = await fetch(`${BACKEND_API}/article/${id}`, {
      // or /event/${id} depending on backend routing definitions
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Backend returned status ${res.status} for id: ${id}`);
      return {
        title: `EVENT | PRX`,
        description: fallbackDesc,
      };
    }

    const event = await res.json();

    return {
      title: `${event?.title?.toUpperCase() || "LIVE EVENT"} | PRX`,
      description: event?.description || fallbackDesc,
      openGraph: {
        title: event?.title || "LIVE EVENT",
        description: event?.description || fallbackDesc,

        // 🚨 2. FIXED CANONICAL URL MATCHING:
        // Your current code is appending an 's' making it /events/ instead of /event/
        url: `https://www.prxph.com/event/${id}`,

        siteName: "PRX",
        images: event?.image
          ? [
              {
                url: event.image.startsWith("http")
                  ? event.image
                  : `${BACKEND_API}/uploads/${event.image}`,
              },
            ]
          : [],
        type: "article",
      },
    };
  } catch (error) {
    return {
      title: fallbackTitle,
      description: fallbackDesc,
    };
  }
}

// --- Main Server Component Router Entry ---
export default async function Page({ params }: RouteProps) {
  const { id } = await params;

  // Pass the unwrapped ID safely down to the client container
  return <EventDetailClient id={id} />;
}
