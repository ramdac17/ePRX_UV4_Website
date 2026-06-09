"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  mobile?: string;
  image?: string;
  emailVerified?: boolean;
}

interface Session {
  user: User;
  token: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    const sessionStr = localStorage.getItem("eprx_session");
    if (sessionStr) {
      try {
        const parsed: Session = JSON.parse(sessionStr);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        // Clear everything out if local storage string is corrupted
        localStorage.removeItem("eprx_session");
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;";
      }
    }
    setLoading(false);
  }, []);

  const login = (user: User, token: string) => {
    const session: Session = { user, token };
    localStorage.setItem("eprx_session", JSON.stringify(session));
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    try {
      // 1. Wipe local memory footprint
      localStorage.removeItem("eprx_session");
      setUser(null);
      setToken(null);

      // 🚨 2. WIPE THE COOKIE SO THE MIDDLEWARE KNOWS YOU LOGGED OUT
      // Ensures the middleware path validation lets you view /login again
      document.cookie =
        "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0;";
    } catch (error) {
      console.error("AUTH_CONTEXT_LOGOUT_ERR:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}
