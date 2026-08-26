/**
 * ============================================================
 *  ALMACENAMIENTO LOCAL — English Kids
 *  Todo el avance vive en la caché del navegador (localStorage):
 *  módulos superados, mejores estrellas, historial y certificado.
 *  Sin cuentas ni servidores: cada equipo guarda su propio avance
 *  y continúa donde quedó, incluso sin internet.
 * ============================================================
 */

import { CATEGORIES } from "../data/vocab";

export interface ScoreRecord {
  id: string;
  mode: "quiz" | "memory";
  /** id de la categoría (para buscarla en CATEGORIES) */
  category: string;
  correct: number;
  total: number;
  date: string; // ISO
}

export interface CertificateData {
  name: string;
  date: string; // fecha legible
}

export interface StoreData {
  v: number;
  /** id de categoría -> fecha ISO en que se aprobó el módulo */
  modules: Record<string, string>;
  /** id de categoría -> mejores estrellas (0 a 5) */
  best: Record<string, number>;
  cert: CertificateData | null;
  /** partidas más recientes primero (con tope para no crecer sin límite) */
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
export const PASS_SCORE = 4; // aciertos mínimos para aprobar un módulo

let cache: StoreData | null = null;

function emptyState(): StoreData {
  return { v: 1, modules: {}, best: {}, cert: null, history: [] };
}

/** Carga el estado: una sola lectura real al disco; el resto desde memoria. */
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
    /* almacenamiento lleno o bloqueado: la app sigue funcionando en memoria */
  }
}

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

/** Estrellas según los aciertos (de 0 a 5). */
export function starsFor(correct: number, total: number): number {
  if (correct <= 0) return 0;
  const r = correct / Math.max(1, total);
  if (r >= 1) return 5;
  if (r >= 0.8) return 4;
  if (r >= 0.6) return 3;
  if (r >= 0.4) return 2;
  return 1;
}

/** Mejores estrellas conseguidas en un tema (0 si aún no se juega). */
export function getBest(categoryId: string): number {
  return getState().best[categoryId] ?? 0;
}

/** Registra una partida: actualiza estrellas, historial y recorta el tope. */
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

/** Resumen de progreso listo para la interfaz. */
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

/** Marca un módulo como aprobado (solo la primera vez). */
export function markModuleDone(categoryId: string): ProgressSummary {
  const s = getState();
  if (!s.modules[categoryId]) {
    s.modules[categoryId] = new Date().toISOString();
    persist();
  }
  return getSummary();
}

/** Reclama y sella el certificado con nombre y fecha de hoy. */
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

/** Borra todo el progreso guardado en este navegador. */
export function resetProgress(): void {
  cache = emptyState();
  persist();
}
