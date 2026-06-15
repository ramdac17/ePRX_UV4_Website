"use client";

import React, { useState, useEffect } from "react";
import EventDetailView from "./EventDetailView";
import { shareToFacebook } from "@/lib/share"; // 🚀 1. IMPORT YOUR CENTRALIZED POPUP ENGINE

interface EventDetailClientProps {
  id: string;
}

export default function EventDetailClient({ id }: EventDetailClientProps) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  const STATIC_URL = BACKEND_API;

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`${BACKEND_API}/events/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        }
      } catch (err) {
        console.error("Error fetching event in client wrapper:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id, BACKEND_API]);

  // 🚀 2. ALIGNED COMPLIANT SHARE HANDLER
  const handleShare = async (e: React.MouseEvent) => {
    if (!event) return;
    e.preventDefault(); // Intercept default browser redirect triggers

    const currentPath = `/events/${id}`; // Target location for the specific event
    const absoluteUrl =
      typeof window !== "undefined" ? window.location.href : "";

    // Priority 1: Use Native Share API for mobile devices (iOS / Android)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          url: absoluteUrl,
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Share uplink execution aborted by client view");
          return;
        }
      }
    }

    // Priority 2: Fire your centralized centered desktop popup engine!
    shareToFacebook(currentPath);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-mono text-xs tracking-widest">
        LOADING UPLINK...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-mono text-xs tracking-widest">
        EVENT NOT FOUND
      </div>
    );
  }

  return (
    <EventDetailView
      event={event}
      shareToFacebook={handleShare} // 🚀 Passes the newly aligned logic down cleanly
      STATIC_URL={STATIC_URL}
    />
  );
}
