import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type RouterState = {
  path: string;
  navigate: (to: string, replace?: boolean) => void;
};

const RouterContext = createContext<RouterState | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    window.history[replace ? "replaceState" : "pushState"]({}, "", to);
    setPath(to);
  }, []);

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const value = useContext(RouterContext);
  if (!value) throw new Error("useRouter must be used inside RouterProvider.");
  return value;
}

export function Redirect({ to }: { to: string }) {
  const { navigate } = useRouter();
  useEffect(() => navigate(to, true), [navigate, to]);
  return null;
}
