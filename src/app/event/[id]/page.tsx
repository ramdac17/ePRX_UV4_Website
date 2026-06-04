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
  const fallbackTitle = "PRX | LIVE EVENTS";
  const fallbackDesc = "Access live and upcoming ePRX UV1 performance assets.";

  // 1. Safely resolve route parameters
  let id = "";
  try {
    const resolvedParams = await params;
    id = resolvedParams?.id || "";
  } catch (e) {
    console.error("METADATA_PARAM_READ_CRASH:", e);
  }

  if (!id) {
    return { title: fallbackTitle, description: fallbackDesc };
  }

  try {
    // 2. Fetch event data from backend API
    const res = await fetch(`${BACKEND_API}/article/${id}`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Backend returned status ${res.status} for id: ${id}`);
      return { title: "EVENT | PRX", description: fallbackDesc };
    }

    const event = await res.json();

    // 3. Construct dynamic values
    const titleText = event?.title || "LIVE EVENT";
    const descriptionText = event?.description || fallbackDesc;

    const imageUrl = event?.image
      ? event.image.startsWith("http")
        ? event.image
        : `${BACKEND_API}/uploads/${event.image}`
      : null;

    // 4. Return unified Metadata payload
    return {
      title: `${titleText.toUpperCase()} | PRX`,
      description: descriptionText,
      openGraph: {
        title: titleText,
        description: descriptionText,
        url: `https://www.prxph.com/event/${id}`,
        siteName: "PRX",
        type: "article",
        images: imageUrl ? [{ url: imageUrl }] : [],
      },
    };
  } catch (error) {
    console.error("METADATA_GENERATION_FAILED:", error);
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
