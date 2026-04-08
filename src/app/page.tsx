import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    // Updated bg-[#0f0f0f] to use our theme variable eprx-dark
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-eprx-dark">
      {/* Background Glow Effect - Keeping hex here is fine, but moved opacity/blur to standard classes */}
      <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-eprx-lime opacity-10 blur-3xl" />

      <main className="relative z-10 flex flex-col items-center px-6 text-center">
        <div className="mb-8">
          <Image
            className="logo-glow rounded-full"
            src="/assets/images/ePRE1.png"
            alt="PRX Logo"
            width={120}
            height={120}
            priority
          />
        </div>

        {/* Updated text-[#d4ff00] to text-eprx-lime */}
        <h1 className="font-bebas text-6xl tracking-tighter text-white md:text-8xl">
          BEYOND THE <span className="text-eprx-lime">MILE</span>
        </h1>

        <p className="mt-4 max-w-lg text-lg text-zinc-400 font-inter">
          Precision gear for those who refuse to stop. Track your missions,
          analyze your performance, and join the ePRX ecosystem.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/auth/register"
            // Updated background to eprx-lime
            className="flex h-14 items-center justify-center rounded-full bg-eprx-lime px-10 text-lg font-bold text-black transition-transform hover:scale-105 active:scale-95"
          >
            JOIN THE MISSION
          </Link>
          <Link
            href="/journal"
            className="flex h-14 items-center justify-center rounded-full border border-white/20 px-10 text-lg font-bold text-white transition-colors hover:bg-white/10"
          >
            VIEW JOURNAL
          </Link>
        </div>
      </main>

      {/* Decorative Pillar Hint */}
      <div className="absolute bottom-10 flex gap-8 opacity-30 font-bebas text-2xl text-white">
        <span>GEAR</span>
        <span className="text-eprx-lime">•</span>
        <span>FUEL</span>
        <span className="text-eprx-lime">•</span>
        <span>MIND</span>
      </div>
    </div>
  );
}
