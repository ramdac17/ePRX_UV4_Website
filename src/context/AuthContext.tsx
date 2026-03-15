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
  loading: boolean; // TRUE until localStorage session is restored
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
        localStorage.removeItem("eprx_session");
      }
    }
    setLoading(false); // session restore done
  }, []);

  const login = (user: User, token: string) => {
    const session: Session = { user, token };
    localStorage.setItem("eprx_session", JSON.stringify(session));
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("eprx_session");
    setUser(null);
    setToken(null);
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
