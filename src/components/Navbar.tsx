"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import NavbarDrawer from "./NavbarDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

interface NavItem {
  name: string;
  path: string;
  children?: { name: string; path: string }[];
}

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user: authUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 🛠️ REFACTORED TO FORCE ROUTER CACHE FLUSH & CLEAN REDIRECT
  const handleSignOut = () => {
    try {
      logout();
      setIsMenuOpen(false);
      setOpenDropdown(null);
      setImgError(false);

      // Flush the local layout cache state trees
      router.refresh();

      // Hard redirect forces middleware valuation with fresh headers
      window.location.href = "/login";
    } catch (error) {
      console.error("NAVBAR_SIGNOUT_EXC_HANDSHAKE:", error);
    }
  };

  const coreNavItems: NavItem[] = [
    { name: "DASHBOARD", path: "/" },
    {
      name: "RUNNERS GUIDE",
      path: "#",
      children: [
        { name: "GEARS", path: "/gear" },
        { name: "FUEL", path: "/fuel" },
        { name: "MIND", path: "/mind" },
      ],
    },
    {
      name: "ARCHIVES",
      path: "#",
      children: [
        { name: "ARTICLES", path: "/articles" },
        { name: "STORIES", path: "/stories" },
      ],
    },
    { name: "LIVE EVENTS", path: "/events" },
    { name: "ABOUT PRX", path: "/aboutus" },
    { name: "CONTACT PRX", path: "/contactus" },
  ];

  const navItems: NavItem[] = authUser
    ? coreNavItems
    : [...coreNavItems, { name: "JOIN PRX", path: "/register" }];

  const isActiveLink = (path: string) => {
    if (path === "#") return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const getAvatarSrc = () => {
    if (!authUser?.image) return null;
    return authUser.image.startsWith("http")
      ? authUser.image
      : `${STATIC_URL}/${authUser.image}`;
  };

  if (!mounted) return null;

  const avatarSrc = getAvatarSrc();

  return (
    <>
      <NavbarDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLogout={handleSignOut}
      />

      <nav style={styles.navContainer} aria-label="Main Navigation">
        {/* LEFT: Hamburger Menu Trigger */}
        <div style={styles.leftSection}>
          {(isMobile || authUser) && (
            <motion.button
              style={styles.hamburger}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (onMenuClick) {
                  onMenuClick();
                } else {
                  setIsMenuOpen(true);
                }
              }}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              aria-label="Open menu navigation drawer"
            >
              <motion.div
                variants={{ hover: { width: "24px" } }}
                style={{ ...styles.line, width: "18px" }}
              />
              <motion.div
                variants={{ hover: { width: "24px" } }}
                style={{ ...styles.line, width: "24px" }}
              />
              <motion.div
                variants={{ hover: { width: "24px" } }}
                style={{ ...styles.line, width: "14px" }}
              />
            </motion.button>
          )}
        </div>

        {/* CENTER: Desktop Links or Mobile Identity */}
        <div style={styles.centerSection}>
          {isMobile ? (
            <Link href="/" style={styles.mobileBrand}>
              ePRX <span style={{ color: "#d4ff00" }}>UV1</span>
            </Link>
          ) : (
            navItems.map((item) => {
              const isPlaceholder = item.path === "#";
              const active = isActiveLink(item.path);
              const linkStyle = {
                ...styles.navLink,
                color: active ? "#d4ff00" : "#ffffff",
              };

              return (
                <div
                  key={item.name}
                  style={{ position: "relative" }}
                  onMouseEnter={() =>
                    item.children && setOpenDropdown(item.name)
                  }
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {isPlaceholder ? (
                    <button
                      style={{
                        ...linkStyle,
                        background: "none",
                        border: "none",
                        cursor: "default",
                      }}
                      aria-expanded={openDropdown === item.name}
                      aria-haspopup="true"
                    >
                      {item.name} {item.children && "▾"}
                    </button>
                  ) : (
                    <Link href={item.path} style={linkStyle}>
                      {item.name} {item.children && "▾"}
                    </Link>
                  )}

                  <AnimatePresence>
                    {item.children && openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={styles.dropdown}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            href={child.path}
                            style={{
                              ...styles.dropdownItem,
                              color: isActiveLink(child.path)
                                ? "#d4ff00"
                                : "#888",
                            }}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT: User Profile Status Area */}
        <div style={styles.authSection}>
          {authUser ? (
            <div style={styles.profileArea}>
              {!isMobile && (
                <span style={styles.userName}>{authUser.firstName}</span>
              )}
              <Link
                href="/profile"
                style={styles.avatarLink}
                aria-label="View Profile"
              >
                <div style={styles.avatarCircle}>
                  {avatarSrc && !imgError ? (
                    <Image
                      src={avatarSrc}
                      alt="User Profile Avatar"
                      width={32}
                      height={32}
                      style={styles.avatarImg}
                      onError={() => setImgError(true)}
                      unoptimized={avatarSrc.startsWith("http")}
                    />
                  ) : (
                    <span style={styles.avatarInitial}>
                      {authUser.firstName?.[0] ?? "U"}
                    </span>
                  )}
                </div>
              </Link>
              {!isMobile && (
                <button onClick={handleSignOut} style={styles.authBtn}>
                  LOG OUT
                </button>
              )}
            </div>
          ) : (
            <a href="/login" style={styles.loginBtn}>
              LOGIN
            </a>
          )}
        </div>
      </nav>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  navContainer: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 4%",
    backgroundColor: "rgba(5, 5, 5, 0.95)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #1a1a1a",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    boxSizing: "border-box",
    zIndex: 1000,
  },
  leftSection: { flex: 1, display: "flex", alignItems: "center" },
  centerSection: {
    display: "flex",
    gap: "30px",
    justifyContent: "center",
    alignItems: "center",
  },
  mobileBrand: {
    fontFamily: "var(--font-bebas), sans-serif",
    fontSize: "1.4rem",
    fontWeight: "bold",
    letterSpacing: "3px",
    color: "#ffffff",
    textDecoration: "none",
  },
  navLink: {
    fontFamily: "var(--font-bebas), sans-serif",
    fontSize: "0.75rem",
    fontWeight: "bold",
    letterSpacing: "4px",
    color: "#ffffff",
    textDecoration: "none",
    padding: "10px 0",
    transition: "color 0.2s ease",
    userSelect: "none",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#050505",
    border: "1px solid #1a1a1a",
    padding: "10px 0",
    minWidth: "160px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
  },
  dropdownItem: {
    padding: "12px 20px",
    fontSize: "0.7rem",
    textDecoration: "none",
    letterSpacing: "3px",
    fontFamily: "var(--font-bebas)",
    transition: "all 0.3s ease",
  },
  authSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  profileArea: { display: "flex", alignItems: "center", gap: "15px" },
  userName: {
    fontFamily: "monospace",
    fontSize: "0.75rem",
    color: "#d4ff00",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
  },
  avatarLink: { textDecoration: "none" },
  avatarCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#000",
    border: "1.5px solid #d4ff00",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarInitial: { color: "#d4ff00", fontSize: "0.8rem", fontWeight: "bold" },
  authBtn: {
    fontFamily: "var(--font-bebas)",
    fontSize: "0.65rem",
    letterSpacing: "2px",
    color: "#fff",
    background: "transparent",
    border: "1px solid #333",
    padding: "6px 14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
  },
  loginBtn: {
    fontFamily: "var(--font-bebas)",
    fontSize: "0.8rem",
    letterSpacing: "3px",
    color: "#050505",
    backgroundColor: "#d4ff00",
    border: "1px solid #d4ff00",
    padding: "8px 20px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textDecoration: "none",
    display: "inline-block",
    textAlign: "center",
  },
  hamburger: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "10px",
  },
  line: { height: "1.5px", backgroundColor: "#d4ff00" },
};
