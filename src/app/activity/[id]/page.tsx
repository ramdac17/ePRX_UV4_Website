import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * 🌏 THE WAREHOUSE: Railway API
 * Must match the @Controller('activities') prefix in your NestJS backend.
 */
const RAILWAY_API =
  "https://eprxuv1-monorepo-production.up.railway.app/activities";

/**
 * 🚀 THE BILLBOARD: Vercel Deployment
 * Used for OpenGraph canonical URLs.
 */
const VERCEL_URL = "https://e-prx-uv-4-website.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    // Next.js deduplicates this fetch with the one in the component body
    const res = await fetch(`${RAILWAY_API}/${id}`);
    if (!res.ok) throw new Error();
    const activity = await res.json();

    const statsSummary = `${activity.distance}KM | ${activity.pace} | ${Math.floor(activity.duration / 60)}M`;

    return {
      title: `ePRX MISSION: ${activity.title}`,
      description: `Mission Stats: ${statsSummary}`,
      openGraph: {
        title: `ePRX MISSION LOG: ${activity.title}`,
        description: `View my mission performance data on the ePRX platform.`,
        url: `${VERCEL_URL}/activity/${id}`,
        images: [
          {
            url: activity.shareImageUrl || activity.mapImageUrl,
            width: 1200,
            height: 630,
            alt: `Mission map for ${activity.title}`,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `ePRX MISSION: ${activity.title}`,
        description: statsSummary,
        images: [activity.shareImageUrl || activity.mapImageUrl],
      },
    };
  } catch (e) {
    return { title: "ePRX MISSION ARCHIVE" };
  }
}

export default async function ActivityPage({ params }: Props) {
  const { id } = await params;

  // ⚡️ ADDED: Explicit headers and no-store to bypass Vercel/Railway caching issues
  const res = await fetch(`${RAILWAY_API}/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store", // This forces a fresh look at the DB every time
  });

  if (!res.ok) {
    // 💡 LOGGING: This will show up in your Vercel Logs (Dashboard > Project > Logs)

    return (
      <div className="min-h-screen bg-black text-zinc-500 p-8 flex flex-col items-center justify-center font-mono text-center">
        <div className="text-cyan-500 text-4xl mb-4 opacity-50">!</div>
        <h2 className="text-white tracking-[0.3em] mb-2">MISSION_NOT_FOUND</h2>
        <p className="text-[10px] uppercase tracking-widest text-zinc-700 max-w-xs">
          ID: {id}
          <br />
          NODE:{" "}
          {RAILWAY_API.includes("railway") ? "REMOTE_RAILWAY" : "LOCAL_HOST"}
        </p>
      </div>
    );
  }

  const activity = await res.json();

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full border border-cyan-500/20 bg-zinc-900/40 p-6 rounded-2xl backdrop-blur-md shadow-[0_0_40px_rgba(0,255,242,0.05)]">
        {/* Cyber Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] text-cyan-500 font-mono tracking-[0.3em] mb-1 uppercase">
              SYSTEM_LOG_ID: {id.slice(-12).toUpperCase()}
            </p>
            <h1 className="text-4xl font-black tracking-tighter text-white">
              {activity.title.toUpperCase()}
            </h1>
          </div>
          <div className="h-1 w-16 bg-cyan-500 mt-4 shadow-[0_0_15px_#06b6d4]"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-y border-zinc-800/50">
          <div className="text-center md:text-left">
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest mb-1 uppercase">
              DISTANCE
            </p>
            <p className="text-3xl font-mono text-white">
              {activity.distance}
              <span className="text-xs text-zinc-500 ml-1">KM</span>
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest mb-1 uppercase">
              DURATION
            </p>
            <p className="text-3xl font-mono text-white">
              {Math.floor(activity.duration / 60)}
              <span className="text-xs text-zinc-500 ml-1">M</span>
            </p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest mb-1 uppercase">
              AVG_PACE
            </p>
            <p className="text-3xl font-mono text-white">{activity.pace}</p>
          </div>
        </div>

        {/* Visual Map Render */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-cyan-500/20 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <img
            src={activity.shareImageUrl || activity.mapImageUrl}
            alt="Mission Data Visual"
            className="relative w-full rounded-lg border border-zinc-800 shadow-2xl transition-all duration-500"
          />
        </div>

        {/* Brand Footer */}
        <div className="mt-8 pt-4 border-t border-zinc-900 flex flex-col items-center">
          <p className="text-center text-[9px] text-zinc-700 font-mono tracking-[0.4em] uppercase">
            E-PRX High Performance Lifestyle Ecosystem // Secure Data Node
          </p>
        </div>
      </div>
    </div>
  );
}
