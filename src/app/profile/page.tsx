"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import imageCompression from "browser-image-compression";
import Toast from "@/components/Toast";
import { AuthGuard } from "@/components/AuthGuard";
import { Ruler, Clock, Zap, ExternalLink } from "lucide-react"; // Install lucide-react

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const router = useRouter();
  const {
    user: authUser,
    token,
    loading: authLoading,
    logout,
    login,
  } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Toast State
  const [toast, setToast] = useState({
    show: false,
    msg: "",
    type: "success" as "success" | "error",
  });

  const notify = (msg: string, type: "success" | "error" = "success") =>
    setToast({ show: true, msg, type });

  useEffect(() => {
    if (authLoading) return;
    if (!authUser || !token) {
      router.push("/login?redirect=/profile");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // 🚀 Parallel fetch for Profile and Activity History
        const [profileRes, activityRes] = await Promise.all([
          axios.get(`${API_URL}/user/profile?id=${authUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/activities/user/${authUser.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(profileRes.data);
        setActivities(activityRes.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          logout();
          router.push("/login");
        }
        notify("SYSTEM_SYNC_ERROR", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser, token, authLoading, router, logout]);

  if (loading || authLoading)
    return <div style={styles.loader}>INITIALIZING_NEURAL_LINK...</div>;

  return (
    <AuthGuard>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <h1 style={styles.title}>
            OPERATOR <span style={{ color: "#d4ff00" }}>PROFILE</span>
          </h1>
          <p style={styles.subtitle}>
            ID: {authUser?.id.slice(0, 12)} // LVL: RUNNER
          </p>
        </div>

        <div style={styles.contentLayout}>
          {/* Left Column: Mission History */}
          <div style={styles.historySection}>
            <h2 style={styles.sectionTitle}>|| MISSION_LOG_HISTORY</h2>
            {activities.length === 0 ? (
              <div style={styles.emptyState}>
                NO MISSIONS DETECTED. START YOUR FIRST RUN.
              </div>
            ) : (
              <div style={styles.activityGrid}>
                {activities.map((activity: any) => (
                  <div
                    key={activity.id}
                    style={styles.activityCard}
                    onClick={() => router.push(`/activities/${activity.id}`)}
                  >
                    <img
                      src={activity.shareImageUrl || activity.mapImageUrl}
                      alt="Mission Map"
                      style={styles.activityMap}
                    />
                    <div style={styles.activityDetails}>
                      <div style={styles.activityMainRow}>
                        <span style={styles.activityName}>
                          {activity.title || "UNTITLED_MISSION"}
                        </span>
                        <ExternalLink size={14} color="#555" />
                      </div>
                      <div style={styles.activityStatsRow}>
                        <StatItem
                          label="DIST"
                          value={`${activity.distance}km`}
                        />
                        <StatItem label="PACE" value={activity.pace} />
                        <StatItem
                          label="TIME"
                          value={`${Math.floor(activity.duration / 60)}m`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Profile Management */}
          <div style={styles.managementSection}>
            <h2 style={styles.sectionTitle}>|| OPERATOR_CONFIG</h2>
            <div style={styles.card}>
              {/* Existing Profile Image logic here */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>DISPLAY_NAME</label>
                <input style={styles.input} defaultValue={user?.username} />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>EMAIL_ID (READ_ONLY)</label>
                <input
                  style={{ ...styles.input, color: "#444" }}
                  value={user?.email}
                  disabled
                />
              </div>

              <button
                style={styles.saveBtn}
                onClick={() => notify("RE-SYNCING_DISABLED_IN_DEMO")}
              >
                SYNC_CHANGES
              </button>

              <div style={styles.dangerZone}>
                <p style={styles.dangerTitle}>CRITICAL_ZONE</p>
                <button style={styles.gdprBtn} onClick={logout}>
                  TERMINATE_SESSION
                </button>
                <button style={styles.deleteBtn}>PURGE_ACCOUNT</button>
              </div>
            </div>
          </div>
        </div>

        <Toast
          message={toast.msg}
          isVisible={toast.show}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
    </AuthGuard>
  );
}

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div style={{ marginRight: "15px" }}>
    <p
      style={{
        margin: 0,
        fontSize: "0.6rem",
        color: "#555",
        fontWeight: "bold",
      }}
    >
      {label}
    </p>
    <p
      style={{
        margin: 0,
        fontSize: "0.85rem",
        color: "#fff",
        fontFamily: "monospace",
      }}
    >
      {value}
    </p>
  </div>
);

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#000",
    minHeight: "100vh",
    padding: "100px 5% 40px 5%",
  },
  header: { marginBottom: "40px" },
  title: {
    fontSize: "3rem",
    margin: 0,
    color: "#fff",
    fontFamily: "var(--font-bebas)",
    letterSpacing: "2px",
  },
  subtitle: {
    color: "#444",
    fontSize: "0.7rem",
    letterSpacing: "4px",
    marginTop: "5px",
  },
  contentLayout: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "40px",
  },
  sectionTitle: {
    color: "#d4ff00",
    fontSize: "0.8rem",
    letterSpacing: "2px",
    marginBottom: "20px",
    fontWeight: "900",
  },

  // History Grid
  historySection: { minWidth: 0 },
  activityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  activityCard: {
    backgroundColor: "#111",
    border: "1px solid #222",
    cursor: "pointer",
    transition: "0.2s",
  },
  activityMap: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    opacity: 0.7,
  },
  activityDetails: { padding: "15px" },
  activityMainRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  activityName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "0.9rem",
    textTransform: "uppercase",
  },
  activityStatsRow: { display: "flex" },

  // Management Card
  managementSection: {},
  card: {
    backgroundColor: "#111",
    padding: "20px",
    border: "1px solid #1a1a1a",
  },
  inputGroup: { marginBottom: "20px" },
  label: {
    fontSize: "0.6rem",
    color: "#d4ff00",
    letterSpacing: "1px",
    marginBottom: "5px",
    display: "block",
  },
  input: {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid #333",
    color: "#fff",
    padding: "8px 0",
    outline: "none",
    width: "100%",
  },
  saveBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#d4ff00",
    color: "#000",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },

  dangerZone: {
    marginTop: "30px",
    borderTop: "1px solid #222",
    paddingTop: "20px",
  },
  dangerTitle: {
    color: "#ff3e3e",
    fontSize: "0.6rem",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  deleteBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "#ff3e3e",
    border: "1px solid #ff3e3e",
    padding: "10px",
    fontSize: "0.7rem",
    cursor: "pointer",
    marginTop: "10px",
  },
  gdprBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "#888",
    border: "1px solid #333",
    padding: "10px",
    fontSize: "0.7rem",
    cursor: "pointer",
  },

  loader: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    color: "#d4ff00",
    letterSpacing: "5px",
  },
};
