import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { accessTokenKey, api } from "../../shared/api/client";
import type { LoginResult, WorkspaceUser } from "./types";

type AuthContextValue = {
  user: WorkspaceUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<WorkspaceUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(accessTokenKey)) {
      setLoading(false);
      return;
    }

    api<WorkspaceUser>("/auth/me")
      .then(setUser)
      .catch(() => localStorage.removeItem(accessTokenKey))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const result = await api<LoginResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(accessTokenKey, result.accessToken);
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem(accessTokenKey);
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
