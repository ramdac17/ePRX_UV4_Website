"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import imageCompression from "browser-image-compression";

export default function WriteArticlePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login?redirect=/write-article");
      } else {
        setCheckingAuth(false);
      }
    }
  }, [user, loading, router]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setSelectedFile(compressedFile);
    } catch (error) {
      console.error("COMPRESSION_ERROR:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCompressing) return;
    setIsSubmitting(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
    const formElement = e.currentTarget;
    const formData = new FormData();

    formData.append(
      "title",
      (formElement.elements.namedItem("title") as HTMLInputElement).value,
    );
    formData.append(
      "category",
      (formElement.elements.namedItem("category") as HTMLSelectElement).value,
    );
    formData.append(
      "content",
      (formElement.elements.namedItem("content") as HTMLTextAreaElement).value,
    );
    formData.append("authorId", user?.id || "");
    if (selectedFile) formData.append("file", selectedFile);

    try {
      const response = await fetch(`${BACKEND_URL}/article`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("PUBLICATION_FAILED");
      }
    } catch (error) {
      console.error("CONNECTION_ERROR:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || checkingAuth)
    return (
      <div style={styles.loadingContainer}>
        <h2 style={styles.loadingText}>INITIALIZING EDITOR...</h2>
      </div>
    );

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>
          WRITE <span style={{ color: "#d4ff00" }}>ARTICLES</span>
        </h1>
        <p style={styles.subtitle}>EDITORIAL || WRITE ARTICLES</p>
      </header>

      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <h3 style={styles.sectionTitle}>ARTICLE</h3>

        <div style={styles.column}>
          {/* IMAGE UPLOAD */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>UPLOAD IMAGE</label>
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
                  <div style={styles.removeOverlay} onClick={handleRemoveImage}>
                    REMOVE IMAGE
                  </div>
                  {isCompressing && (
                    <div style={styles.compressionOverlay}>OPTIMIZING...</div>
                  )}
                </>
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <span style={{ fontSize: "2rem", color: "#d4ff00" }}>+</span>
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

          {/* TITLE */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>ARTICLE TITLE</label>
            <input
              name="title"
              required
              style={styles.input}
              placeholder="ENTER AN ARTICLE TITLE..."
            />
          </div>

          {/* CLASSIFICATION */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>CLASSIFICATION</label>
            <select name="category" required style={styles.select}>
              <option value="GEAR">GEAR</option>
              <option value="FUEL">FUEL</option>
              <option value="MIND">MIND</option>
              <option value="ARTICLE">ARTICLE</option>
            </select>
          </div>

          {/* CONTENT */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>ARTICLE CONTENT</label>
            <textarea
              name="content"
              required
              style={styles.textarea}
              placeholder="INPUT ARTICLE CONTENT..."
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            style={{
              ...styles.submitBtn,
              opacity: isSubmitting || isCompressing ? 0.5 : 1,
            }}
          >
            {isSubmitting ? "TRANSMITTING..." : "PUBLISH ARTICLE"}
          </button>
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
  formContainer: { maxWidth: "700px", margin: "0 auto" },
  column: { display: "flex", flexDirection: "column", gap: "25px" },
  sectionTitle: {
    fontSize: "0.75rem",
    color: "#d4ff00",
    letterSpacing: "3px",
    borderLeft: "3px solid #d4ff00",
    paddingLeft: "10px",
    marginBottom: "25px",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.6rem", color: "#666" },
  input: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    padding: "12px",
    color: "#fff",
    outline: "none",
    fontSize: "0.85rem",
  },
  select: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    padding: "12px",
    color: "#fff",
    outline: "none",
    fontSize: "0.85rem",
  },
  textarea: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    padding: "12px",
    color: "#fff",
    minHeight: "400px",
    outline: "none",
    fontSize: "0.9rem",
    resize: "none",
    lineHeight: "1.6",
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
    overflow: "hidden",
  },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  removeOverlay: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(255,0,0,0.8)",
    padding: "5px 10px",
    fontSize: "0.6rem",
    cursor: "pointer",
  },
  uploadPlaceholder: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    color: "#444",
    fontSize: "0.7rem",
  },
  compressionOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#d4ff00",
    fontSize: "0.7rem",
  },
  submitBtn: {
    backgroundColor: "#d4ff00",
    color: "#000",
    border: "none",
    padding: "18px",
    fontFamily: "var(--font-bebas)",
    fontSize: "1.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
  },
  loadingContainer: {
    backgroundColor: "#050505",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#d4ff00",
    letterSpacing: "4px",
    fontFamily: "monospace",
  },
};
