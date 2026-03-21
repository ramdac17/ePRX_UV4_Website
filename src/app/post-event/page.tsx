"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PostEventPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BACKEND_API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/post-event");
      } else {
        setCheckingAuth(false);
      }
    }
  }, [user, loading, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(`${BACKEND_API}/event`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        router.push("/events");
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(`BROADCAST_FAILED: ${errorData.message}`);
      }
    } catch (error) {
      alert("CRITICAL ERROR: Uplink failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || checkingAuth) {
    return (
      <div style={styles.loadingContainer}>
        <h2 style={styles.loadingText}>INITIALIZING EVENT SESSION...</h2>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>
          POST <span style={{ color: "#d4ff00" }}>EVENT</span>
        </h1>
        <p style={styles.subtitle}>PRX CONTROL || POST EVENT</p>
      </header>

      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <div style={styles.gridMain}>
          {/* LEFT COLUMN: VISUALS & BRIEFING */}
          <div style={styles.column}>
            <h3 style={styles.sectionTitle}>EVENT DETAILS</h3>

            <div style={styles.imageSection}>
              <label style={styles.label}>UPLOAD EVENT BANNER</label>
              <div
                style={styles.thumbnailBox}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={styles.previewImg}
                    />
                    <div style={styles.removeOverlay} onClick={removeImage}>
                      REMOVE IMAGE
                    </div>
                  </>
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <span style={{ fontSize: "2rem", color: "#d4ff00" }}>
                      +
                    </span>
                    <span>UPLOAD IMAGE</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                name="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>EVENT BRIEFING (DESCRIPTION)</label>
              <textarea
                name="description"
                required
                style={styles.textarea}
                placeholder="INPUT EVENT DETAILS..."
              />
            </div>
          </div>

          {/* RIGHT COLUMN: DATA & INTEL */}
          <div style={styles.column}>
            <h3 style={styles.sectionTitle}>CORE DATA</h3>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>EVENT TITLE</label>
              <input
                name="title"
                required
                style={styles.input}
                placeholder="EVENT TITLE"
              />
            </div>

            <div style={styles.fieldRow}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>DATE</label>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>EVENT URL</label>
                <input
                  name="link"
                  type="url"
                  style={styles.input}
                  placeholder="EVENT URL"
                />
              </div>
            </div>

            <div style={styles.fieldRow}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>LOCATION</label>
                <input
                  name="location"
                  required
                  style={styles.input}
                  placeholder="COORDINATES"
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>ORGANIZER</label>
                <input
                  name="organizer"
                  required
                  style={styles.input}
                  placeholder="ORGANIZER"
                />
              </div>
            </div>

            <h3 style={{ ...styles.sectionTitle, marginTop: "20px" }}>
              CONTACT DETAILS
            </h3>
            <div style={styles.fieldRow}>
              <input
                name="firstName"
                required
                style={styles.input}
                placeholder="FIRST NAME"
              />
              <input
                name="lastName"
                required
                style={styles.input}
                placeholder="LAST NAME"
              />
            </div>
            <div style={styles.fieldRow}>
              <input
                name="email"
                type="email"
                required
                style={styles.input}
                placeholder="EMAIL ADDR"
              />
              <input
                name="mobile"
                type="tel"
                required
                style={styles.input}
                placeholder="SECURE LINE"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.submitBtn,
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "TRANSMITTING..." : "AUTHORIZE BROADCAST"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: "#050505",
    minHeight: "100vh",
    padding: "60px 5%",
    color: "#fff",
    fontFamily: "monospace",
  },
  header: { textAlign: "center", marginBottom: "40px" },
  mainTitle: { fontFamily: "var(--font-bebas)", fontSize: "4rem", margin: 0 },
  subtitle: { color: "#444", fontSize: "0.7rem", letterSpacing: "2px" },
  formContainer: { maxWidth: "1100px", margin: "0 auto" },
  gridMain: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "40px",
  },
  column: { display: "flex", flexDirection: "column", gap: "20px" },
  sectionTitle: {
    fontSize: "0.75rem",
    color: "#d4ff00",
    letterSpacing: "3px",
    borderLeft: "3px solid #d4ff00",
    paddingLeft: "10px",
    margin: "0 0 10px 0",
  },
  fieldRow: { display: "flex", gap: "10px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
  label: { fontSize: "0.6rem", color: "#666", textTransform: "uppercase" },
  input: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    padding: "12px",
    color: "#fff",
    outline: "none",
    fontSize: "0.8rem",
    width: "100%",
  },
  textarea: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    padding: "12px",
    color: "#fff",
    minHeight: "220px",
    outline: "none",
    fontSize: "0.8rem",
    resize: "none",
  },
  thumbnailBox: {
    width: "100%",
    aspectRatio: "16/9",
    backgroundColor: "#0a0a0a",
    border: "1px dashed #333",
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.3s",
  },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  removeOverlay: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(255,0,0,0.7)",
    padding: "5px 10px",
    fontSize: "0.6rem",
    borderRadius: "2px",
  },
  uploadPlaceholder: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  submitBtn: {
    backgroundColor: "#d4ff00",
    color: "#000",
    border: "none",
    padding: "16px",
    fontFamily: "var(--font-bebas)",
    fontSize: "1.4rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "auto",
  },
  loadingContainer: {
    backgroundColor: "#050505",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#d4ff00", letterSpacing: "4px" },
};
