"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string | null;
  createdAt: string;
}

export default function FuelPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // ePRX Connection Constants
  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const STATIC_URL = BACKEND_API.replace("/api", "");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`${BACKEND_API}/article`);
        if (response.ok) {
          const data: Article[] = await response.json();

          // ✅ FILTER LOGIC: Only allow "FUEL" category
          const filteredFuel = data.filter((item) => item.category === "FUEL");

          setArticles(filteredFuel);
        }
      } catch (error) {
        console.error("FETCH_ERROR:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [BACKEND_API]);

  const shareToFacebook = (
    e: React.MouseEvent,
    articleId: string,
    title: string,
  ) => {
    e.preventDefault(); // Prevents clicking the card link
    e.stopPropagation(); // Prevents event bubbling

    // Construct the full URL of the article
    const articleUrl = `${window.location.origin}/article/${articleId}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&t=${encodeURIComponent(title)}`;
    window.open(fbShareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          FUEL <span style={{ color: "#d4ff00" }}>NUTRITION</span>
        </h1>
        <p style={styles.subtitle}>
          OPTIMIZE YOUR ENERGY SYSTEMS FOR PEAK PERFORMANCE
        </p>
      </div>

      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingText}>LOADING DATA STREAM...</div>
        ) : articles.length > 0 ? (
          <div style={styles.grid}>
            {articles.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.id}`}
                style={styles.cardLink}
              >
                <motion.div
                  style={styles.card}
                  whileHover={{ y: -5, borderColor: "#d4ff00" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div style={styles.imageContainer}>
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${STATIC_URL}/uploads/${item.image}`
                        }
                        alt={item.title}
                        style={styles.articleImage}
                      />
                    ) : (
                      <div style={styles.placeholderImage}>
                        <span style={styles.imageLabel}>NO VISUAL</span>
                      </div>
                    )}
                  </div>
                  <div style={styles.cardContent}>
                    <span style={styles.tag}>
                      {item.category} ||{" "}
                      {new Date(item.createdAt).getFullYear()}
                    </span>
                    <h2 style={styles.cardTitle}>{item.title.toUpperCase()}</h2>
                    <p style={styles.cardDesc}>
                      {item.content.substring(0, 100)}...
                    </p>
                    <div style={styles.readMore}>READ ARTICLE</div>

                    {/*  <button
                      onClick={(e) => shareToFacebook(e, item.id, item.title)}
                      style={styles.fbButton}
                      title="Share to Facebook"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>SHARE</span>
                    </button> */}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={styles.noData}>NO FUEL DATA FOUND</div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: "#0f0f0f",
    color: "#fff",
    minHeight: "100vh",
    padding: "100px 8% 60px",
  },
  header: {
    marginBottom: "60px",
    borderBottom: "1px solid #333",
    paddingBottom: "40px",
  },
  title: {
    fontFamily: "var(--font-bebas)",
    fontSize: "6rem",
    margin: 0,
    lineHeight: "0.9",
  },
  subtitle: {
    color: "#444",
    letterSpacing: "4px",
    fontSize: "0.9rem",
    marginTop: "10px",
    fontWeight: "bold",
  },
  content: { display: "flex", flexDirection: "column" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "40px",
  },
  cardLink: { textDecoration: "none", color: "inherit", display: "block" },
  card: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "border-color 0.3s ease",
  },
  imageContainer: {
    height: "250px",
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    position: "relative",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111",
    backgroundImage: "radial-gradient(#222 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
  imageLabel: {
    color: "#333",
    fontFamily: "var(--font-bebas)",
    fontSize: "2rem",
    letterSpacing: "2px",
  },
  cardContent: {
    padding: "30px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  tag: {
    color: "#666",
    fontSize: "0.6rem",
    letterSpacing: "2px",
    marginBottom: "10px",
    fontWeight: "bold",
  },
  cardTitle: {
    fontFamily: "var(--font-bebas)",
    fontSize: "2.5rem",
    margin: "0 0 15px 0",
    lineHeight: "0.9",
    color: "#fff",
  },
  cardDesc: {
    color: "#888",
    fontSize: "0.85rem",
    lineHeight: "1.6",
    marginBottom: "25px",
  },
  readMore: {
    color: "#d4ff00",
    fontSize: "0.75rem",
    letterSpacing: "2px",
    fontWeight: "bold",
    marginTop: "auto",
  },
  articleImage: { width: "100%", height: "100%", objectFit: "cover" },
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
    color: "#666",
    fontSize: "0.8rem",
    letterSpacing: "2px",
    textAlign: "center",
    padding: "100px 0",
  },
  cardFooter: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fbButton: {
    backgroundColor: "transparent",
    border: "1px solid #333",
    color: "#888",
    padding: "6px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.6rem",
    fontFamily: "monospace",
    letterSpacing: "1px",
    transition: "all 0.2s ease",
    borderRadius: "2px",
  },
};
