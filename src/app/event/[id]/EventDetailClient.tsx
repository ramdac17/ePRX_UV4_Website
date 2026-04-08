"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  organizer: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  image: string | null;
  date: string;
  createdAt: string;
  eventUrl: string;
}

export default function EventDetailClient({ id }: { id: string }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const STATIC_URL = BACKEND_API.replace("/api", "");

  const shareToFacebook = () => {
    if (!event) return;
    const url = window.location.href;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  useEffect(() => {
    async function fetchEvent() {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND_API}/events/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
        } else {
          setError("MISSION_INTEL_NOT_FOUND");
        }
      } catch (err) {
        setError("UPLINK_FAILURE");
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, BACKEND_API]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0a0a]">
        <h2 className="font-mono text-eprx-lime animate-pulse tracking-[4px]">
          DECRYPTING MISSION STREAM...
        </h2>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0a] gap-5">
        <h2 className="font-mono text-red-500 tracking-widest uppercase">
          || ERROR: {error}
        </h2>
        <Link
          href="/events"
          className="border border-eprx-lime text-eprx-lime px-6 py-2 font-mono hover:bg-eprx-lime hover:text-black transition-all"
        >
          RETURN_TO_BASE
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-16 px-6 md:px-[8%]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-[0.65rem] md:text-xs text-eprx-lime font-mono tracking-[2px] mb-4">
            <span className="uppercase">LIVE EVENT</span>
            <span className="text-[#333]">||</span>
            <span className="uppercase">
              {new Date(event.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                timeZone: "UTC",
              })}
            </span>
          </div>

          <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl leading-none mb-8 wrap-break-word">
            {event.title.toUpperCase()}
          </h1>

          <div className="flex flex-col md:flex-row gap-8 md:gap-16 border-t border-[#1a1a1a] pt-6">
            <div className="flex flex-col gap-1">
              <span className="text-[0.6rem] font-mono text-[#444] tracking-wider uppercase">
                LOCATION:
              </span>
              <span className="text-sm md:text-base font-mono text-[#999] uppercase">
                {event.location}
              </span>

              <button
                onClick={shareToFacebook}
                className="flex items-center gap-2 mt-2 text-[#444] hover:text-eprx-lime transition-colors font-mono text-[0.6rem] tracking-widest uppercase"
              >
                <svg
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                SHARE ON FACEBOOK
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[0.6rem] font-mono text-[#444] tracking-wider uppercase">
                ORGANIZER:
              </span>
              <span className="text-sm md:text-base font-mono text-[#999] uppercase">
                {event.organizer}
              </span>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {event.image && (
          <div className="w-full aspect-video md:h-125 mb-12 border border-[#222] bg-black overflow-hidden shadow-2xl relative">
            <img
              src={
                event.image.startsWith("http")
                  ? event.image
                  : `${STATIC_URL}/uploads/${event.image}`
              }
              alt={event.title}
              className="w-full h-full object-cover filter contrast-110 brightness-105"
            />
          </div>
        )}

        {/* Content Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h3 className="text-eprx-lime font-mono text-[0.7rem] tracking-[3px] mb-6 uppercase">
              || EVENT DETAILS
            </h3>
            <div className="text-[#ccc] leading-relaxed space-y-6 text-base md:text-lg whitespace-pre-line">
              {event.description}
            </div>
          </div>

          {/* Sidebar Contact Card */}
          <aside className="h-fit">
            <div className="bg-eprx-dark p-8 border border-[#1a1a1a]">
              <h3 className="text-eprx-lime font-mono text-[0.7rem] tracking-[3px] mb-6 uppercase">
                || POINT OF CONTACT
              </h3>
              <div className="space-y-4 font-mono text-[0.7rem] md:text-[0.75rem] text-[#888]">
                <p>
                  NAME:{" "}
                  <span className="text-white ml-2">
                    {event.firstName} {event.lastName}
                  </span>
                </p>
                <p>
                  EMAIL:{" "}
                  <span className="text-white ml-2 lowercase">
                    {event.email}
                  </span>
                </p>
                <p>
                  MOBILE:{" "}
                  <span className="text-white ml-2">{event.mobile}</span>
                </p>
                <div className="pt-4 border-t border-[#222] mt-4">
                  <p className="mb-2">OFFICIAL UPLINK:</p>
                  <a
                    href={
                      event.eventUrl.startsWith("http")
                        ? event.eventUrl
                        : `https://${event.eventUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-eprx-lime hover:text-white transition-colors break-all underline underline-offset-4 decoration-eprx-lime/30 hover:decoration-white"
                  >
                    {event.eventUrl}
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </main>

        <footer className="mt-24 text-center border-t border-[#222] pt-8">
          <p className="text-[#444] font-mono text-[0.6rem] tracking-[4px] uppercase">
            PRX ARTICLES
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
