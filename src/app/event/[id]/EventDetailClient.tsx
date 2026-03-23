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
      <div style={styles.loadingContainer}>
        <h2 style={styles.loadingText}>DECRYPTING MISSION STREAM...</h2>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorText}>|| ERROR: {error}</h2>
        <Link href="/events" style={styles.backLink}>
          RETURN_TO_BASE
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.articleWrapper}
      >
        <header style={styles.header}>
          <div style={styles.meta}>
            <span style={styles.category}>LIVE EVENT</span>
            <span style={styles.divider}>||</span>
            <span style={styles.date}>
              {new Date(event.date)
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
                .toUpperCase()}
            </span>
          </div>
          <h1 style={styles.title}>{event.title.toUpperCase()}</h1>

          <div style={styles.intelGrid}>
            <div style={styles.intelItem}>
              <span style={styles.authorLabel}>LOCATION:</span>
              <span style={styles.intelValue}>
                {event.location.toUpperCase()}
              </span>

              {/* 🛰️ SHARE BUTTON - Nested under Location */}
              <button
                onClick={shareToFacebook}
                style={styles.shareBtnInline}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#d4ff00")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
              >
                <svg
                  width="10"
                  height="10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                SHARE TO FACEBOOK
              </button>
            </div>

            <div style={styles.intelItem}>
              <span style={styles.authorLabel}>ORGANIZER:</span>
              <span style={styles.intelValue}>
                {event.organizer.toUpperCase()}
              </span>
            </div>
          </div>
        </header>

        {event.image && (
          <div style={styles.imageContainer}>
            <img
              src={
                event.image.startsWith("http")
                  ? event.image
                  : `${STATIC_URL}/uploads/${event.image}`
              }
              alt={event.title}
              style={styles.heroImage}
            />
          </div>
        )}

        <main style={styles.contentContainer}>
          <div style={styles.content}>
            <h3 style={styles.sectionTitle}>|| EVENT DETAILS</h3>
            {event.description.split("\n").map((paragraph, index) => (
              <p key={index} style={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div style={styles.contactCard}>
            <h3 style={styles.sectionTitle}>|| POINT OF CONTACT</h3>
            <p style={styles.contactText}>
              NAME: {event.firstName} {event.lastName}
            </p>
            <p style={styles.contactText}>EMAIL: {event.email}</p>
            <p style={styles.contactText}>MOBILE: {event.mobile}</p>
          </div>
        </main>

        <footer style={styles.footer}>
          <div style={styles.footerLine}></div>
          <p style={styles.footerText}>END OF TRANSMISSION || PRX</p>
        </footer>
      </motion.div>
    </div>
  );
}

// Ensure shareBtnInline is added to styles
const styles: { [key: string]: React.CSSProperties } = {
  // ... (keep previous styles)
  pageContainer: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    color: "#fff",
    padding: "100px 8% 60px",
  },
  loadingContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  loadingText: {
    fontFamily: "monospace",
    color: "#d4ff00",
    letterSpacing: "4px",
  },
  errorContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    gap: "20px",
  },
  errorText: {
    fontFamily: "monospace",
    color: "#ff3e3e",
    letterSpacing: "2px",
  },
  backLink: {
    color: "#d4ff00",
    textDecoration: "none",
    fontFamily: "monospace",
    border: "1px solid #d4ff00",
    padding: "10px 20px",
  },
  articleWrapper: { maxWidth: "1000px", margin: "0 auto" },
  header: { marginBottom: "40px" },
  meta: {
    display: "flex",
    gap: "10px",
    fontSize: "0.75rem",
    color: "#d4ff00",
    fontFamily: "monospace",
    letterSpacing: "2px",
    marginBottom: "15px",
  },
  divider: { color: "#333" },
  title: {
    fontFamily: "var(--font-bebas)",
    fontSize: "5rem",
    lineHeight: "0.9",
    margin: "0 0 30px 0",
    color: "#fff",
  },
  intelGrid: {
    display: "flex",
    gap: "40px",
    borderTop: "1px solid #1a1a1a",
    paddingTop: "20px",
  },
  intelItem: { display: "flex", flexDirection: "column", gap: "5px" },
  authorLabel: {
    fontSize: "0.6rem",
    fontFamily: "monospace",
    color: "#444",
    letterSpacing: "1px",
  },
  intelValue: {
    fontSize: "0.8rem",
    fontFamily: "monospace",
    color: "#999",
    letterSpacing: "1px",
  },
  shareBtnInline: {
    backgroundColor: "transparent",
    border: "none",
    color: "#444",
    fontSize: "0.55rem",
    fontFamily: "monospace",
    padding: "5px 0 0 0",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    letterSpacing: "1px",
    transition: "color 0.3s ease",
  },
  imageContainer: {
    width: "100%",
    height: "500px",
    marginBottom: "40px",
    border: "1px solid #333",
    backgroundColor: "#000",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    filter: "contrast(1.1) brightness(1.05)",
  },
  content: { fontSize: "1.05rem", lineHeight: "1.8", color: "#ccc" },
  paragraph: { marginBottom: "25px" },
  sectionTitle: {
    fontSize: "0.7rem",
    color: "#d4ff00",
    letterSpacing: "3px",
    marginBottom: "20px",
    fontFamily: "monospace",
  },
  contactCard: {
    backgroundColor: "#0f0f0f",
    padding: "30px",
    border: "1px solid #1a1a1a",
    height: "fit-content",
    marginTop: "40px",
  },
  contactText: {
    fontSize: "0.75rem",
    fontFamily: "monospace",
    color: "#888",
    marginBottom: "10px",
  },
  footer: { marginTop: "80px", textAlign: "center" },
  footerLine: { height: "1px", backgroundColor: "#222", marginBottom: "20px" },
  footerText: {
    fontSize: "0.6rem",
    color: "#444",
    fontFamily: "monospace",
    letterSpacing: "3px",
  },
};
