"use client";

import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import imageCompression from "browser-image-compression";
import Toast from "@/components/Toast";
import { AuthGuard } from "@/components/AuthGuard";
import ActivityLog from "@/components/ActivityLog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  password?: string;
  image?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const {
    user: authUser,
    token,
    loading: authLoading,
    login,
    logout,
  } = useAuth();

  const [user, setUser] = useState<UserProfile>({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    image: "",
  });

  const [activities, setActivities] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // 1. DATA FETCHING LOGIC
  useEffect(() => {
    if (authLoading) return;

    // Create a stable reference to the ID and Token
    const userId = authUser?.id;
    const currentToken = token;

    if (!userId || !currentToken) {
      router.push("/login?redirect=/profile");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, activityRes] = await Promise.all([
          axios.get(`${API_URL}/user/profile?id=${userId}`, {
            headers: { Authorization: `Bearer ${currentToken}` },
          }),
          axios.get(`${API_URL}/activities/user/${userId}`, {
            headers: { Authorization: `Bearer ${currentToken}` },
          }),
        ]);

        const profile = profileRes.data;
        setUser({
          ...profile,
          id: userId,
          password: "",
        });

        if (profile.image) setPreviewUrl(profile.image);
        setActivities(activityRes.data);
      } catch (err: any) {
        console.error("DATA_FETCH_ERROR", err);
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authUser?.id, token, authLoading, router, logout]);

  // 2. IMAGE OPTIMIZATION
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 500,
      });
      setSelectedFile(compressed as File);
      setPreviewUrl(URL.createObjectURL(compressed));
    } catch {
      setToastMsg("IMAGE OPTIMIZATION FAILED");
      setToastType("error");
      setShowToast(true);
    }
  };

  // 3. UPDATE HANDLER
  const handleUpdate = async () => {
    if (!user.id || !token) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("username", user.username);
      formData.append("mobile", user.mobile);
      if (selectedFile) formData.append("file", selectedFile);

      const res = await axios.post(
        `${API_URL}/user/${user.id}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      login(
        { ...authUser!, ...user, image: res.data.image || user.image },
        token,
      );

      setToastMsg("PROFILE_SYNC_SUCCESSFUL");
      setToastType("success");
      setShowToast(true);
    } catch (err) {
      setToastMsg("UPDATE_FAILED");
      setToastType("error");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading)
    return <div style={styles.loader}>LOADING_ENCRYPTED_PROFILE...</div>;

  return (
    <AuthGuard>
      <div style={styles.container}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>
            USER <span style={{ color: "#d4ff00" }}>PROFILE</span>
          </h1>
          <p style={styles.subtitle}>
            MANAGE YOUR PROFILE CREDENTIALS & MISSION HISTORY
          </p>
        </div>

        <div style={styles.mainLayout}>
          {/* LEFT COLUMN: THE FORM (Config) */}
          <div style={styles.leftColumn}>
            <div style={styles.card}>
              <div style={styles.imageSection}>
                <div style={styles.avatarCircle}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      style={styles.preview}
                    />
                  ) : (
                    <div style={styles.placeholder}>
                      {user.firstName?.[0] || "U"}
                    </div>
                  )}
                </div>
                <label style={styles.uploadBtn}>
                  {selectedFile ? "IMAGE_READY" : "CHANGE IMAGE"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>USER NAME</label>
                <input
                  style={styles.input}
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
              </div>

              <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>FIRST NAME</label>
                  <input
                    style={styles.input}
                    value={user.firstName}
                    onChange={(e) =>
                      setUser({ ...user, firstName: e.target.value })
                    }
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>LAST NAME</label>
                  <input
                    style={styles.input}
                    value={user.lastName}
                    onChange={(e) =>
                      setUser({ ...user, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>EMAIL (PERMANENT ID)</label>
                <input
                  value={user.email}
                  disabled
                  style={{
                    ...styles.input,
                    color: "#444",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              <button
                onClick={handleUpdate}
                style={{ ...styles.saveBtn, opacity: saving ? 0.5 : 1 }}
                disabled={saving}
              >
                {saving ? "SYNCING_DATA..." : "UPDATE PROFILE"}
              </button>

              <button onClick={() => router.push("/")} style={styles.backBtn}>
                BACK TO DASHBOARD
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: MISSION LOGS */}
          <div style={styles.rightColumn}>
            <h3 style={styles.sectionTitle}>|| MISSION_LOG_HISTORY</h3>

            {/* Mounting the component here */}
            <ActivityLog activities={activities} />
          </div>
        </div>

        <Toast
          message={toastMsg}
          isVisible={showToast}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      </div>
    </AuthGuard>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#000",
    minHeight: "100vh",
    padding: "100px 40px 40px 40px",
  },
  titleContainer: { textAlign: "center", marginBottom: "50px" },
  title: {
    fontFamily: "var(--font-bebas)",
    fontSize: "3.5rem",
    letterSpacing: "4px",
    color: "#fff",
    margin: 0,
  },
  subtitle: { fontSize: "0.65rem", color: "#444", letterSpacing: "3px" },

  mainLayout: {
    display: "grid",
    gridTemplateColumns: "450px 1fr",
    gap: "40px",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // Left Side (Form)
  leftColumn: { position: "sticky", top: "100px", height: "fit-content" },
  card: {
    backgroundColor: "#111",
    padding: "30px",
    border: "1px solid #1a1a1a",
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "25px",
  },
  avatarCircle: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "2px solid #1a1a1a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  preview: { width: "100%", height: "100%", objectFit: "cover" },
  placeholder: { fontSize: "2.5rem", color: "#d4ff00" },
  uploadBtn: {
    fontSize: "0.6rem",
    color: "#d4ff00",
    cursor: "pointer",
    border: "1px solid #d4ff00",
    padding: "6px 14px",
    marginTop: "10px",
  },
  grid: { display: "flex", gap: "20px" },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
    width: "100%",
  },
  label: {
    fontSize: "0.6rem",
    color: "#444",
    letterSpacing: "2px",
    marginBottom: "5px",
  },
  input: {
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid #222",
    color: "#fff",
    padding: "10px 0",
    outline: "none",
    width: "100%",
  },
  saveBtn: {
    backgroundColor: "#d4ff00",
    padding: "12px",
    fontWeight: "bold",
    fontFamily: "var(--font-bebas)",
    fontSize: "1.1rem",
    color: "#000",
    cursor: "pointer",
    letterSpacing: "3px",
    width: "100%",
    border: "none",
    marginBottom: "10px",
  },
  backBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "#444",
    border: "none",
    fontSize: "0.7rem",
    cursor: "pointer",
  },

  // Right Side (Activities)
  rightColumn: { minWidth: 0 },
  sectionTitle: {
    fontSize: "0.7rem",
    color: "#d4ff00",
    letterSpacing: "2px",
    marginBottom: "20px",
  },
  activityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  activityCard: {
    backgroundColor: "#111",
    border: "1px solid #1a1a1a",
    cursor: "pointer",
    overflow: "hidden",
    transition: "0.2s",
  },
  activityMap: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    opacity: 0.6,
  },
  activityInfo: { padding: "15px" },
  activityTitle: {
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: "bold",
    marginBottom: "5px",
    textTransform: "uppercase",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#555",
    fontSize: "0.7rem",
    fontFamily: "monospace",
  },
  emptyState: {
    color: "#333",
    fontSize: "0.8rem",
    letterSpacing: "2px",
    border: "1px dashed #222",
    padding: "40px",
    textAlign: "center",
  },

  loader: {
    color: "#d4ff00",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
};
