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

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const STATIC_URL = BACKEND_API.replace("/api", "");

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch(`${BACKEND_API}/article`);
        if (response.ok) {
          const data: Article[] = await response.json();
          // Filter logic: Only "FUEL" category
          const filteredFuel = data.filter((item) => item.category === "FUEL");
          setArticles(filteredFuel);
        }
      } catch (error) {
        console.error("FUEL_SYSTEM_FETCH_FAILURE:", error);
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
    e.preventDefault();
    e.stopPropagation();
    const articleUrl = `${window.location.origin}/article/${articleId}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&t=${encodeURIComponent(title)}`;
    window.open(fbShareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-6 md:px-[8%]">
      {/* Header Section */}
      <header className="mb-12 border-b border-[#1a1a1a] pb-10 text-left">
        <h1 className="font-bebas text-5xl md:text-8xl leading-[0.9] tracking-tighter m-0 uppercase">
          FUEL <span className="text-eprx-lime">NUTRITION</span>
        </h1>
        <p className="text-[#444] font-mono tracking-[4px] text-[0.7rem] md:text-xs mt-4 uppercase">
          OPTIMIZE YOUR ENERGY SYSTEMS FOR PEAK PERFORMANCE
        </p>
      </header>

      {/* Main Content Grid */}
      <main>
        {loading ? (
          <div className="flex justify-center py-24">
            <h2 className="font-mono text-eprx-lime animate-pulse tracking-[4px] uppercase text-sm md:text-base">
              SYNCING_FUEL_DATA...
            </h2>
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                  <div className="h-64 bg-[#111] overflow-hidden relative border-b border-[#1a1a1a]">
                    {item.image ? (
                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${STATIC_URL}/uploads/${item.image}`
                        }
                        alt={item.title}
                        className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-eprx-dark bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] bg-size-[20px_20px]">
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
                    <h2 className="font-bebas text-3xl md:text-4xl leading-[0.9] mb-4 uppercase text-white group-hover:text-white transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-[#888] text-sm leading-relaxed mb-8 line-clamp-3">
                      {item.content}
                    </p>

                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#1a1a1a]">
                      <span className="text-eprx-lime text-[0.7rem] font-mono tracking-widest font-bold uppercase">
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
              NO FUEL DATA
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
