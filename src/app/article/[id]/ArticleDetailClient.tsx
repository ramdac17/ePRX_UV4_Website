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
  author: {
    username: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

export default function ArticleDetailClient({ id }: { id: string }) {
  const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STATIC_URL =
    BACKEND_API?.replace("/api", "") || "http://localhost:3001";

  // 🛰️ SHARE PROTOCOL
  const shareToFacebook = () => {
    if (!article) return;
    const url = window.location.href;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  useEffect(() => {
    async function fetchArticle() {
      if (!id || !BACKEND_API) return;
      try {
        setLoading(true);
        // Using the 'id' passed from the Server Component
        const response = await fetch(`${BACKEND_API}/articles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
        } else {
          setError("RESOURCE_NOT_FOUND");
        }
      } catch (err) {
        setError("PROTOCOL_FAILURE");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, BACKEND_API]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2 style={styles.loadingText}>DECRYPTING DATA STREAM...</h2>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorText}>|| ERROR: {error}</h2>
        <Link href="/" style={styles.backLink}>
          RETURN TO DASHBOARD
        </Link>
      </div>
    );
  }

  const authorName = article.author
    ? article.author.firstName && article.author.lastName
      ? `${article.author.firstName} ${article.author.lastName}`
      : article.author.username
    : "SYSTEM_AUTO";

  return (
    <div style={styles.pageContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.articleWrapper}
      >
        <header style={styles.header}>
          <div style={styles.meta}>
            <span style={styles.category}>{article.category}</span>
            <span style={styles.divider}> || </span>
            <span style={styles.date}>
              {new Date(article.createdAt)
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })
                .toUpperCase()}
            </span>
          </div>

          <h1 style={styles.title}>{article.title.toUpperCase()}</h1>

          <div style={styles.subHeader}>
            <div style={styles.authorSection}>
              <span style={styles.authorLabel}>AUTHOR:</span>
              <span style={styles.authorName}>{authorName.toUpperCase()}</span>
            </div>

            <button
              onClick={shareToFacebook}
              style={styles.shareBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d4ff00";
                e.currentTarget.style.color = "#d4ff00";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#222";
                e.currentTarget.style.color = "#666";
              }}
            >
              <svg>...</svg>
              SHARE
            </button>
          </div>
        </header>

        {article.image && (
          <div style={styles.imageContainer}>
            <img
              src={
                article.image.startsWith("http")
                  ? article.image
                  : `${STATIC_URL}/uploads/${article.image}`
              }
              alt={article.title}
              style={styles.heroImage}
            />
          </div>
        )}

        <main style={styles.contentContainer}>
          <div style={styles.content}>
            {article.content.split("\n").map((paragraph, index) => (
              <p key={index} style={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </main>

        <footer style={styles.footer}>
          <div style={styles.footerLine}></div>
          <p style={styles.footerText}>
            END OF TRANSMISSION || PRX ARCHIVES || 2026
          </p>
        </footer>
      </motion.div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: "#0a0a0a",
    minHeight: "100vh",
    color: "#fff",
    padding: "60px 8%",
    marginTop: "40px",
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
  articleWrapper: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "40px",
  },
  meta: {
    display: "flex",
    gap: "10px",
    fontSize: "0.75rem",
    color: "#d4ff00",
    fontFamily: "monospace",
    letterSpacing: "2px",
    marginBottom: "15px",
  },
  divider: {
    color: "#333",
  },
  title: {
    fontFamily: "var(--font-bebas)",
    fontSize: "5rem",
    lineHeight: "0.9",
    margin: "0 0 20px 0",
    color: "#fff",
  },
  authorSection: {
    fontSize: "0.7rem",
    fontFamily: "monospace",
    letterSpacing: "1px",
    color: "#666",
  },
  authorName: {
    color: "#999",
    marginLeft: "8px",
  },
  subHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  shareBtn: {
    backgroundColor: "transparent",
    border: "1px solid #222",
    color: "#666",
    fontSize: "0.6rem",
    fontFamily: "monospace",
    padding: "8px 15px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    letterSpacing: "2px",
    transition: "all 0.3s",
  },
  imageContainer: {
    width: "100%",
    marginBottom: "40px",
    border: "1px solid #222",
    backgroundColor: "#111",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    maxHeight: "600px",
    objectFit: "cover",
    display: "block",
    filter: "contrast(1.05) brightness(1.02)",
  },
  contentContainer: {
    position: "relative",
  },
  content: {
    fontSize: "1.05rem",
    lineHeight: "1.8",
    color: "#ccc",
    maxWidth: "100%",
  },
  paragraph: {
    marginBottom: "25px",
  },
  footer: {
    marginTop: "80px",
    textAlign: "center",
  },
  footerLine: {
    height: "1px",
    backgroundColor: "#222",
    marginBottom: "20px",
  },
  footerText: {
    fontSize: "0.6rem",
    color: "#444",
    fontFamily: "monospace",
    letterSpacing: "3px",
  },
};
