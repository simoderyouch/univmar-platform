const PREFIX = "univmar:scroll:";
const BACK_KEY = "univmar:back";

const memory = new Map<string, number>();

export function markBackNavigation(): void {
  try {
    sessionStorage.setItem(BACK_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearBackNavigation(): void {
  try {
    sessionStorage.removeItem(BACK_KEY);
  } catch {
    /* ignore */
  }
}

export function consumeBackNavigation(): boolean {
  try {
    const isBack = sessionStorage.getItem(BACK_KEY) === "1";
    if (isBack) sessionStorage.removeItem(BACK_KEY);
    return isBack;
  } catch {
    return false;
  }
}

export function peekBackNavigation(): boolean {
  try {
    return sessionStorage.getItem(BACK_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveScroll(path: string, y: number): void {
  const value = Math.max(0, Math.round(y));
  memory.set(path, value);
  try {
    sessionStorage.setItem(`${PREFIX}${path}`, String(value));
  } catch {
    /* Brave private / strict shields */
  }
}

export function readScroll(path: string): number | null {
  if (memory.has(path)) return memory.get(path)!;

  try {
    const stored = sessionStorage.getItem(`${PREFIX}${path}`);
    if (stored === null) return null;
    const y = Number(stored);
    if (!Number.isFinite(y)) return null;
    memory.set(path, y);
    return y;
  } catch {
    return memory.get(path) ?? null;
  }
}

export function restoreScroll(path: string): void {
  const y = readScroll(path);
  if (y === null || y <= 0) return;

  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  window.scrollTo({ top: Math.min(y, maxY), left: 0, behavior: "instant" });
}

export function scheduleRestore(path: string): void {
  restoreScroll(path);
  for (const ms of [16, 50, 120, 300, 600, 1000]) {
    window.setTimeout(() => restoreScroll(path), ms);
  }
}
