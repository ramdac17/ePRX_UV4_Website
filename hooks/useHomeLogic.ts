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
        if (!token) return;

        // 🎯 TARGETING THE NATIVE STATS ENDPOINT: Handles prefix mapping safely
        const baseUrl = API_URL?.endsWith("/api") ? API_URL : `${API_URL}/api`;
        const statsUrl = `${baseUrl}/activities/stats`;

        const response = await fetch(statsUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const rawText = await response.text();
        if (!rawText) throw new Error("Empty response payload.");

        const resData = JSON.parse(rawText);

        // 🧩 TRANSFORMING THE INCOMING NATIVE PAYLOAD SHAPE
        // Your backend returns: { recent: [...], summary: { totalDistance, totalHours } }
        if (resData && resData.summary) {
          // Map recent activities array to chart format (DAY + DISTANCE)
          const mappedChartData = (resData.recent || [])
            .map((act: any) => {
              const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
              return {
                day: days[new Date(act.createdAt).getDay()],
                distance: Number(act.distance || 0),
              };
            })
            .reverse(); // Keep chronological left-to-right sorting

          setActivityData(mappedChartData);

          // Update your aggregate cards directly from the summary stats engine
          setStats({
            totalKm: (Number(resData.summary.totalDistance) || 0).toFixed(1),
            avgPace: "0.00", // Keeps placeholder baseline secure
          });
        }
      } catch (error) {
        console.error("❌ METRIC_SYNC_FAILURE:", error);
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
