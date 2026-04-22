import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

// 🌏 THE WAREHOUSE: Where we get the data
const RAILWAY_API =
  "https://eprxuv1-monorepo-production.up.railway.app/activities";

// 🚀 THE BILLBOARD: Where people land when they click
const VERCEL_URL = "https://e-prx-uv-4-website.vercel.app";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Fetch from Railway
  const res = await fetch(`${RAILWAY_API}/${id}`);
  const activity = await res.json();

  return {
    title: `ePRX MISSION: ${activity.title}`,
    openGraph: {
      title: `ePRX MISSION LOG: ${activity.title}`,
      description: `Check out my latest mission stats on ePRX UV1.`,

      // 🚀 CORRECT: Send users to your Vercel site
      url: `${VERCEL_URL}/activities/${id}`,

      images: [
        {
          url: activity.shareImageUrl, // The Cloudinary image
          width: 1080,
          height: 1080,
        },
      ],
      type: "website",
    },
  };
}

export default async function ActivityPage({ params }: Props) {
  // 🚀 CRITICAL: You must await params here too!
  const { id } = await params;

  const res = await fetch(`${RAILWAY_API}/${id}`, {
    next: { revalidate: 60 }, // Optional: keeps your Vercel site snappy
  });

  // Basic error handling if the ID doesn't exist
  if (!res.ok) return <div className="text-white p-20">MISSION_NOT_FOUND</div>;

  const activity = await res.json();

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full border border-cyan-500/30 bg-zinc-900/50 p-6 rounded-xl shadow-[0_0_20px_rgba(0,255,242,0.1)]">
        <h1 className="text-3xl font-black tracking-tighter mb-4 text-cyan-400">
          {activity.title.toUpperCase()}
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div>
            <p className="text-zinc-500 text-xs font-bold">DISTANCE</p>
            <p className="text-2xl font-mono">{activity.distance} KM</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-bold">DURATION</p>
            <p className="text-2xl font-mono">
              {Math.floor(activity.duration / 60)}M
            </p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-bold">PACE</p>
            <p className="text-2xl font-mono">{activity.pace}</p>
          </div>
        </div>

        {/* The Cyber Map we see in the app */}
        <img
          src={activity.shareImageUrl}
          alt="Mission Card"
          className="w-full rounded-lg border border-zinc-800"
        />
      </div>
    </div>
  );
}
