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
  // 1. Double-wrap parameter parsing to prevent unhandled runtime rejections
  let id = "";
  try {
    const resolvedParams = await params;
    id = resolvedParams?.id || "";
  } catch (e) {
    console.error("METADATA_PARAM_READ_CRASH:", e);
  }

  // 2. Fallback baseline metadata if no valid ID was extracted
  const fallbackTitle = "PRX | LIVE EVENTS";
  const fallbackDesc = "Access live and upcoming ePRX performance assets.";

  if (!id) {
    return { title: fallbackTitle, description: fallbackDesc };
  }

  try {
    // 3. Set an explicit short timeout signal so the fetch doesn't hang Vercel
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${BACKEND_API}/events/${id}`, {
      next: { revalidate: 300 },
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "ePRX-Next-Server-Component", // Identifies serverless outbound calls clearly
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      // Don't crash out the server component; log it and return elegant defaults
      console.error(`Backend returned status ${res.status} for event lookup.`);
      return {
        title: `EVENT REGISTRATION | PRX`,
        description: fallbackDesc,
      };
    }

    const event: EventApiPayload = await res.json();
    const imageUrl = resolveMetadataImageUrl(event?.image);
    const fallbackDescription =
      event?.description?.substring(0, 155) || fallbackDesc;
    const capitalizedTitle = event?.title
      ? event.title.toUpperCase()
      : "LIVE EVENT";

    return {
      title: `${capitalizedTitle} | PRX EVENTS`,
      description: fallbackDescription,
      openGraph: {
        title: event?.title || capitalizedTitle,
        description: fallbackDescription,
        url: `${PRODUCTION_URL}/events/${id}`,
        siteName: "PRX",
        images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
        type: "article",
      },
    };
  } catch (error) {
    // 🔥 THE ABSOLUTE GUARD: If the network layer or JSON parser fails,
    // never let the server error out. Return valid SEO data.
    console.error("CRITICAL METADATA CATCH ACTIVATED:", error);
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDesc,
        type: "website",
      },
    };
  }
}

// --- Main Server Component Router Entry ---
export default async function Page({ params }: RouteProps) {
  const { id } = await params;

  // Pass the unwrapped ID safely down to the client container
  return <EventDetailClient id={id} />;
}
