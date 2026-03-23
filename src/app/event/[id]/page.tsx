import { Metadata } from "next";
import EventDetailClient from "./EventDetailClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  try {
    const res = await fetch(`${BACKEND_API}/events/${id}`);
    const event = await res.json();
    const imageUrl = event.image?.startsWith("http")
      ? event.image
      : `${BACKEND_API.replace("/api", "")}/uploads/${event.image}`;

    return {
      title: `${event.title.toUpperCase()} | MISSION_INTEL`,
      description: event.description.substring(0, 160),
      openGraph: {
        title: event.title,
        description: event.description.substring(0, 160),
        images: [{ url: imageUrl }],
        type: "article",
      },
    };
  } catch (e) {
    return { title: "PRX | MISSION_ARCHIVE" };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <EventDetailClient id={id} />;
}
