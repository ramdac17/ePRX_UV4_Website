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

// Added 'isSection' prop to toggle <main> vs <section> and 'limit' for Home page
interface ArchiveProps {
  isSection?: boolean;
  limit?: number;
}

const ArchivePage = ({ isSection = false, limit }: ArchiveProps) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL || "";
  const FALLBACK_IMAGE = "/assets/images/comingSoon.jpg";

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // CHANGE: Point this back to your external NestJS Backend
      // Using the environment variable you already have defined
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${API_URL}/article`);

      const contentType = response.headers.get("content-type");
      if (!response.ok || !contentType?.includes("application/json")) {
        throw new Error(`BACKEND_UNREACHABLE: ${response.status}`);
      }

      const data = await response.json();

      // NestJS often returns an object or a specific array,
      // ensure we are getting the array correctly:
      const finalData = Array.isArray(data) ? data : data.articles || [];

      const displayData = limit ? finalData.slice(0, limit) : finalData;
      setArticles(displayData);
    } catch (err) {
      console.error("Direct Fetch Error:", err);
      setError("SYSTEM_RECOVERY_FAILED: Backend link severed.");
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
    // Cleans up potential double slashes from process.env concat
    return `${STATIC_URL}/${img}`.replace(/([^:]\/)\/+/g, "$1");
  };

  // Wrapper logic to maintain semantic HTML
  const Container = isSection ? "section" : "main";

  return (
    <Container style={isSection ? {} : styles.pageContainer}>
      <section style={styles.archiveSection}>
        <div style={mobileStyles.headerStack}>
          <h2 style={mobileStyles.mobileTitle}>
            <span style={mobileStyles.sectionNum}>|| ePRX_UV1 REPOSITORY</span>
            THE <span style={{ color: "#d4ff00" }}>ARCHIVE</span>
          </h2>
          <p style={mobileStyles.mobileDesc}>
            Comprehensive retrieval of historical performance data. Optimized
            for terminal-level insight.
          </p>
        </div>

        <div style={styles.articleGrid}>
          {loading ? (
            <div style={placeholderStyle}>INITIALIZING_DATA_STREAM...</div>
          ) : error ? (
            <div style={{ ...placeholderStyle, color: "#ff4444" }}>{error}</div>
          ) : articles.length > 0 ? (
            articles.map((post) => (
              <Link
                key={post.id}
                href={`/article/${post.id}`}
                style={styles.articleCard}
              >
                <div
                  style={{
                    overflow: "hidden",
                    height: "250px",
                    backgroundColor: "#050505",
                  }}
                >
                  <img
                    src={resolveImage(post.image)}
                    alt={post.title}
                    style={styles.articleImg}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div style={styles.articleContent}>
                  <span style={styles.volTag}>
                    MODULE_{post.category.toUpperCase()}
                  </span>
                  <h3 style={styles.articleTitle}>
                    {post.title.toUpperCase()}
                  </h3>
                </div>
              </Link>
            ))
          ) : (
            <div style={placeholderStyle}>NO_RECORDS_FOUND_IN_SECTOR.</div>
          )}
        </div>
      </section>
    </Container>
  );
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
