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
      <div className="h-screen flex items-center justify-center bg-[#050505]">
        <h2 className="font-mono text-eprx-lime tracking-[6px] animate-pulse uppercase text-sm">
          DECRYPTING DATA STREAM...
        </h2>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] gap-6">
        <h2 className="font-mono text-red-500 tracking-widest uppercase">
          || ERROR: {error || "UNKNOWN_EXCEPTION"}
        </h2>
        <Link
          href="/"
          className="font-mono text-eprx-lime border border-eprx-lime px-6 py-2 hover:bg-eprx-lime hover:text-black transition-all text-xs"
        >
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
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20 px-6 md:px-[10%]">
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-3 font-mono text-[0.65rem] md:text-xs text-eprx-lime tracking-[3px] mb-6 uppercase">
            <span>{article.category}</span>
            <span className="text-[#333]">||</span>
            <span className="text-[#888]">
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
                timeZone: "UTC",
              })}
            </span>
          </div>

          <h1 className="font-bebas text-5xl md:text-7xl leading-[0.9] mb-8 uppercase tracking-tighter">
            {article.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#1a1a1a] pb-8">
            <div className="font-mono">
              <span className="block text-[0.6rem] text-[#444] tracking-widest mb-1 uppercase">
                AUTHOR
              </span>
              <span className="text-[#aaa] text-xs uppercase tracking-wider">
                {authorName}
              </span>
            </div>

            <button
              onClick={shareToFacebook}
              className="flex items-center gap-2 text-[#666] hover:text-eprx-lime transition-colors font-mono text-[0.6rem] tracking-[2px] uppercase group"
            >
              <svg
                width="14"
                height="14"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="opacity-60 group-hover:opacity-100"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              SHARE ON FACEBOOK
            </button>
          </div>
        </header>

        {/* Hero Image */}
        {article.image && (
          <div className="w-full mb-12 border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden rounded-sm">
            <img
              src={
                article.image.startsWith("http")
                  ? article.image
                  : `${STATIC_URL}/uploads/${article.image}`
              }
              alt={article.title}
              className="w-full h-auto max-h-175 object-cover filter contrast-[1.02] brightness-[0.95]"
            />
          </div>
        )}

        {/* Content Body */}
        <main className="prose prose-invert prose-p:text-[#ccc] prose-p:leading-relaxed prose-p:text-lg max-w-none">
          <div className="space-y-6">
            {article.content.split("\n").map((paragraph, index) =>
              paragraph.trim() ? (
                <p key={index} className="font-sans font-light tracking-wide">
                  {paragraph}
                </p>
              ) : null,
            )}
          </div>
        </main>

        {/* Footer Signature */}
        <footer className="mt-20 pt-10 border-t border-[#1a1a1a] text-center">
          <p className="font-mono text-[0.6rem] text-[#333] tracking-[5px] uppercase">
            PRX ARTICLE ARCHIVE || {new Date().getFullYear()}
          </p>
        </footer>
      </motion.article>
    </div>
  );
}
