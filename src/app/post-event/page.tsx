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
      <div style={localStyles.loadingContainer}>
        <h2 style={localStyles.loadingText}>INITIALIZING EVENT SESSION...</h2>
      </div>
    );
  }

  return (
    <div style={localStyles.pageContainer}>
      <header style={localStyles.header}>
        <h1 className="responsive-title" style={localStyles.mainTitle}>
          POST <span style={{ color: "#d4ff00" }}>EVENT</span>
        </h1>
        <p style={localStyles.subtitle}>PRXPH.COM || SECURE_UPLINK_PROTOCOL</p>
      </header>

      <form onSubmit={handleSubmit} style={localStyles.formContainer}>
        <div className="form-grid">
          {/* LEFT COLUMN: VISUALS & BRIEFING */}
          <div style={localStyles.column}>
            <h3 style={localStyles.sectionTitle}>EVENT DETAILS</h3>

            <div style={localStyles.imageSection}>
              <label style={localStyles.label}>
                UPLOAD EVENT BANNER (16:9 RECOMMENDED)
              </label>
              <div
                style={localStyles.thumbnailBox}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={localStyles.previewImg}
                    />
                    <div
                      style={localStyles.removeOverlay}
                      onClick={removeImage}
                    >
                      REMOVE IMAGE
                    </div>
                  </>
                ) : (
                  <div style={localStyles.uploadPlaceholder}>
                    <span style={{ fontSize: "2rem", color: "#d4ff00" }}>
                      +
                    </span>
                    <span style={{ fontSize: "0.6rem" }}>UPLOAD_ASSET</span>
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

            <div style={localStyles.fieldGroup}>
              <label style={localStyles.label}>
                EVENT BRIEFING (DESCRIPTION)
              </label>
              <textarea
                name="description"
                required
                style={localStyles.textarea}
                placeholder="INPUT EVENT DESCRIPTION..."
              />
            </div>
          </div>

          {/* RIGHT COLUMN: DATA & INTEL */}
          <div style={localStyles.column}>
            <h3 style={localStyles.sectionTitle}>CORE DATA</h3>
            <div style={localStyles.fieldGroup}>
              <label style={localStyles.label}>EVENT TITLE</label>
              <input
                name="title"
                required
                style={localStyles.input}
                placeholder="EVENT TITLE"
              />
            </div>

            <div className="input-row">
              <div style={localStyles.fieldGroup}>
                <label style={localStyles.label}>EVENT DATE</label>
                <input
                  name="date"
                  type="datetime-local"
                  required
                  style={localStyles.input}
                />
              </div>
              <div style={localStyles.fieldGroup}>
                <label style={localStyles.label}>EVENT LINK (IMPORTANT)</label>
                <input
                  name="link"
                  type="url"
                  style={localStyles.input}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="input-row">
              <div style={localStyles.fieldGroup}>
                <label style={localStyles.label}>EVENT LOCATION</label>
                <input
                  name="location"
                  required
                  style={localStyles.input}
                  placeholder="LOCATION"
                />
              </div>
              <div style={localStyles.fieldGroup}>
                <label style={localStyles.label}>EVENT ORGANIZER</label>
                <input
                  name="organizer"
                  required
                  style={localStyles.input}
                  placeholder="ORGANIZER"
                />
              </div>
            </div>

            <h3 style={{ ...localStyles.sectionTitle, marginTop: "20px" }}>
              CONTACT INFO
            </h3>
            <div className="input-row">
              <input
                name="firstName"
                required
                style={localStyles.input}
                placeholder="FIRST NAME"
              />
              <input
                name="lastName"
                required
                style={localStyles.input}
                placeholder="LAST NAME"
              />
            </div>
            <div className="input-row">
              <input
                name="email"
                type="email"
                required
                style={localStyles.input}
                placeholder="EMAIL"
              />
              <input
                name="mobile"
                type="tel"
                required
                style={localStyles.input}
                placeholder="MOBILE"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...localStyles.submitBtn,
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "TRANSMITTING..." : "PUBLISH EVENT"}
            </button>
          </div>
        </div>
      </form>

      {/* INLINE CSS FOR RESPONSIVENESS */}
      <style jsx>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }
        .input-row {
          display: flex;
          gap: 10px;
        }
        .responsive-title {
          font-size: 4rem;
        }

        @media (max-width: 900px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .responsive-title {
            font-size: 2.5rem;
          }
        }
        @media (max-width: 600px) {
          .input-row {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}

const localStyles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    backgroundColor: "#050505",
    minHeight: "100vh",
    padding: "60px 5%",
    color: "#fff",
    fontFamily: "monospace",
  },
  header: { textAlign: "center", marginBottom: "40px" },
  mainTitle: {
    fontFamily: "var(--font-bebas)",
    margin: 0,
    letterSpacing: "2px",
  },
  subtitle: { color: "#444", fontSize: "0.6rem", letterSpacing: "3px" },
  formContainer: { maxWidth: "1100px", margin: "0 auto" },
  column: { display: "flex", flexDirection: "column", gap: "20px" },
  sectionTitle: {
    fontSize: "0.7rem",
    color: "#d4ff00",
    letterSpacing: "3px",
    borderLeft: "2px solid #d4ff00",
    paddingLeft: "10px",
    margin: "0 0 10px 0",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
  label: { fontSize: "0.55rem", color: "#666", textTransform: "uppercase" },
  input: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    padding: "14px",
    color: "#fff",
    outline: "none",
    fontSize: "0.8rem",
    width: "100%",
  },
  textarea: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    padding: "14px",
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
    border: "1px dashed #222",
    display: "flex",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  removeOverlay: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(255,0,0,0.8)",
    padding: "4px 8px",
    fontSize: "0.5rem",
    borderRadius: "1px",
    fontWeight: "bold",
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
    padding: "18px",
    fontFamily: "var(--font-bebas)",
    fontSize: "1.4rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "20px",
    letterSpacing: "1px",
  },
  loadingContainer: {
    backgroundColor: "#050505",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#d4ff00", letterSpacing: "4px", fontSize: "0.8rem" },
};
