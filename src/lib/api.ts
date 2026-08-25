/**
 * ============================================================
 *  CAPA DE DATOS — English Kids
 *  Intenta la API (Vercel + MongoDB). Si no hay backend,
 *  funciona igual guardando todo en el navegador (modo demo).
 * ============================================================
 */

export interface Student {
  id: string;
  name: string;
  age: number;
  createdAt: string;
}

export interface ScoreEntry {
  id: string;
  studentId: string;
  mode: "quiz" | "memory";
  category: string;
  correct: number;
  total: number;
  date: string;
}

export type DataSource = "checking" | "cloud" | "local";

const LS_STUDENTS = "ek_students";
const LS_SCORES = "ek_scores";

let source: DataSource = "checking";
const listeners = new Set<(s: DataSource) => void>();

export function onSourceChange(fn: (s: DataSource) => void): () => void {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

export function getSource(): DataSource {
  return source;
}

function setSource(s: DataSource) {
  source = s;
  listeners.forEach((fn) => fn(s));
}

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}

/* ---------- almacenamiento local (modo demo / sin backend) ---------- */

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento no disponible */
  }
}

/* ---------- acceso a la API (Vercel + MongoDB) con respaldo local ---------- */

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 3500);
  try {
    const res = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    window.clearTimeout(timer);
  }
}

/** Comprueba una sola vez si hay backend disponible. */
export async function checkCloud(): Promise<void> {
  try {
    await apiFetch<{ ok: boolean }>("/api/health");
    setSource("cloud");
  } catch {
    setSource("local");
  }
}

export async function listStudents(): Promise<Student[]> {
  try {
    const data = await apiFetch<{ students: Student[] }>("/api/students");
    return data.students;
  } catch {
    return readLocal<Student[]>(LS_STUDENTS, []);
  }
}

export async function addStudent(name: string, age: number): Promise<Student> {
  const student: Student = { id: uid(), name, age, createdAt: new Date().toISOString() };
  try {
    const data = await apiFetch<{ student: Student }>("/api/students", {
      method: "POST",
      body: JSON.stringify({ name, age }),
    });
    return data.student;
  } catch {
    const all = readLocal<Student[]>(LS_STUDENTS, []);
    writeLocal(LS_STUDENTS, [student, ...all]);
    return student;
  }
}

export async function removeStudent(id: string): Promise<void> {
  try {
    await apiFetch(`/api/students?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    const all = readLocal<Student[]>(LS_STUDENTS, []);
    writeLocal(LS_STUDENTS, all.filter((s) => s.id !== id));
    const scores = readLocal<ScoreEntry[]>(LS_SCORES, []);
    writeLocal(LS_SCORES, scores.filter((s) => s.studentId !== id));
  }
}

export async function listScores(studentId?: string): Promise<ScoreEntry[]> {
  try {
    const path = studentId
      ? `/api/scores?studentId=${encodeURIComponent(studentId)}`
      : "/api/scores";
    const data = await apiFetch<{ scores: ScoreEntry[] }>(path);
    return data.scores;
  } catch {
    const all = readLocal<ScoreEntry[]>(LS_SCORES, []);
    return studentId ? all.filter((s) => s.studentId === studentId) : all;
  }
}

export async function saveScore(
  entry: Omit<ScoreEntry, "id" | "date">
): Promise<ScoreEntry> {
  const full: ScoreEntry = { ...entry, id: uid(), date: new Date().toISOString() };
  try {
    const data = await apiFetch<{ score: ScoreEntry }>("/api/scores", {
      method: "POST",
      body: JSON.stringify(entry),
    });
    return data.score;
  } catch {
    const all = readLocal<ScoreEntry[]>(LS_SCORES, []);
    writeLocal(LS_SCORES, [full, ...all]);
    return full;
  }
}
