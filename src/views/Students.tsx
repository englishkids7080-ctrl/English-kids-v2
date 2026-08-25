import { FormEvent, useEffect, useState } from "react";
import {
  DataSource,
  ScoreEntry,
  Student,
  addStudent,
  getSource,
  listScores,
  listStudents,
  onSourceChange,
  removeStudent,
} from "../lib/api";
import { avatarFor } from "../data/vocab";
import { playClick, playWrong } from "../lib/sound";

interface Props {
  active: Student | null;
  setActive: (s: Student | null) => void;
  notify: (msg: string) => void;
}

export default function Students({ active, setActive, notify }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [source, setSource] = useState<DataSource>(getSource());

  useEffect(() => onSourceChange(setSource), []);

  const load = async () => {
    setLoading(true);
    try {
      const [st, sc] = await Promise.all([listStudents(), listScores()]);
      setStudents(st);
      setScores(sc);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      notify("Escribe un nombre para crear el perfil");
      return;
    }
    setSaving(true);
    try {
      const s = await addStudent(trimmed, parseInt(age, 10) || 0);
      setStudents((prev) => [s, ...prev]);
      setActive(s);
      setName("");
      setAge("");
      notify(`¡Perfil de ${s.name} creado!`);
    } catch {
      notify("No se pudo crear el perfil, inténtalo de nuevo");
    } finally {
      setSaving(false);
    }
  };

  const del = async (s: Student) => {
    playWrong();
    await removeStudent(s.id);
    setStudents((prev) => prev.filter((x) => x.id !== s.id));
    setScores((prev) => prev.filter((x) => x.studentId !== s.id));
    if (active?.id === s.id) setActive(null);
    setConfirmId(null);
    notify(`Perfil de ${s.name} eliminado`);
  };

  const bestBy = (id: string): ScoreEntry | undefined =>
    scores
      .filter((s) => s.studentId === id && s.total > 0)
      .sort((a, b) => b.correct / b.total - a.correct / a.total)[0];

  const studentScores = active
    ? scores.filter((s) => s.studentId === active.id)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="font-display font-extrabold text-3xl">Alumnos</h2>
        {/* indicador del origen de los datos */}
        <span
          className="inline-flex items-center gap-1.5 font-display font-bold text-xs border-[3px] border-ink rounded-full px-3 py-1"
          style={{
            background: source === "cloud" ? "#4bc96b" : source === "local" ? "#ffc531" : "#ffffff",
            color: "#1e3a6e",
          }}
          title={
            source === "cloud"
              ? "Guardando en MongoDB (API de Vercel)"
              : "Modo demo: los datos viven en este navegador"
          }
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white anim-bounce" aria-hidden="true" />
          {source === "cloud" ? "MongoDB en la nube" : source === "local" ? "Modo demo (este navegador)" : "Comprobando…"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6 mt-6">
        {/* crear + lista */}
        <div>
          <form onSubmit={submit} className="card-toy p-5">
            <p className="font-display font-extrabold text-xl">Nuevo estudiante</p>
            <label className="block mt-3">
              <span className="font-display font-bold text-sm text-ink-soft">Nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={28}
                placeholder="Ej: Sofía"
                className="mt-1 w-full border-[3px] border-ink rounded-xl px-3 py-2 font-bold outline-none focus:border-leaf transition-colors bg-paper"
              />
            </label>
            <label className="block mt-2">
              <span className="font-display font-bold text-sm text-ink-soft">Edad (opcional)</span>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 2))}
                inputMode="numeric"
                placeholder="Ej: 8"
                className="mt-1 w-full border-[3px] border-ink rounded-xl px-3 py-2 font-bold outline-none focus:border-leaf transition-colors bg-paper"
              />
            </label>
            <button type="submit" disabled={saving} className="btn-toy bg-leaf text-white w-full mt-4 px-5 py-2.5 text-lg">
              {saving ? "Guardando…" : "Crear perfil"}
            </button>
          </form>

          <div className="mt-5">
            {loading ? (
              <div className="card-toy p-6 text-center font-display font-bold text-ink-soft">
                <span className="inline-block animate-spin" aria-hidden="true">🌀</span> Cargando estudiantes…
              </div>
            ) : students.length === 0 ? (
              <div className="card-toy p-6 text-center font-bold text-ink-soft">
                Aún no hay estudiantes. ¡Crea el primero! 🐣
              </div>
            ) : (
              <ul className="space-y-3">
                {students.map((s, i) => {
                  const best = bestBy(s.id);
                  const isActive = active?.id === s.id;
                  return (
                    <li key={s.id} className="card-toy p-4 anim-pop" style={{ animationDelay: `${i * 60}ms` }}>
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-11 rounded-full border-[3px] border-ink flex items-center justify-center text-2xl bg-paper shrink-0" aria-hidden="true">
                          {avatarFor(i)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-extrabold text-lg leading-tight truncate">{s.name}</p>
                          <p className="text-xs font-bold text-ink-soft">
                            {s.age ? `${s.age} años · ` : ""}
                            {best
                              ? `mejor puntaje: ${best.correct}/${best.total} en ${best.category}`
                              : "sin puntajes aún"}
                          </p>
                        </div>
                        {isActive && (
                          <span className="font-display font-bold text-[11px] bg-leaf text-white border-2 border-ink rounded-full px-2.5 py-0.5 shrink-0">
                            jugando
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {!isActive ? (
                          <button
                            onClick={() => {
                              playClick();
                              setActive(s);
                              notify(`Ahora juega ${s.name}`);
                            }}
                            className="btn-toy bg-sun text-ink text-sm px-4 py-1.5"
                          >
                            Seleccionar
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              playClick();
                              setActive(null);
                            }}
                            className="btn-toy bg-white text-ink text-sm px-4 py-1.5"
                          >
                            Quitar selección
                          </button>
                        )}
                        {confirmId === s.id ? (
                          <>
                            <button onClick={() => void del(s)} className="btn-toy bg-coral text-white text-sm px-4 py-1.5">
                              Sí, borrar
                            </button>
                            <button onClick={() => setConfirmId(null)} className="btn-toy bg-white text-ink text-sm px-4 py-1.5">
                              No
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              playWrong();
                              setConfirmId(s.id);
                            }}
                            className="btn-toy bg-white text-coral text-sm px-4 py-1.5"
                          >
                            Borrar
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* historial del activo */}
        <div className="card-toy p-5 self-start">
          <p className="font-display font-extrabold text-xl flex items-center gap-2">
            Historial{" "}
            {active ? (
              <span className="text-sky-deep">de {active.name}</span>
            ) : (
              <span className="text-ink-soft text-base font-bold">(selecciona un estudiante)</span>
            )}
          </p>

          {!active ? (
            <p className="font-bold text-ink-soft mt-3">
              Elige un estudiante de la lista para ver sus partidas. 📚
            </p>
          ) : studentScores.length === 0 ? (
            <p className="font-bold text-ink-soft mt-3">
              {active.name} todavía no tiene partidas guardadas. ¡A jugar! 🚀
            </p>
          ) : (
            <table className="w-full mt-4 text-left">
              <thead>
                <tr className="font-display font-bold text-sm text-ink-soft border-b-[3px] border-ink/20">
                  <th className="py-2 pr-2">Modo</th>
                  <th className="py-2 pr-2">Tema</th>
                  <th className="py-2 pr-2">Puntos</th>
                  <th className="py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {studentScores.slice(0, 12).map((s) => (
                  <tr key={s.id} className="border-b-2 border-dashed border-ink/15">
                    <td className="py-2.5 pr-2">
                      <span
                        className="font-display font-bold text-xs border-2 border-ink rounded-full px-2.5 py-0.5"
                        style={{ background: s.mode === "quiz" ? "#ffd7d7" : "#d7f5de" }}
                      >
                        {s.mode === "quiz" ? "Quiz" : "Memoria"}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 font-bold">{s.category}</td>
                    <td className="py-2.5 pr-2 font-display font-extrabold">
                      {s.correct}/{s.total}
                    </td>
                    <td className="py-2.5 text-sm font-bold text-ink-soft">
                      {new Date(s.date).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
