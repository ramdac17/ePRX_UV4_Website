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
      <div style={localStyles.loadingContainer}>
        <h2 style={localStyles.loadingText}>INITIALIZING EDITOR...</h2>
      </div>
    );

  return (
    <div style={localStyles.pageContainer}>
      <header style={localStyles.header}>
        <h1 className="responsive-title" style={localStyles.mainTitle}>
          WRITE <span style={{ color: "#d4ff00" }}>ARTICLES</span>
        </h1>
        <p style={localStyles.subtitle}>PRXph.com || CREATE ARTICLE</p>
      </header>

      <form onSubmit={handleSubmit} style={localStyles.formContainer}>
        <h3 style={localStyles.sectionTitle}>ARTICLE CREATION</h3>

        <div style={localStyles.column}>
          {/* IMAGE UPLOAD */}
          <div style={localStyles.fieldGroup}>
            <label style={localStyles.label}>UPLOAD IMAGE (LANDSCAPE)</label>
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
                    onClick={handleRemoveImage}
                  >
                    REMOVE FILE
                  </div>
                  {isCompressing && (
                    <div style={localStyles.compressionOverlay}>
                      OPTIMIZING BITRATE...
                    </div>
                  )}
                </>
              ) : (
                <div style={localStyles.uploadPlaceholder}>
                  <span style={{ fontSize: "2rem", color: "#d4ff00" }}>+</span>
                  <span>SELECT IMAGE FILE</span>
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
          <div style={localStyles.fieldGroup}>
            <label style={localStyles.label}>ARTICLE TITLE</label>
            <input
              name="title"
              required
              style={localStyles.input}
              placeholder="ENTER ARTICLE TITLE..."
            />
          </div>

          {/* CLASSIFICATION */}
          <div style={localStyles.fieldGroup}>
            <label style={localStyles.label}>CATEGORY</label>
            <select name="category" required style={localStyles.select}>
              <option value="GEAR">GEAR</option>
              <option value="FUEL">FUEL</option>
              <option value="MIND">MIND</option>
              <option value="ARTICLE">ARTICLE</option>
            </select>
          </div>

          {/* CONTENT */}
          <div style={localStyles.fieldGroup}>
            <label style={localStyles.label}>WRITE ARTICLE</label>
            <textarea
              name="content"
              required
              style={localStyles.textarea}
              placeholder="INPUT ARTICLE CONTENT HERE..."
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting || isCompressing}
            style={{
              ...localStyles.submitBtn,
              opacity: isSubmitting || isCompressing ? 0.5 : 1,
            }}
          >
            {isSubmitting ? "TRANSMITTING..." : "PUBLISH ARTICLE"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .responsive-title {
          font-size: 4rem;
          letter-spacing: 2px;
        }

        @media (max-width: 768px) {
          .responsive-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .responsive-title {
            font-size: 2rem;
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
    textTransform: "uppercase",
  },
  subtitle: { color: "#444", fontSize: "0.6rem", letterSpacing: "3px" },
  formContainer: { maxWidth: "800px", margin: "0 auto" },
  column: { display: "flex", flexDirection: "column", gap: "25px" },
  sectionTitle: {
    fontSize: "0.7rem",
    color: "#d4ff00",
    letterSpacing: "3px",
    borderLeft: "2px solid #d4ff00",
    paddingLeft: "10px",
    marginBottom: "25px",
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.55rem", color: "#666", textTransform: "uppercase" },
  input: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    padding: "14px",
    color: "#fff",
    outline: "none",
    fontSize: "0.85rem",
  },
  select: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    padding: "14px",
    color: "#fff",
    outline: "none",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  textarea: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #1a1a1a",
    padding: "14px",
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
    border: "1px dashed #222",
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
    fontSize: "0.5rem",
    cursor: "pointer",
    fontWeight: "bold",
  },
  uploadPlaceholder: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    color: "#444",
    fontSize: "0.6rem",
    textTransform: "uppercase",
  },
  compressionOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#d4ff00",
    fontSize: "0.6rem",
    letterSpacing: "2px",
  },
  submitBtn: {
    backgroundColor: "#d4ff00",
    color: "#000",
    border: "none",
    padding: "20px",
    fontFamily: "var(--font-bebas)",
    fontSize: "1.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
    marginTop: "10px",
    letterSpacing: "1px",
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
    fontSize: "0.8rem",
  },
};
