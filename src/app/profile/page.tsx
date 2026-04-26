"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  image?: string;
};

// 🛰️ Hook for Responsive Inline Styles
function useWindowSize() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function ProfilePage() {
  const router = useRouter();
  const isMobile = useWindowSize();
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
    image: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activities, setActivities] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const notify = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setShowToast(true);
  };

  const fetchData = useCallback(
    async (userId: string, currentToken: string) => {
      setLoading(true);
      try {
        const [profileRes, activityRes] = await Promise.all([
          axios.get(`${API_URL}/auth/profile`, {
            // 👈 Aligned with AuthController
            headers: { Authorization: `Bearer ${currentToken}` },
          }),
          axios.get(`${API_URL}/activities/user/${userId}`, {
            headers: { Authorization: `Bearer ${currentToken}` },
          }),
        ]);

        setUser({ ...profileRes.data, id: userId });
        if (profileRes.data.image) setPreviewUrl(profileRes.data.image);
        setActivities(activityRes.data);
      } catch (err: any) {
        if (err.response?.status === 401) logout();
      } finally {
        setLoading(false);
      }
    },
    [logout],
  );

  useEffect(() => {
    if (authLoading) return;
    const currentToken = token ?? "";
    const userId = authUser?.id ?? "";
    if (!userId || !currentToken) {
      router.push("/login?redirect=/profile");
      return;
    }
    fetchData(userId, currentToken);
  }, [authUser?.id, token, authLoading, router, fetchData]);

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    const currentToken = token ?? "";
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("username", user.username);
      formData.append("mobile", user.mobile);
      if (selectedFile) formData.append("file", selectedFile);

      // 🛰️ Hit upload-avatar in Auth Controller
      const res = await axios.post(`${API_URL}/auth/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      login(
        { ...authUser!, ...user, image: res.data.image || user.image },
        currentToken,
      );
      notify("PROFILE_SYNC_SUCCESSFUL");
      setSelectedFile(null);
      setIsEditing(false);
    } catch (err: any) {
      notify(err.response?.data?.message || "UPDATE_FAILED", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    const currentToken = token ?? "";
    if (!passwords.currentPassword || !passwords.newPassword)
      return notify("FILL_ALL_FIELDS", "error");

    try {
      // 🛡️ Aligned with AuthController POST /auth/change-password
      await axios.post(`${API_URL}/auth/change-password`, passwords, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      notify("PASSWORD_ENCRYPTION_UPDATED");
      setPasswords({ currentPassword: "", newPassword: "" });
      setShowPasswordFields(false);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "CHANGE_REJECTED";
      notify(errorMsg, "error");
    }
  };

  const downloadData = () => {
    const data = {
      profile: user,
      missions: activities,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eprx-data-${user.username}.json`;
    link.click();
    notify("DATA_ARCHIVE_EXPORTED");
  };

  const deleteAccount = async () => {
    const currentToken = token ?? "";
    if (
      window.confirm("CRITICAL_ACTION: Permanently delete your ePRX profile?")
    ) {
      try {
        await axios.delete(`${API_URL}/user/${user.id}`, {
          headers: { Authorization: `Bearer ${currentToken}` },
        });
        logout();
        router.push("/");
      } catch {
        notify("DELETION_FAILED", "error");
      }
    }
  };

  if (loading || authLoading)
    return <div style={styles.loader}>LOADING_ENCRYPTED_PROFILE...</div>;

  return (
    <AuthGuard>
      <div
        style={{
          ...styles.container,
          padding: isMobile ? "80px 20px" : "100px 40px",
        }}
      >
        <div style={styles.titleContainer}>
          <h1
            style={{
              ...styles.title,
              fontSize: isMobile ? "2.5rem" : "3.5rem",
            }}
          >
            USER <span style={{ color: "#d4ff00" }}>PROFILE</span>
          </h1>
          <p style={styles.subtitle}>
            MANAGE YOUR PROFILE CREDENTIALS & MISSION HISTORY
          </p>
        </div>

        <div
          style={{
            ...styles.mainLayout,
            gridTemplateColumns: isMobile ? "1fr" : "450px 1fr",
          }}
        >
          <div
            style={{
              ...styles.leftColumn,
              position: isMobile ? "static" : "sticky",
            }}
          >
            <div style={styles.card}>
              <div style={styles.imageSection}>
                <div style={styles.avatarCircle}>
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      style={styles.preview}
                      alt="Profile"
                    />
                  ) : (
                    <div style={styles.placeholder}>{user.firstName?.[0]}</div>
                  )}
                </div>
                {isEditing && (
                  <label style={styles.uploadBtn}>
                    CHANGE IMAGE
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const compressed = await imageCompression(file, {
                            maxSizeMB: 0.2,
                            maxWidthOrHeight: 500,
                          });
                          setSelectedFile(compressed as File);
                          setPreviewUrl(URL.createObjectURL(compressed));
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>USER NAME</label>
                <input
                  style={styles.input}
                  disabled={!isEditing}
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                />
              </div>

              <div
                style={{
                  ...styles.grid,
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "0" : "20px",
                }}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>FIRST NAME</label>
                  <input
                    style={styles.input}
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                    value={user.lastName}
                    onChange={(e) =>
                      setUser({ ...user, lastName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>MOBILE NUMBER</label>
                <input
                  style={styles.input}
                  disabled={!isEditing}
                  value={user.mobile}
                  onChange={(e) => setUser({ ...user, mobile: e.target.value })}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>EMAIL ADDRESS</label>
                <input
                  style={styles.input}
                  disabled={true}
                  value={user.email}
                />
              </div>

              <button
                onClick={handleUpdate}
                style={{
                  ...styles.saveBtn,
                  opacity: saving ? 0.5 : 1,
                  backgroundColor: isEditing ? "#d4ff00" : "#222",
                  color: isEditing ? "#000" : "#fff",
                }}
                disabled={saving}
              >
                {saving
                  ? "SYNCING..."
                  : isEditing
                    ? "UPDATE PROFILE"
                    : "EDIT PROFILE"}
              </button>

              <div style={styles.divider} />

              <div style={styles.securitySection}>
                <p style={styles.sectionSmallTitle}>SECURITY & PRIVACY</p>
                {!showPasswordFields ? (
                  <button
                    onClick={() => setShowPasswordFields(true)}
                    style={styles.secBtn}
                  >
                    CHANGE PASSWORD
                  </button>
                ) : (
                  <div style={{ marginBottom: 15 }}>
                    <input
                      type="password"
                      placeholder="CURRENT PASSWORD"
                      style={styles.input}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    <input
                      type="password"
                      placeholder="NEW PASSWORD"
                      style={styles.input}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                      <button
                        onClick={handlePasswordChange}
                        style={styles.miniBtn}
                      >
                        SAVE
                      </button>
                      <button
                        onClick={() => setShowPasswordFields(false)}
                        style={styles.cancelBtn}
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}
                <button onClick={downloadData} style={styles.secBtn}>
                  DOWNLOAD DATA (JSON)
                </button>
                <button onClick={deleteAccount} style={styles.dangerBtn}>
                  DELETE ACCOUNT
                </button>
              </div>

              <button onClick={() => router.push("/")} style={styles.backBtn}>
                BACK TO DASHBOARD
              </button>
            </div>
          </div>

          <div
            style={{
              ...styles.rightColumn,
              marginTop: isMobile ? "20px" : "0",
            }}
          >
            <h3 style={styles.sectionTitle}>|| MISSION_LOG_HISTORY</h3>
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
  container: { backgroundColor: "#000", minHeight: "100vh" },
  titleContainer: { textAlign: "center", marginBottom: "50px" },
  title: {
    fontFamily: "var(--font-bebas)",
    letterSpacing: "4px",
    color: "#fff",
    margin: 0,
  },
  subtitle: { fontSize: "0.65rem", color: "#444", letterSpacing: "3px" },
  mainLayout: {
    display: "grid",
    gap: "40px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  leftColumn: { top: "100px", height: "fit-content" },
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
  grid: { display: "flex" },
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
    fontSize: "0.8rem",
  },
  saveBtn: {
    padding: "12px",
    fontWeight: "bold",
    fontFamily: "var(--font-bebas)",
    fontSize: "1.1rem",
    cursor: "pointer",
    letterSpacing: "3px",
    width: "100%",
    border: "none",
    marginBottom: "20px",
    transition: "0.3s",
  },
  divider: { height: "1px", backgroundColor: "#222", margin: "20px 0" },
  securitySection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  sectionSmallTitle: {
    fontSize: "0.6rem",
    color: "#d4ff00",
    letterSpacing: "2px",
    marginBottom: "10px",
  },
  secBtn: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    border: "1px solid #333",
    padding: "8px",
    fontSize: "0.65rem",
    cursor: "pointer",
    letterSpacing: "1px",
    textAlign: "left",
  },
  dangerBtn: {
    backgroundColor: "transparent",
    color: "#ff4444",
    border: "1px solid #442222",
    padding: "8px",
    fontSize: "0.65rem",
    cursor: "pointer",
    letterSpacing: "1px",
    textAlign: "left",
  },
  miniBtn: {
    backgroundColor: "#d4ff00",
    color: "#000",
    border: "none",
    padding: "5px 15px",
    fontSize: "0.6rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    color: "#444",
    border: "none",
    padding: "5px",
    fontSize: "0.6rem",
    cursor: "pointer",
  },
  backBtn: {
    width: "100%",
    backgroundColor: "transparent",
    color: "#444",
    border: "none",
    fontSize: "0.7rem",
    cursor: "pointer",
  },
  rightColumn: { minWidth: 0 },
  sectionTitle: {
    fontSize: "0.7rem",
    color: "#d4ff00",
    letterSpacing: "2px",
    marginBottom: "20px",
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
