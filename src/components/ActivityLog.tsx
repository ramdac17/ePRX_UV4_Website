"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Activity {
  id: string;
  title: string;
  distance: number;
  pace: string;
  duration: number;
  shareImageUrl: string;
}

export default function ActivityLog({ activities }: { activities: any[] }) {
  const router = useRouter();

  return (
    <div style={styles.activityGrid}>
      {activities.map((act) => (
        <div
          key={act.id}
          style={styles.mapCard}
          onClick={() => router.push(`/activity/${act.id}`)}
          // ⚡️ PERFORMANCE: Tell Next.js to warm up the route on hover
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = "brightness(1.2)";
            router.prefetch(`/activity/${act.id}`);
          }}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          <img
            src={act.mapImageUrl || act.shareImageUrl}
            alt="Mission Map"
            style={styles.mapImage}
          />

          <div style={styles.overlay}>
            <div style={styles.overlayHeader}>
              <span style={styles.idTag}>
                #{act.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <h4 style={styles.titleText}>
              {act.title?.toUpperCase() || "RUNNER_LOG"}
            </h4>
            <div style={styles.statLine}>
              <span style={styles.statItem}>{act.distance}KM</span>
              <span style={styles.statItem}>{act.pace}</span>
              <span style={styles.statItem}>
                {Math.floor(act.duration / 60)}M
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  activityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  mapCard: {
    position: "relative",
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    cursor: "pointer",
    overflow: "hidden",
    aspectRatio: "1/1",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  mapImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.7,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "20px",
    background:
      "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
  },
  overlayHeader: { marginBottom: "8px" },
  idTag: {
    color: "#d4ff00",
    fontSize: "0.55rem",
    fontFamily: "monospace",
    opacity: 0.8,
  },
  titleText: {
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "900",
    margin: "0 0 12px 0",
    letterSpacing: "-0.5px",
  },
  statLine: { display: "flex", gap: "20px" },
  statBox: { display: "flex", flexDirection: "column" },
  statLabel: { color: "#444", fontSize: "0.5rem", fontWeight: "bold" },
  statValue: { color: "#fff", fontSize: "0.85rem", fontFamily: "monospace" },
};
