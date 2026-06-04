import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * 🌏 THE WAREHOUSE: Production Custom API Domain (Railway)
 * Points directly to your secure backend API sub-route.
 */
const BACKEND_API = "https://api.prxph.com/api/activities";

/**
 * 🚀 THE BILLBOARD: Production Custom Domain (Vercel)
 * Used for OpenGraph canonical URLs to ensure proper social sharing attribution.
 */
const PRODUCTION_URL = "https://www.prxph.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    // Next.js deduplicates this fetch with the one in the component body
    const res = await fetch(`${BACKEND_API}/${id}`);
    if (!res.ok) throw new Error();
    const activity = await res.json();

    const statsSummary = `${activity.distance}KM/S | ${activity.pace} | ${Math.floor(activity.duration / 60)}M`;

    // Ensure the image URL is absolute and fallback safely if missing
    const imageUrl =
      activity.mapImageUrl ||
      activity.shareImageUrl ||
      `${PRODUCTION_URL}/default-share-image.png`;

    return {
      title: `ePRX MISSION: ${activity.title}`,
      description: `Mission Stats: ${statsSummary}`,
      openGraph: {
        title: `ePRX MISSION LOG: ${activity.title}`,
        description: `View my mission performance data on the ePRX platform.`,
        url: `${PRODUCTION_URL}/activity/${id}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `Mission map for ${activity.title}`,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `ePRX MISSION LOG: ${activity.title}`,
        description: `Mission Stats: ${statsSummary}`,
        images: [imageUrl],
      },
    };
  } catch (e) {
    return {
      title: "ePRX MISSION ARCHIVE",
      description: "Access historical ePRX UV1 performance assets.",
    };
  }
}

export default async function ActivityPage({ params }: Props) {
  const { id } = await params;

  // ⚡️ OPTIMIZATION: Clean, secure production connection to api.prxph.com
  const res = await fetch(`${BACKEND_API}/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store", // Bypasses caches to guarantee immediate DB accuracy
  });

  if (!res.ok) {
    // 💡 LOGGING: This will show up in your Vercel Logs (Dashboard > Project > Logs)
    console.error(`Failed to fetch activity sequence data for ID: ${id}`);
    return (
      <div className="min-h-screen bg-black text-zinc-500 p-8 flex flex-col items-center justify-center font-mono text-center">
        <div className="text-cyan-500 text-4xl mb-4 opacity-50">!</div>
        <h2 className="text-white tracking-[0.3em] mb-2">MISSION_NOT_FOUND</h2>
        <p className="text-[10px] uppercase tracking-widest text-zinc-700 max-w-xs">
          ID: {id}
          <br />
          NODE:{" "}
          {BACKEND_API.includes("railway") ? "REMOTE_RAILWAY" : "LOCAL_HOST"}
        </p>
      </div>
    );
  }

  const activity = await res.json();

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center font-sans">
      {/* ⚡️ SPACER: Prevents navbar overlap (adjust pt-24 based on your nav height) */}
      <div className="pt-36 pb-12 w-full flex justify-center">
        {/* 🚀 COMPACT CARD: max-w-sm (384px) for a focused, sharp look */}
        <div className="max-w-sm w-full border border-cyan-500/20 bg-zinc-900/40 p-4 rounded-xl backdrop-blur-md shadow-[0_0_25px_rgba(0,255,242,0.05)]">
          {/* Cyber Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-[7px] text-cyan-500 font-mono tracking-[0.3em] mb-0.5 uppercase opacity-60">
                LOG_ID: {id.slice(-8).toUpperCase()}
              </p>
              <h1 className="text-xl font-black tracking-tighter text-white leading-none">
                {activity.title.toUpperCase()}
              </h1>
            </div>
            <div className="h-px w-6 bg-cyan-500 mt-2.5 shadow-[0_0_8px_#06b6d4]"></div>
          </div>

          {/* Stats Grid - Ultra Tight */}
          <div className="grid grid-cols-3 gap-1 mb-4 py-3 border-y border-zinc-800/40">
            <div className="text-center">
              <p className="text-zinc-500 text-[7px] font-bold tracking-widest mb-0.5 uppercase">
                DIST
              </p>
              <p className="text-lg font-mono text-white leading-none">
                {activity.distance}
                <span className="text-[9px] text-zinc-500 ml-0.5">KM/S</span>
              </p>
            </div>
            <div className="text-center border-x border-zinc-800/30">
              <p className="text-zinc-500 text-[7px] font-bold tracking-widest mb-0.5 uppercase">
                TIME
              </p>
              <p className="text-lg font-mono text-white leading-none">
                {Math.floor(activity.duration / 60)}
                <span className="text-[9px] text-zinc-500 ml-0.5">M</span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-zinc-500 text-[7px] font-bold tracking-widest mb-0.5 uppercase">
                PACE
              </p>
              <p className="text-lg font-mono text-white leading-none">
                {activity.pace}
              </p>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-cyan-500/5 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
            <img
              src={activity.mapImageUrl || activity.shareImageUrl}
              alt="Mission Map"
              className="relative w-full rounded-lg border border-zinc-800/50 shadow-lg"
            />
          </div>

          {/* Minimalist Footer */}
          <div className="mt-4 flex flex-col items-center opacity-40">
            <p className="text-[6px] text-zinc-600 font-mono tracking-[0.5em] uppercase">
              E-PRX UV1 // SECURE_NODE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
