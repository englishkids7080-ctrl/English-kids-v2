/**
 * ============================================================
 *  PROGRESO DE MÓDULOS — English Kids
 *  Cada tema superado en el quiz cuenta como "módulo aprobado".
 *  Al completar los 6 módulos se desbloquea el certificado.
 *  (Persistencia local; en la nube ya se guardan las puntuaciones.)
 * ============================================================
 */

import { CATEGORIES } from "../data/vocab";

export interface ModuleProgress {
  /** categoryId -> fecha ISO en que se aprobó el módulo */
  done: Record<string, string>;
  /** Certificado ya reclamado (nombre + fecha legible) */
  cert: { name: string; date: string } | null;
}

export interface ProgressSummary {
  done: Record<string, string>;
  doneCount: number;
  total: number;
  allDone: boolean;
  claimed: boolean;
  cert: { name: string; date: string } | null;
}

const KEY = "ek_progress_v1";
export const TOTAL_MODULES = CATEGORIES.length;

/** Clave del estudiante (o "invitado" si aún no hay perfil). */
export function studentKey(studentId: string | null): string {
  return studentId ?? "invitado";
}

/** Lee todo el progreso guardado en el navegador. */
function readAll(): Record<string, ModuleProgress> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, ModuleProgress>) : {};
  } catch {
    return {};
  }
}

function writeAll(all: Record<string, ModuleProgress>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* sin almacenamiento: el progreso vive solo en memoria */
  }
}

/** Progreso de un estudiante en concreto. */
export function getProgress(key: string): ModuleProgress {
  const all = readAll();
  return all[key] ?? { done: {}, cert: null };
}

/** Resumen listo para la interfaz. */
export function getSummary(key: string): ProgressSummary {
  const p = getProgress(key);
  const doneCount = CATEGORIES.filter((c) => p.done[c.id]).length;
  return {
    done: p.done,
    doneCount,
    total: TOTAL_MODULES,
    allDone: doneCount >= TOTAL_MODULES,
    claimed: Boolean(p.cert),
    cert: p.cert,
  };
}

/** Marca un módulo como aprobado (solo si aún no lo estaba). */
export function markModuleDone(key: string, categoryId: string): ProgressSummary {
  const all = readAll();
  const p = all[key] ?? { done: {}, cert: null };
  if (!p.done[categoryId]) {
    p.done[categoryId] = new Date().toISOString();
    all[key] = p;
    writeAll(all);
  }
  return getSummary(key);
}

/** Reclama y sella el certificado con nombre y fecha de hoy. */
export function claimCertificate(key: string, name: string): { name: string; date: string } {
  const all = readAll();
  const p = all[key] ?? { done: {}, cert: null };
  const cert = {
    name: name.trim() || "Gran Estudiante",
    date: new Date().toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
  p.cert = cert;
  all[key] = p;
  writeAll(all);
  return cert;
}
