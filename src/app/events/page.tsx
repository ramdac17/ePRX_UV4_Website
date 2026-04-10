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
  image: string | null;
  date: string;
  createdAt: string;
}

export default function LiveEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const STATIC_URL = BACKEND_API.replace("/api", "");

  useEffect(() => {
    async function fetchLiveEvents() {
      try {
        const response = await fetch(`${BACKEND_API}/events`);
        if (response.ok) {
          const data: Event[] = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("EVENT_FETCH_PROTOCOL_FAILURE:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveEvents();
  }, [BACKEND_API]);

  const filteredEvents = events.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower) ||
      event.organizer.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-6 md:px-[8%]">
      {/* Header Section */}
      <header className="mb-10 border-b border-[#1a1a1a] pb-10 text-left">
        <h1 className="font-bebas text-5xl md:text-8xl leading-[0.9] tracking-tighter m-0 uppercase">
          LIVE <span className="text-eprx-lime">EVENTS</span>
        </h1>
        <p className="text-[#444] font-mono tracking-[4px] text-[0.7rem] md:text-xs mt-4">
          REAL-TIME AND UPCOMING MISSIONS
        </p>
      </header>

      {/* Search Interface */}
      <div className="flex justify-center mb-16">
        <div className="w-full max-w-2xl flex flex-col gap-2 group">
          <label className="font-mono text-[0.65rem] text-eprx-lime tracking-[2px] uppercase">
            SEARCH_EVENTS:
          </label>
          <input
            type="text"
            placeholder="FILTER BY MISSION, LOCATION, OR ORGANIZER..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white font-mono text-lg py-2 tracking-wider placeholder:text-[#222]"
          />
          <div className="h-px bg-[#333] w-full group-focus-within:bg-eprx-lime transition-colors duration-300" />
        </div>
      </div>

      {/* Main Content Feed */}
      <main>
        {loading ? (
          <div className="flex justify-center py-24">
            <h2 className="font-mono text-eprx-lime animate-pulse tracking-[4px] uppercase text-sm md:text-base">
              SYNCHRONIZING LIVE FEED...
            </h2>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="group block"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] h-full flex flex-col transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="h-52 bg-[#111] overflow-hidden relative border-b border-[#1a1a1a]">
                    {event.image ? (
                      <img
                        src={
                          event.image.startsWith("http")
                            ? event.image
                            : `${STATIC_URL}/uploads/${event.image}`
                        }
                        alt={event.title}
                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-eprx-dark">
                        <span className="text-[#1a1a1a] font-bebas text-4xl tracking-[5px] uppercase">
                          NO SIGNAL
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/80 text-eprx-lime text-[0.6rem] px-2 py-1 font-mono border border-eprx-lime uppercase">
                      {event.location}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[#666] text-[0.6rem] font-mono tracking-[2px] mb-4 uppercase font-bold">
                      ORGANIZER: {event.organizer} ||{" "}
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        timeZone: "UTC", // ⚡ FIX: Prevents the 1-day drift glitch
                      })}
                    </span>
                    <h2 className="font-bebas text-3xl leading-none mb-4 uppercase">
                      {event.title}
                    </h2>
                    <p className="text-[#888] text-sm leading-relaxed mb-6 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#1a1a1a]">
                      <span className="text-eprx-lime text-[0.7rem] font-mono tracking-widest font-bold uppercase">
                        READ DETAILS
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-mono text-[#444] text-xs md:text-sm tracking-widest uppercase">
              {searchTerm
                ? `NO MISSIONS MATCHING: "${searchTerm}"`
                : "NO LIVE TRANSMISSIONS DETECTION"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
