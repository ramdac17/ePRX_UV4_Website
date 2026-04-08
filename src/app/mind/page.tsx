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

export default function MindPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const STATIC_URL = BACKEND_API.replace("/api", "");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`${BACKEND_API}/article`);
        if (response.ok) {
          const data: Article[] = await response.json();
          // Filter logic: Only "MIND" category
          const filteredMind = data.filter((item) => item.category === "MIND");
          setArticles(filteredMind);
        }
      } catch (error) {
        console.error("PSYCH DATA FETCH FAILURE:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [BACKEND_API]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-6 md:px-[8%]">
      {/* Header Section */}
      <header className="mb-12 border-b border-[#1a1a1a] pb-10 text-left">
        <h1 className="font-bebas text-5xl md:text-8xl leading-[0.9] tracking-tighter m-0 uppercase">
          ELITE <span className="text-eprx-lime">MINDSET</span>
        </h1>
        <p className="text-[#444] font-mono tracking-[4px] text-[0.7rem] md:text-xs mt-4 uppercase">
          THE PSYCHOLOGICAL EDGE OF HIGH-PERFORMANCE RUNNING
        </p>
      </header>

      {/* Main Content Grid */}
      <main>
        {loading ? (
          <div className="flex justify-center py-24">
            <h2 className="font-mono text-eprx-lime animate-pulse tracking-[4px] uppercase text-sm md:text-base">
              ACCESSING MIND ARCHIVE...
            </h2>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((item) => (
              <Link
                key={item.id}
                href={`/article/${item.id}`}
                className="group block"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] h-full flex flex-col transition-all duration-300"
                >
                  {/* Visual Header */}
                  <div className="h-56 bg-[#111] overflow-hidden relative border-b border-[#1a1a1a]">
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${STATIC_URL}/uploads/${item.image}`
                        }
                        alt={item.title}
                        className="w-full h-full object-cover grayscale-[0.7] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-eprx-dark bg-[linear-gradient(45deg,#0a0a0a_25%,transparent_25%,transparent_50%,#0a0a0a_50%,#0a0a0a_75%,transparent_75%,transparent)] bg-size-[20px_20px]">
                        <span className="text-[#1a1a1a] font-bebas text-4xl tracking-[5px] uppercase">
                          NO VISUAL
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-8 flex flex-col flex-1">
                    <span className="text-[#666] text-[0.6rem] font-mono tracking-[2px] mb-4 uppercase font-bold">
                      {item.category} ||{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        timeZone: "UTC",
                      })}
                    </span>
                    <h2 className="font-bebas text-3xl md:text-4xl leading-[0.95] mb-4 uppercase text-white">
                      {item.title}
                    </h2>
                    <p className="text-[#777] text-sm leading-relaxed mb-8 line-clamp-3">
                      {item.content}
                    </p>

                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#1a1a1a]">
                      <span className="text-eprx-lime text-[0.65rem] font-mono tracking-widest uppercase">
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
              NO MIND RESOURCES FOUND
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
