"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ActivityLog from "@/components/ActivityLog";
import { AuthGuard } from "@/components/AuthGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CentralArchivePage() {
  const { user, token, loading: authLoading } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user?.id || !token) return;

    const fetchArchive = async () => {
      try {
        const res = await axios.get(`${API_URL}/activities/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(res.data);
      } catch (err) {
        console.error("ARCHIVE_ACCESS_DENIED", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, [user?.id, token, authLoading]);

  if (loading)
    return <div style={styles.loader}>INITIALIZING_ARCHIVE_DATA...</div>;

  return (
    <AuthGuard>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            CENTRAL <span style={{ color: "#d4ff00" }}>ARCHIVE</span>
          </h1>
          <p style={styles.subtitle}>HISTORY_OF_ALL_ACTIVE_MISSIONS</p>
        </div>

        <ActivityLog activities={activities} />
      </div>
    </AuthGuard>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#000",
    minHeight: "100vh",
    padding: "120px 40px",
  },
  header: {
    marginBottom: "40px",
    borderLeft: "4px solid #d4ff00",
    paddingLeft: "20px",
  },
  title: {
    fontFamily: "var(--font-bebas)",
    fontSize: "3.5rem",
    color: "#fff",
    margin: 0,
  },
  subtitle: { color: "#444", fontSize: "0.7rem", letterSpacing: "3px" },
  loader: {
    color: "#d4ff00",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
};
