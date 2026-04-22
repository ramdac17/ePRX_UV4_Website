import { useState, useEffect, useMemo } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function useHomeLogic(user: any) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [stats, setStats] = useState({ avgPace: "0.00", totalKm: "0.0" });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 968);
    const handleScroll = () => setScrollY(window.scrollY);
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchMetrics = async () => {
      try {
        const stored = localStorage.getItem("eprx_session");
        const { token } = stored ? JSON.parse(stored) : {};
        const res = await fetch(`${API_URL}/activities/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.recent) {
          setActivityData(
            data.recent
              .slice(0, 7)
              .reverse()
              .map((act: any) => ({
                day: new Date(act.createdAt)
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase(),
                distance: Number(act.distance) || 0,
              })),
          );
        }
        setStats({
          avgPace: data.summary?.avgPace || "0.00",
          totalKm: data.summary?.totalDistance || "0.0",
        });
      } catch (e) {
        console.error("METRIC_SYNC_FAILURE", e);
      }
    };
    fetchMetrics();
  }, [user]);

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 750);
  };

  const lastUpdated = useMemo(
    () =>
      new Date()
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
        .toUpperCase(),
    [],
  );

  return {
    isDrawerOpen,
    setIsDrawerOpen,
    isGlitching,
    isMobile,
    scrollY,
    activityData,
    stats,
    lastUpdated,
    triggerGlitch,
  };
}
