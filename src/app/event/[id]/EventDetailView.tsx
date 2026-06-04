"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// --- Types & Interfaces ---
interface EventData {
  date: string | Date;
  title: string;
  location: string;
  organizer: string;
  image?: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  eventUrl: string;
}

export interface EventPageProps {
  event: EventData;
  shareToFacebook: (e: React.MouseEvent) => void;
  STATIC_URL: string;
}

interface MetaItemProps {
  label: string;
  value: string;
}

interface ContactLineProps {
  label: string;
  value: string;
  className?: string;
}

// --- Sub-components ---
const MetaItem: React.FC<MetaItemProps> = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[0.6rem] font-mono text-[#444] tracking-wider uppercase">
      {label}:
    </span>
    <span className="text-sm md:text-base font-mono text-[#999] uppercase">
      {value}
    </span>
  </div>
);

const ContactLine: React.FC<ContactLineProps> = ({
  label,
  value,
  className = "",
}) => (
  <p>
    {label}:<span className={`text-white ml-2 ${className}`}>{value}</span>
  </p>
);

const EventDetailView: React.FC<EventPageProps> = ({
  event,
  shareToFacebook,
  STATIC_URL,
}) => {
  const formattedDate = useMemo(() => {
    return new Date(event.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    });
  }, [event.date]);

  const heroImageUrl = useMemo(() => {
    if (!event.image) return "";
    return event.image.startsWith("http")
      ? event.image
      : `${STATIC_URL}/uploads/${event.image}`;
  }, [event.image, STATIC_URL]);

  const fallbackEventUrl = useMemo(() => {
    if (!event.eventUrl) return "";
    return event.eventUrl.startsWith("http://") ||
      event.eventUrl.startsWith("https://")
      ? event.eventUrl
      : `https://${event.eventUrl}`;
  }, [event.eventUrl]);

  const currentHref = typeof window !== "undefined" ? window.location.href : "";

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
            <span className="uppercase">{formattedDate}</span>
          </div>

          <h1 className="font-bebas text-5xl md:text-7xl lg:text-8xl leading-none mb-8 wrap-break-word">
            {event.title.toUpperCase()}
          </h1>

          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-[#1a1a1a] pt-6">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <MetaItem label="LOCATION" value={event.location} />
              <MetaItem label="ORGANIZER" value={event.organizer} />
            </div>

            {/* Share Anchor Link */}
            <div className="md:pb-0.5">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentHref)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={shareToFacebook}
                className="flex items-center gap-2 text-[#666] hover:text-eprx-lime transition-colors font-mono text-[0.6rem] tracking-[2px] uppercase group"
                aria-label="Share this event on Facebook"
              >
                <svg
                  width="12"
                  height="12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                SHARE ON FACEBOOK
              </a>
            </div>
          </div>
        </header>

        {/* Hero Image Block */}
        {heroImageUrl && (
          <div className="w-full aspect-video md:h-125 mb-12 border border-[#222] bg-black overflow-hidden shadow-2xl relative">
            <Image
              src={heroImageUrl}
              alt={event.title}
              fill
              sizes="(max-w-5xl) 100vw, 1024px"
              priority
              className="object-cover filter contrast-110 brightness-105"
            />
          </div>
        )}

        {/* Content Layout */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <section className="lg:col-span-2">
            <h3 className="text-eprx-lime font-mono text-[0.7rem] tracking-[3px] mb-6 uppercase">
              || EVENT DETAILS
            </h3>
            <div className="text-[#ccc] leading-relaxed space-y-6 text-base md:text-lg whitespace-pre-line">
              {event.description}
            </div>
          </section>

          <aside className="h-fit">
            <div className="bg-eprx-dark p-8 border border-[#1a1a1a]">
              <h3 className="text-eprx-lime font-mono text-[0.7rem] tracking-[3px] mb-6 uppercase">
                || POINT OF CONTACT
              </h3>
              <div className="space-y-4 font-mono text-[0.7rem] md:text-[0.75rem] text-[#888]">
                <ContactLine
                  label="NAME"
                  value={`${event.firstName} ${event.lastName}`}
                />
                <ContactLine
                  label="EMAIL"
                  value={event.email}
                  className="lowercase"
                />
                <ContactLine label="MOBILE" value={event.mobile} />

                <div className="pt-4 border-t border-[#222] mt-4">
                  <p className="mb-2">OFFICIAL UPLINK:</p>
                  <a
                    href={fallbackEventUrl}
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
            PRX EVENTS ARCHIVE // {new Date().getFullYear()}
          </p>
        </footer>
      </motion.div>
    </div>
  );
};

export default EventDetailView;
