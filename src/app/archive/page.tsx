"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { homeStyles as styles, mobileStyles } from "../../components/styles";

interface Article {
  id: string;
  title: string;
  category: string;
  image: string | null;
}

interface ArchiveProps {
  isSection?: boolean;
  limit?: number;
}

const ArchivePage = ({ isSection = false, limit }: ArchiveProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /* Added hover state tracking */
  const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);

  const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL || "";
  const FALLBACK_IMAGE = "/assets/images/comingSoon.jpg";

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/article`);

      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        throw new Error(`BACKEND_LINK_OFFLINE: ${response.status}`);
      }

      const data = await response.json();
      const finalData = Array.isArray(data) ? data : data.articles || [];
      const displayData = limit ? finalData.slice(0, limit) : finalData;
      setArticles(displayData);
    } catch (err) {
      console.error("Archive Fetch Error:", err);
      setError("SYSTEM RECOVERY FAILED: Archives currently inaccessible.");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const resolveImage = (img: string | null) => {
    if (!img) return FALLBACK_IMAGE;
    if (img.startsWith("http")) return img;
    return `${STATIC_URL}/${img}`.replace(/([^:]\/)\/+/g, "$1");
  };

  const Container = isSection ? "section" : "main";

  return (
    <Container style={isSection ? {} : styles.pageContainer}>
      <section style={styles.archiveSection}>
        <div style={mobileStyles.headerStack}>
          <h2 style={mobileStyles.mobileTitle}>
            <span style={mobileStyles.sectionNum}>|| PRX REPOSITORY</span>
            THE <span style={{ color: "#d4ff00" }}>ARCHIVE</span>
          </h2>
          <p style={mobileStyles.mobileDesc}>
            Comprehensive retrieval of historical performance data. Optimized
            for terminal-level insight.
          </p>
        </div>

        <div style={styles.articleGrid}>
          {loading ? (
            <div style={placeholderStyle}>INITIALIZING DATA STREAM...</div>
          ) : error ? (
            <div style={{ ...placeholderStyle, color: "#ff4444" }}>{error}</div>
          ) : articles.length > 0 ? (
            articles.map((post) => {
              const isHovered = hoveredIndex === post.id;

              return (
                <Link
                  key={post.id}
                  href={`/article/${post.id}`}
                  onMouseEnter={() => setHoveredIndex(post.id)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    ...styles.articleCard,
                    transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
                    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                    border: isHovered
                      ? "1px solid #d4ff00"
                      : "1px solid #1a1a1a",
                    textDecoration: "none",
                    overflow: "hidden",
                  }}
                >
                  <div style={landscapeImageWrapper}>
                    <img
                      src={resolveImage(post.image)}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "all 0.6s ease",
                        /* REMOVED GRAYSCALE - Using brightness shift for depth */
                        filter: isHovered
                          ? "brightness(1.1)"
                          : "brightness(0.8)",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                      }}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                    />
                    <div style={landscapeOverlay} />
                  </div>

                  <div style={styles.articleContent}>
                    <span
                      style={{
                        ...styles.volTag,
                        color: isHovered ? "#d4ff00" : "#666",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {post.category.toUpperCase().slice(0, 10)}
                    </span>
                    <h3
                      style={{
                        ...styles.articleTitle,
                        color: isHovered ? "#d4ff00" : "#fff",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {post.title.toUpperCase()}
                    </h3>
                    <div
                      style={{
                        ...cardFooterDecoration,
                        backgroundColor: isHovered ? "#d4ff00" : "#333",
                        width: isHovered ? "45px" : "30px",
                        transition: "all 0.3s ease",
                      }}
                    />
                    <div style={{ marginTop: "15px" }}>
                      <span
                        style={{
                          ...styles.volTag,
                          color: isHovered ? "#fff" : "#444",
                        }}
                      >
                        READ DETAILS
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div style={placeholderStyle}>NO RECORDS FOUND IN SECTOR.</div>
          )}
        </div>
      </section>
    </Container>
  );
};

// --- STYLES RETAINED FROM YOUR CONFIG ---

const landscapeImageWrapper: React.CSSProperties = {
  width: "100%",
  aspectRatio: "16 / 9",
  overflow: "hidden",
  backgroundColor: "#050505",
  position: "relative",
  borderBottom: "1px solid #1a1a1a",
};

const landscapeOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)",
  pointerEvents: "none",
};

const cardFooterDecoration: React.CSSProperties = {
  height: "2px",
  marginTop: "15px",
};

const placeholderStyle: React.CSSProperties = {
  color: "#444",
  fontFamily: "monospace",
  letterSpacing: "4px",
  fontSize: "0.8rem",
  gridColumn: "1 / -1",
  textAlign: "center",
  padding: "80px 40px",
  border: "1px dashed #1a1a1a",
  textTransform: "uppercase",
};

export default ArchivePage;
