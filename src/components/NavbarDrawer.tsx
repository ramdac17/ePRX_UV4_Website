"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

interface NavbarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function NavbarDrawer({
  isOpen,
  onClose,
  onLogout,
}: NavbarDrawerProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  // 🛰️ Share Protocol: Consistent with Footer logic
  const shareToFacebook = (e: React.MouseEvent) => {
    e.preventDefault();
    const siteUrl = window.location.origin;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  const guestItems = [
    { name: "LIVE EVENTS", path: "/events" },
    { name: "ARTICLES", path: "/articles" },
    { name: "ABOUT US", path: "/aboutus" },
    { name: "CONTACT US", path: "/contactus" },
    { name: "LOGIN", path: "/login" },
  ];

  const authItems = [
    { name: "DASHBOARD", path: "/" },
    { name: "ARTICLES", path: "/articles" },
    { name: "LIVE EVENTS", path: "/events" },
    { name: "POST EVENT", path: "/post-event" },
    { name: "WRITE ARTICLE", path: "/write-article" },
    { name: "ABOUT US", path: "/aboutus" },
    { name: "CONTACT US", path: "/contactus" },
  ];

  const menuItems = user ? authItems : guestItems;

  const linkVariants = {
    initial: { x: 0, color: "#fff" },
    hover: { x: 10, color: "#d4ff00" },
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={styles.backdrop}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={styles.drawer}
          >
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
                      alt="User"
                      style={styles.avatarImg}
                    />
                  ) : (
                    <span style={styles.avatarInitial}>
                      {user?.firstName?.[0] || "G"}
                    </span>
                  )}
                </div>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>
                    {user?.firstName
                      ? `${user.firstName} ${user.lastName || ""}`
                      : "GUEST RUNNER"}
                  </p>
                  <p style={styles.viewProfile}>
                    {user ? "VIEW PROFILE" : "IDENTITY OFFLINE"}
                  </p>
                </div>
              </Link>
            </div>

            <nav style={styles.navLinks}>
              {menuItems.map((item, index) => {
                const isActive = pathname === item.path;
                const showDivider =
                  (item.name === "POST EVENT" && user) ||
                  item.name === "ABOUT US";

                return (
                  <React.Fragment key={index}>
                    {showDivider && <hr style={styles.divider} />}
                    <motion.div
                      variants={linkVariants}
                      initial="initial"
                      whileHover="hover"
                      animate={
                        isActive ? { color: "#d4ff00" } : { color: "#fff" }
                      }
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

              {user && (
                <>
                  <hr style={styles.divider} />
                  <motion.div
                    variants={linkVariants}
                    initial="initial"
                    whileHover={{ x: 10, color: "#ff4444" }}
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ ...styles.link, color: "#ff4444" }}>
                      LOGOUT
                    </div>
                  </motion.div>
                </>
              )}
            </nav>

            <div style={styles.footer}>
              <div style={styles.socialIcons}>
                {/* ⚡ FB Icon triggers site share */}
                <button
                  onClick={shareToFacebook}
                  style={styles.socialBtn}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4ff00")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
                >
                  <Facebook size={16} />
                </button>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  style={styles.socialLink}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4ff00")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  style={styles.socialLink}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#d4ff00")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
                >
                  <Instagram size={16} />
                </a>
              </div>
              <p style={styles.version}>PRX || SYSTEM ACTIVE</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  // ... (Existing styles remain the same)
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
    height: "100%",
    backgroundColor: "#0a0a0a",
    zIndex: 2001,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1a1a1a",
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
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  socialIcons: { display: "flex", gap: "20px" },
  socialLink: {
    color: "#666",
    transition: "all 0.2s ease",
    textDecoration: "none",
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
