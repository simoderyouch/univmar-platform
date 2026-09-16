"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  clearBackNavigation,
  markBackNavigation,
  peekBackNavigation,
  restoreScroll,
  saveScroll,
  scheduleRestore,
} from "@/lib/scrollMemory";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const pathRef = useRef(pathname);

  useEffect(() => {
    const onPop = () => markBackNavigation();
    window.addEventListener("popstate", onPop, { capture: true });
    return () => window.removeEventListener("popstate", onPop, { capture: true });
  }, []);

  useLayoutEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  useLayoutEffect(() => {
    return () => {
      saveScroll(pathRef.current, window.scrollY);
    };
  }, [pathname]);

  useEffect(() => {
    const path = pathname;
    const onScroll = () => saveScroll(path, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      saveScroll(path, window.scrollY);
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor || anchor.target === "_blank") return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }
      saveScroll(pathRef.current, window.scrollY);
      clearBackNavigation();
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  useLayoutEffect(() => {
    const path = window.location.pathname;

    if (peekBackNavigation()) {
      restoreScroll(path);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    const path = window.location.pathname;
    if (!peekBackNavigation()) return;

    scheduleRestore(path);
    const done = window.setTimeout(() => clearBackNavigation(), 1200);
    return () => window.clearTimeout(done);
  }, [pathname]);

  return null;
}
