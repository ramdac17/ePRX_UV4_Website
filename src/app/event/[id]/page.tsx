import { Metadata } from "next";
import EventDetailClient from "./EventDetailClient";

interface RouteProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface EventApiPayload {
  title?: string;
  description?: string;
  image?: string;
}

const BACKEND_API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const PRODUCTION_URL = "https://www.prxph.com";

// --- SEO Metadata Generator ---
export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const fallbackTitle = "PRX | LIVE EVENTS";
  const fallbackDesc = "Access live and upcoming ePRX UV1 performance assets.";

  // A pristine default image path to fall back on if nothing else is available
  const DEFAULT_SHARE_IMAGE = `${PRODUCTION_URL}/images/default-share-banner.jpg`;

  const { id } = await params;

  if (!id) {
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      openGraph: { images: [{ url: DEFAULT_SHARE_IMAGE }] },
    };
  }

  try {
    // 🚀 FIXED: Changed route path endpoint from '/article/' to '/event/'
    const res = await fetch(`${BACKEND_API}/event/${id}`, {
      next: { revalidate: 300 }, // Keep cache loop optimized at 5 minutes
    });

    if (!res.ok) {
      console.error(
        `CRITICAL: Backend API failed for metadata ID ${id}. Status: ${res.status}`,
      );
      return {
        title: "EVENT | PRX",
        description: fallbackDesc,
        openGraph: {
          title: "EVENT | PRX",
          description: fallbackDesc,
          url: `${PRODUCTION_URL}/event/${id}`,
          images: [{ url: DEFAULT_SHARE_IMAGE }],
        },
      };
    }

    const event: EventApiPayload = await res.json();

    const titleText = event?.title || "LIVE EVENT";
    const descriptionText = event?.description || fallbackDesc;

    // Resolve structural asset path matching NestJS storage architecture
    let imageUrl = DEFAULT_SHARE_IMAGE;
    if (event?.image) {
      imageUrl = event.image.startsWith("http")
        ? event.image
        : `${BACKEND_API}/uploads/${event.image}`;
    }

    return {
      title: `${titleText.toUpperCase()} | PRX`,
      description: descriptionText,
      openGraph: {
        title: titleText,
        description: descriptionText,
        url: `${PRODUCTION_URL}/event/${id}`,
        siteName: "PRX",
        type: "article",
        images: [{ url: imageUrl }],
      },
    };
  } catch (error) {
    console.error("METADATA GENERATION FAILED:", error);
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      openGraph: {
        images: [{ url: DEFAULT_SHARE_IMAGE }],
      },
    };
  }
}

// --- Main Server Component Router Entry ---
export default async function Page({ params }: RouteProps) {
  const { id } = await params;
  return <EventDetailClient id={id} />;
}
