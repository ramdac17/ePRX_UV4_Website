"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Instagram } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

interface NavbarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

// Nav item type
interface NavItem {
  name: string;
  path: string;
}

// Guest nav items
const guestItems: NavItem[] = [
  { name: "LIVE EVENTS", path: "/events" },
  { name: "ARTICLES", path: "/articles" },
  { name: "ABOUT US", path: "/aboutus" },
  { name: "CONTACT US", path: "/contactus" },
  { name: "LOGIN", path: "/login" },
];

const authItems: NavItem[] = [
  { name: "DASHBOARD", path: "/" },
  { name: "ACTIVITIES", path: "/activities" },
  { name: "ARTICLES", path: "/articles" },
  { name: "LIVE EVENTS", path: "/events" },
  { name: "MY STORY", path: "/my-story" }, // confirm this route exists
  { name: "PUBLISH EVENT", path: "/post-event" },
  { name: "WRITE ARTICLE", path: "/write-article" },
  { name: "ABOUT US", path: "/aboutus" },
  { name: "CONTACT US", path: "/contactus" },
];

// Items that get a divider rendered above them
const DIVIDER_BEFORE = new Set(["MY STORY", "ABOUT US"]);

export default function NavbarDrawer({
  isOpen,
  onClose,
  onLogout,
}: NavbarDrawerProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const menuItems = user ? authItems : guestItems;

  const shareToFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    const siteUrl = window.location.origin;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={styles.backdrop}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={styles.drawer}
            // Stop propagation here to prevent clicks inside the drawer
            // from bubbling out into the backdrop container.
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Profile */}
            <div style={styles.header}>
              <Link
                href="/profile"
                onClick={onClose}
                style={styles.profileLink}
              >
                <div style={styles.avatarCircle}>
                  {user?.image ? (
                    <img
                      src={
                        user.image.startsWith("http")
                          ? user.image
                          : `${STATIC_URL}/${user.image}`
                      }
                      alt="User avatar"
                      style={styles.avatarImg}
                    />
                  ) : (
                    <span style={styles.avatarInitial}>
                      {user?.firstName?.[0] ?? "G"}
                    </span>
                  )}
                </div>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>
                    {user?.firstName
                      ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                      : "GUEST RUNNER"}
                  </p>
                  <p style={styles.viewProfile}>
                    {user ? "VIEW PROFILE" : "IDENTITY OFFLINE"}
                  </p>
                </div>
              </Link>
            </div>

            {/* Nav Links */}
            <nav style={styles.navLinks}>
              {menuItems.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <React.Fragment key={`${item.path}-${item.name}`}>
                    {DIVIDER_BEFORE.has(item.name) && (
                      <hr style={styles.divider} />
                    )}

                    <motion.div
                      variants={{
                        inactive: { x: 0, color: "#fff" },
                        active: { x: 0, color: "#d4ff00" },
                        hover: { x: 10, color: "#d4ff00" },
                      }}
                      initial={isActive ? "active" : "inactive"}
                      animate={isActive ? "active" : "inactive"}
                      whileHover="hover"
                    >
                      <Link
                        href={item.path}
                        onClick={onClose}
                        style={styles.link}
                      >
                        {item.name}
                        {isActive && <span style={styles.activeDot}> •</span>}
                      </Link>
                    </motion.div>
                  </React.Fragment>
                );
              })}

              {/* Logout — only for authenticated users */}
              {user && (
                <>
                  <hr style={styles.divider} />
                  <motion.div
                    initial={{ x: 0, color: "#ff4444" }}
                    whileHover={{ x: 10, color: "#ff6666" }}
                    onClick={(e) => {
                      e.preventDefault();
                      onLogout();
                      onClose();
                    }}
                    style={{ cursor: "pointer", marginBottom: "20px" }}
                  >
                    <div style={{ ...styles.link, color: "inherit" }}>
                      LOGOUT
                    </div>
                  </motion.div>
                </>
              )}
            </nav>

            {/* Footer */}
            <div style={styles.footer}>
              <div style={styles.socialIcons}>
                <button
                  onClick={shareToFacebook}
                  style={styles.socialBtn}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4ff00")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
                  aria-label="Share on Facebook"
                >
                  <Facebook size={16} />
                </button>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.socialLink}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4ff00")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
                  aria-label="Visit Instagram"
                >
                  <Instagram size={16} />
                </a>
              </div>
              <p style={styles.version}>PRXph.com || PINOY RUNNER EXTREME</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 2000,
    backdropFilter: "blur(4px)",
  },
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "300px",
    // 1. Use 100dvh (Dynamic Viewport Height) so it respects mobile browser address bars
    height: "100dvh",
    backgroundColor: "#0a0a0a",
    zIndex: 2001,
    // 2. Reduce the padding slightly to gain back precious vertical screen estate
    padding: "32px 32px 24px 32px", // Top, Right, Bottom, Left
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1a1a1a",

    // 3. THE CRITICAL FIX: Allow content to scroll vertically if it overflows
    overflowY: "auto",
    WebkitOverflowScrolling: "touch", // Smooth physics scrolling for iOS touch targets
  },
  header: {
    marginBottom: "40px",
    paddingBottom: "30px",
    borderBottom: "1px solid #1a1a1a",
  },
  profileLink: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textDecoration: "none",
  },
  avatarCircle: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    border: "1.5px solid #d4ff00",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
    flexShrink: 0,
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarInitial: {
    color: "#d4ff00",
    fontWeight: "bold",
    fontSize: "1.2rem",
    fontFamily: "monospace",
  },
  userInfo: { display: "flex", flexDirection: "column" },
  userName: {
    color: "#fff",
    fontSize: "0.8rem",
    letterSpacing: "1px",
    margin: 0,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "monospace",
  },
  viewProfile: {
    color: "#d4ff00",
    fontSize: "0.6rem",
    letterSpacing: "2px",
    marginTop: "4px",
    fontFamily: "monospace",
  },
  navLinks: { display: "flex", flexDirection: "column", gap: "25px" },
  link: {
    color: "inherit",
    textDecoration: "none",
    fontSize: "0.75rem",
    letterSpacing: "4px",
    display: "block",
    fontFamily: "monospace",
  },
  activeDot: { fontSize: "1.2rem", verticalAlign: "middle" },
  divider: {
    border: "none",
    height: "1px",
    background: "linear-gradient(90deg, #1a1a1a 0%, #333 50%, #1a1a1a 100%)",
    margin: "5px 0",
    width: "100%",
  },
  footer: {
    // 4. Keeps pushing to bottom when space allows, but turns into a safety margin on short screens
    marginTop: "auto",
    paddingTop: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flexShrink: 0, // Prevents the footer elements from being crushed or deformed
  },
  socialIcons: { display: "flex", gap: "20px" },
  socialLink: {
    color: "#666",
    transition: "all 0.2s ease",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
  socialBtn: {
    background: "none",
    border: "none",
    padding: 0,
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
  },
  version: {
    color: "#333",
    fontSize: "0.5rem",
    letterSpacing: "3px",
    fontFamily: "monospace",
  },
};
