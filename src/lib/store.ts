import { CATEGORIES } from "../data/vocab";

export interface ScoreRecord {
  id: string;
  mode: "quiz" | "memory";
  category: string;
  correct: number;
  total: number;
  date: string;
}

export interface CertificateData {
  name: string;
  date: string;
}

export interface StoreData {
  v: number;
  modules: Record<string, string>;
  best: Record<string, number>;
  cert: CertificateData | null;
  history: ScoreRecord[];
}

export interface ProgressSummary {
  modules: Record<string, string>;
  doneCount: number;
  total: number;
  allDone: boolean;
  claimed: boolean;
  cert: CertificateData | null;
}

const KEY = "englishkids_v1";
const HISTORY_LIMIT = 30;
export const PASS_SCORE = 4;

let cache: StoreData | null = null;

function emptyState(): StoreData {
  return { v: 1, modules: {}, best: {}, cert: null, history: [] };
}

export function getState(): StoreData {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...emptyState(), ...(JSON.parse(raw) as Partial<StoreData>) } : emptyState();
  } catch {
    cache = emptyState();
  }
  return cache;
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    return;
  }
}

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

export function starsFor(correct: number, total: number): number {
  if (correct <= 0) return 0;
  const r = correct / Math.max(1, total);
  if (r >= 1) return 5;
  if (r >= 0.8) return 4;
  if (r >= 0.6) return 3;
  if (r >= 0.4) return 2;
  return 1;
}

export function getBest(categoryId: string): number {
  return getState().best[categoryId] ?? 0;
}

export function recordScore(entry: Omit<ScoreRecord, "id" | "date">): ScoreRecord {
  const s = getState();
  const rec: ScoreRecord = { ...entry, id: uid(), date: new Date().toISOString() };
  s.history = [rec, ...s.history].slice(0, HISTORY_LIMIT);
  if (entry.mode === "quiz") {
    const stars = starsFor(entry.correct, entry.total);
    s.best[entry.category] = Math.max(s.best[entry.category] ?? 0, stars);
  }
  persist();
  return rec;
}

export function getSummary(): ProgressSummary {
  const s = getState();
  const doneCount = CATEGORIES.filter((c) => s.modules[c.id]).length;
  return {
    modules: s.modules,
    doneCount,
    total: CATEGORIES.length,
    allDone: doneCount >= CATEGORIES.length,
    claimed: Boolean(s.cert),
    cert: s.cert,
  };
}

export function markModuleDone(categoryId: string): ProgressSummary {
  const s = getState();
  if (!s.modules[categoryId]) {
    s.modules[categoryId] = new Date().toISOString();
    persist();
  }
  return getSummary();
}

export function claimCertificate(name: string): CertificateData {
  const s = getState();
  const cert: CertificateData = {
    name: name.trim() || "Gran Estudiante",
    date: new Date().toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
  s.cert = cert;
  persist();
  return cert;
}

export function resetProgress(): void {
  cache = emptyState();
  persist();
}
