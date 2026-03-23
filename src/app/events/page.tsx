"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useIsMobile } from "./../../../hooks/useMediaQuery";

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
  const { isMobile } = useIsMobile();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Search State
  const [loading, setLoading] = useState(true);

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const STATIC_URL = BACKEND_API.replace("/api", "");

  const dynamicGridStyle = {
    ...styles.grid,
    gridTemplateColumns: isMobile
      ? "1fr" // Single column on mobile
      : "repeat(auto-fill, minmax(350px, 1fr))",
    padding: isMobile ? "0 10px" : "0",
  };

  const dynamicTitleStyle = {
    ...styles.title,
    fontSize: isMobile ? "3rem" : "6rem", // Scale down massive title
  };

  useEffect(() => {
    async function fetchLiveEvents() {
      try {
        const response = await fetch(`${BACKEND_API}/event`);
        if (response.ok) {
          const data: Event[] = await response.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("EVENT FETCH PROTOCOL FAILURE:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveEvents();
  }, [BACKEND_API]);

  // 🛰️ Filter Logic: Searches title, location, or organizer
  const filteredEvents = events.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchLower) ||
      event.location.toLowerCase().includes(searchLower) ||
      event.organizer.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div
      style={{
        ...styles.pageContainer,
        padding: isMobile ? "80px 5% 40px" : styles.pageContainer.padding,
      }}
    >
      <div style={styles.header}>
        <h1 style={dynamicTitleStyle}>
          LIVE <span style={{ color: "#d4ff00" }}>EVENTS</span>
        </h1>
        <p style={styles.subtitle}>REAL-TIME AND UPCOMING EVENTS</p>
      </div>

      {/* 🛠️ SEARCH INTERFACE */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchLabel}>SEARCH EVENTS:</span>
          <input
            type="text"
            placeholder="FILTER BY MISSION, LOCATION, OR ORGANIZER..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.searchUnderline}></div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={dynamicGridStyle}>
          {loading ? (
            <div style={styles.loadingText}>SYNCHRONIZING LIVE FEED...</div>
          ) : filteredEvents.length > 0 ? (
            <div style={styles.grid}>
              {filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  style={styles.cardLink}
                >
                  <motion.div
                    style={styles.card}
                    whileHover={{ y: -8, borderColor: "#d4ff00" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div style={styles.imageContainer}>
                      {event.image ? (
                        <img
                          src={
                            event.image.startsWith("http")
                              ? event.image
                              : `${STATIC_URL}/uploads/${event.image}`
                          }
                          alt={event.title}
                          style={styles.articleImage}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div style={styles.placeholderImage}>
                          <span style={styles.imageLabel}>NO SIGNAL</span>
                        </div>
                      )}
                      <div style={styles.overlayTag}>
                        {event.location.toUpperCase()}
                      </div>
                    </div>
                    <div style={styles.cardContent}>
                      <span style={styles.tag}>
                        ORGANIZER: {event.organizer} ||{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <h2 style={styles.cardTitle}>
                        {event.title.toUpperCase()}
                      </h2>
                      <p style={styles.cardDesc}>
                        {event.description.substring(0, 120)}...
                      </p>
                      <div style={styles.readMore}>READ DETAILS</div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={styles.noData}>
              {searchTerm
                ? `NO MISSIONS MATCHING "${searchTerm.toUpperCase()}"`
                : "NO LIVE TRANSMISSIONS DETECTED"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: "#050505",
    color: "#fff",
    minHeight: "100vh",
    padding: "100px 8% 60px",
  },
  header: {
    marginBottom: "40px",
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "40px",
    textAlign: "left", // Centered the title too for better balance
  },
  title: {
    fontFamily: "var(--font-bebas), sans-serif",
    fontSize: "6rem",
    margin: 0,
    lineHeight: "0.9",
    letterSpacing: "-2px",
  },
  subtitle: {
    color: "#444",
    letterSpacing: "4px",
    fontSize: "0.8rem",
    marginTop: "15px",
    fontFamily: "monospace",
  },
  // ⚡ NEW SEARCH STYLES
  searchContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "60px",
  },
  searchWrapper: {
    width: "100%",
    maxWidth: "600px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  searchLabel: {
    fontFamily: "monospace",
    fontSize: "0.65rem",
    color: "#d4ff00",
    letterSpacing: "2px",
  },
  searchInput: {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontFamily: "monospace",
    fontSize: "1rem",
    padding: "10px 0",
    letterSpacing: "1px",
    width: "100%",
  },
  searchUnderline: {
    height: "1px",
    backgroundColor: "#333",
    width: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "30px",
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
  },
  card: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
  },
  imageContainer: {
    height: "220px",
    backgroundColor: "#111",
    overflow: "hidden",
    position: "relative",
    borderBottom: "1px solid #1a1a1a",
  },
  overlayTag: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0,0,0,0.8)",
    color: "#d4ff00",
    fontSize: "0.6rem",
    padding: "4px 8px",
    fontFamily: "monospace",
    border: "1px solid #d4ff00",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f0f",
  },
  imageLabel: {
    color: "#222",
    fontFamily: "var(--font-bebas)",
    fontSize: "2.5rem",
    letterSpacing: "5px",
  },
  cardContent: {
    padding: "30px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  tag: {
    color: "#d4ff00",
    fontSize: "0.65rem",
    letterSpacing: "3px",
    marginBottom: "15px",
    fontFamily: "monospace",
  },
  cardTitle: {
    fontFamily: "var(--font-bebas)",
    fontSize: "2.2rem",
    margin: "0 0 15px 0",
    lineHeight: "1",
  },
  cardDesc: {
    color: "#888",
    fontSize: "0.9rem",
    lineHeight: "1.6",
    marginBottom: "25px",
  },
  readMore: {
    color: "#fff",
    fontSize: "0.7rem",
    letterSpacing: "3px",
    fontFamily: "monospace",
    marginTop: "auto",
    border: "1px solid #333",
    padding: "8px 15px",
    width: "fit-content",
  },
  articleImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  loadingText: {
    fontFamily: "monospace",
    color: "#d4ff00",
    fontSize: "1rem",
    letterSpacing: "4px",
    textAlign: "center",
    padding: "100px 0",
  },
  noData: {
    fontFamily: "monospace",
    color: "#444",
    fontSize: "0.8rem",
    letterSpacing: "2px",
    textAlign: "center",
    padding: "100px 0",
  },
};
