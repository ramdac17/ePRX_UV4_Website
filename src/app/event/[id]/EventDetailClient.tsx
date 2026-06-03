"use client";

import React, { useState, useEffect } from "react";
import EventDetailView from "./EventDetailView";

interface EventDetailClientProps {
  id: string;
}

export default function EventDetailClient({ id }: EventDetailClientProps) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const STATIC_URL = BACKEND_API.replace("/api", "");

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

  /**
   * Refactored Share Handler matching your main PRX Website implementation strategy
   */
  const handleShare = async (e: React.MouseEvent) => {
    if (!event) return;
    const url = window.location.href;
    const title = event.title;

    // Priority 1: Use Native Share API for mobile devices (iOS / Android)
    if (navigator.share) {
      e.preventDefault(); // Stop anchor from launching default fallback blank window
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          console.log("Share uplink execution aborted by client view");
        } else {
          // If native share breaks or drops out, trigger explicit desktop popup fallback channel
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank",
          );
        }
      }
    }
    // Priority 2: Native fallback. If navigator.share doesn't exist (Desktop Browsers),
    // the <a> tag's default behavior takes over and follows the target web url link safely.
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
      shareToFacebook={handleShare}
      STATIC_URL={STATIC_URL}
    />
  );
}
