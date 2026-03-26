"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { useIsMobile } from "../../hooks/useMediaQuery";

export default function Footer() {
  const { isMobile } = useIsMobile();
  // 🛰️ Share Protocol: Targets the root domain of the site
  const shareEntireSiteToFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    const siteUrl = window.location.origin;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  const dynamicContainer = {
    ...styles.container,
    flexDirection: isMobile ? "column" : "row",
    alignItems: isMobile ? "flex-start" : "center",
    gap: isMobile ? "40px" : "30px",
  };

  return (
    <footer
      style={{
        ...styles.footer,
        padding: isMobile ? "40px 20px" : "40px 60px",
      }}
    >
      <div style={styles.container}>
        {/* Left: Branding */}
        <div style={dynamicContainer as any}>
          <div style={styles.brandSection}>
            <span style={styles.brand}>PRX - PINOY RUNNER EXTREME</span>
            <span style={styles.copyright}>© 2026 || ALL RIGHTS RESERVED</span>
          </div>

          {/* Center: Navigation Links */}
          <div style={styles.linkSection}>
            <Link
              href="/aboutus"
              style={styles.link}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4ff00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              ABOUT PRX
            </Link>
            <Link
              href="/contactus"
              style={styles.link}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4ff00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              CONTACT PRX
            </Link>
            <Link
              href="/privacy"
              style={styles.link}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4ff00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              PRIVACY & SECURITY
            </Link>
          </div>

          {/* Social Media Icons */}
          <div style={styles.socialSection}>
            {/* ⚡ FB Icon now triggers the site-wide share protocol */}
            <button
              onClick={shareEntireSiteToFacebook}
              style={{
                ...styles.socialLink,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4ff00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              <Facebook size={18} />
            </button>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialLink}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4ff00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              <Twitter size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.socialLink}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4ff00")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              <Instagram size={18} />
            </a>
          </div>

          {/* Right: System Status */}
          <div style={styles.statusSection}>
            <div style={styles.statusGroup}>
              <span style={styles.statusLabel}>LATENCY</span>
              <span style={styles.statusValue}>12MS</span>
            </div>
            <div style={styles.statusGroup}>
              <span style={styles.statusLabel}>ENCRYPTION</span>
              <span style={styles.statusValue}>ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    width: "100%",
    backgroundColor: "#050505",
    borderTop: "1px solid #1a1a1a",
    padding: "40px 60px",
    marginTop: "auto",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "30px",
  },
  brandSection: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  brand: {
    color: "#d4ff00",
    fontSize: "0.8rem",
    letterSpacing: "4px",
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  copyright: {
    color: "#444",
    fontSize: "0.5rem",
    letterSpacing: "2px",
    fontFamily: "monospace",
  },
  linkSection: {
    display: "flex",
    gap: "40px",
  },
  link: {
    color: "#888",
    textDecoration: "none",
    fontSize: "0.65rem",
    letterSpacing: "2px",
    fontFamily: "monospace",
    transition: "color 0.2s ease",
  },
  socialSection: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  socialLink: {
    color: "#888",
    transition: "color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusSection: {
    display: "flex",
    gap: "30px",
  },
  statusGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  statusLabel: {
    fontSize: "0.45rem",
    color: "#333",
    letterSpacing: "2px",
    fontFamily: "monospace",
  },
  statusValue: {
    fontSize: "0.6rem",
    color: "#666",
    letterSpacing: "1px",
    fontFamily: "monospace",
  },
};
