import { useMemo } from "react";
import { CATEGORIES, Category } from "../data/vocab";
import { playClick } from "../lib/sound";
import { getSummary, studentKey } from "../lib/progress";

export type Mode = "cards" | "quiz" | "memory";

interface Props {
  category: Category;
  onSelectCategory: (c: Category) => void;
  onPlay: (mode: Mode) => void;
  studentName: string | null;
  studentId: string | null;
  onOpenCertificate: () => void;
}

const ACTIVITIES: { mode: Mode; title: string; desc: string; color: string; icon: JSX.Element }[] = [
  {
    mode: "cards",
    title: "Aprender",
    desc: "Tarjetas con dibujo, palabra y pronunciación",
    color: "#59b9f2",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="14" height="16" rx="2.5" fill="#fff" stroke="#1e3a6e" strokeWidth="2" />
        <path d="M7 3.5 h12.5 a1.5 1.5 0 0 1 1.5 1.5 V17" stroke="#1e3a6e" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 12 q 3 -3 6 0 q -3 3 -6 0 Z" fill="#ff6b6b" stroke="#1e3a6e" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    mode: "quiz",
    title: "Quiz",
    desc: "Escucha y elige la palabra correcta",
    color: "#ff6b6b",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" fill="#fff" stroke="#1e3a6e" strokeWidth="2" />
        <path d="M9.2 9.4 a2.8 2.8 0 1 1 4 3.8 c-.9.7 -1.2 1.2 -1.2 2.1" stroke="#1e3a6e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="12" cy="18.2" r="1.3" fill="#1e3a6e" />
      </svg>
    ),
  },
  {
    mode: "memory",
    title: "Memoria",
    desc: "Encuentra las parejas dibujo–palabra",
    color: "#4bc96b",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {[
          [3, 3], [12.5, 3], [3, 12.5], [12.5, 12.5],
        ].map(([x, y]) => (
          <rect key={`${x}${y}`} x={x} y={y} width="8.5" height="8.5" rx="2.2" fill="#fff" stroke="#1e3a6e" strokeWidth="2" />
        ))}
        <circle cx="7.2" cy="7.2" r="2" fill="#ffc531" stroke="#1e3a6e" strokeWidth="1.5" />
        <path d="M14.5 16.8 l2 2 l3.4 -3.8" stroke="#4bc96b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
  },
];

export default function Home({ category, onSelectCategory, onPlay, studentName, studentId, onOpenCertificate }: Props) {
  // Avance de módulos del estudiante (para el cofre del diploma)
  const cert = useMemo(() => getSummary(studentKey(studentId)), [studentId]);
  const ready = cert.allDone && !cert.claimed;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      {/* saludo */}
      <div className="flex items-end gap-4 flex-wrap">
        <h2 className="font-display font-extrabold leading-[1.02] text-[clamp(1.9rem,5vw,3.1rem)]">
          ¡Hola{studentName ? `, ${studentName}` : ""}!{" "}
          <span className="text-sky-deep">¿Jugamos en inglés?</span>
        </h2>
        <span className="font-display font-bold text-sm bg-sun border-[3px] border-ink rounded-full px-4 py-1.5 shadow-[0_4px_0_#1e3a6e] -rotate-2">
          6 temas · 58 palabras
        </span>
      </div>
      <p
        className="mt-3 inline-flex items-center gap-2 font-display font-bold text-xs sm:text-sm bg-sena text-white border-[3px] border-ink rounded-full px-4 py-1.5"
        style={{ boxShadow: "0 4px 0 rgba(30,58,110,0.9)" }}
      >
        <span aria-hidden="true">🇨🇴</span> Proyecto formativo SENA · Ficha 7080 · ADSO
      </p>

      {/* paso 1: tema */}
      <div className="mt-8">
        <p className="font-display font-bold text-lg flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-base">1</span>
          Elige un tema
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-4">
          {CATEGORIES.map((c) => {
            const active = c.id === category.id;
            const done = Boolean(cert.done[c.id]);
            return (
              <button
                key={c.id}
                onClick={() => {
                  playClick();
                  onSelectCategory(c);
                }}
                className={`tile-wobble card-toy relative flex flex-col items-center gap-1 px-3 py-4 transition-transform duration-150 ${
                  active ? "-translate-y-1.5" : "hover:-translate-y-1"
                }`}
                style={{
                  background: active ? c.color : "#ffffff",
                  boxShadow: active ? `0 8px 0 ${c.color}, 0 8px 0 3px #1e3a6e` : undefined,
                }}
                aria-pressed={active}
              >
                <span className="text-4xl leading-none" aria-hidden="true">{c.emoji}</span>
                <span className="font-display font-bold text-base leading-tight text-center">
                  {c.nameEn}
                </span>
                <span className={`text-xs font-bold ${active ? "text-ink/80" : "text-ink-soft"}`}>
                  {c.nameEs}
                </span>
                {done && (
                  <span
                    className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-leaf border-[3px] border-ink flex items-center justify-center"
                    title="Módulo superado"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M2 6.5 L4.8 9 L10 3.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
                {active && !done && (
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-coral border-[3px] border-ink flex items-center justify-center anim-pop">
                    <span className="w-2.5 h-2.5 rounded-full bg-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* paso 2: actividad */}
      <div className="mt-10">
        <p className="font-display font-bold text-lg flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-base">2</span>
          ¿Qué quieres hacer con{" "}
          <span className="inline-flex items-center gap-1.5 border-[3px] border-ink rounded-full px-3 py-0.5 text-base" style={{ background: category.color }}>
            <span aria-hidden="true">{category.emoji}</span> {category.nameEn}?
          </span>
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {ACTIVITIES.map((a, i) => (
            <button
              key={a.mode}
              onClick={() => {
                playClick();
                onPlay(a.mode);
              }}
              className="tile-wobble card-toy text-left px-5 py-5 hover:-translate-y-1.5 transition-transform duration-150 anim-pop"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border-[3px] border-ink"
                style={{ background: a.color }}
              >
                {a.icon}
              </span>
              <span className="block font-display font-extrabold text-2xl mt-3">{a.title}</span>
              <span className="block text-sm font-semibold text-ink-soft mt-1 leading-snug">{a.desc}</span>
              <span className="inline-flex items-center gap-1.5 font-display font-bold text-sm mt-3 text-sky-deep">
                Jugar
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8 h9 M8.5 3.5 L13 8 L8.5 12.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* paso 3: el gran diploma (módulos + cofre) */}
      <div className="mt-10">
        <p className="font-display font-bold text-lg flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-base">3</span>
          Tu gran diploma
        </p>
        <div
          className={`card-toy mt-4 p-5 sm:p-6 ${ready ? "tile-wobble" : ""}`}
          style={ready ? { background: "#fffdf2", borderColor: "#f5a623", boxShadow: "0 6px 0 #f5a623" } : undefined}
        >
          <div className="flex items-center gap-4 flex-wrap">
            {/* cofre */}
            <button
              onClick={() => {
                playClick();
                onOpenCertificate();
              }}
              className={`relative shrink-0 w-20 h-20 rounded-2xl border-[3px] border-ink flex items-center justify-center text-4xl cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
                cert.claimed
                  ? "bg-sun"
                  : cert.allDone
                  ? "bg-sun anim-bounce"
                  : "bg-[#dfe8f5]"
              }`}
              aria-label={
                cert.claimed
                  ? "Ver mi certificado"
                  : cert.allDone
                  ? "¡Abrir el cofre del certificado!"
                  : `Cofre bloqueado: te faltan ${cert.total - cert.doneCount} módulos`
              }
              title={cert.claimed ? "Ver mi certificado" : cert.allDone ? "¡Cofre desbloqueado!" : `Te faltan ${cert.total - cert.doneCount} módulos`}
            >
              <span aria-hidden="true">{cert.claimed ? "🎓" : cert.allDone ? "🔓" : "🔒"}</span>
              {ready && (
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-coral border-[3px] border-ink anim-bounce" />
              )}
            </button>

            <div className="flex-1 min-w-[220px]">
              <p className="font-display font-extrabold text-xl">
                {cert.claimed
                  ? `¡Diploma de ${cert.cert?.name ?? "campeón"} reclamado! 🎉`
                  : cert.allDone
                  ? "¡Todos los módulos completos! ¡Reclama tu certificado!"
                  : `Supera el quiz de cada tema: llevas ${cert.doneCount} de ${cert.total} módulos`}
              </p>
              {/* barra de avance */}
              <div className="mt-2 h-5 rounded-full border-[3px] border-ink bg-white overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(cert.doneCount / cert.total) * 100}%`,
                    background: "repeating-linear-gradient(45deg,#4bc96b 0 12px,#5fd67d 12px 24px)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* los 6 módulos */}
          <ul className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const done = Boolean(cert.done[c.id]);
              return (
                <li
                  key={c.id}
                  className="flex items-center gap-1.5 font-display font-bold text-sm border-[3px] rounded-full px-3 py-1"
                  style={{
                    borderColor: "#1e3a6e",
                    background: done ? c.color : "#ffffff",
                    opacity: done ? 1 : 0.75,
                  }}
                >
                  <span aria-hidden="true">{c.emoji}</span>
                  {c.nameEn}
                  {done && (
                    <svg width="13" height="13" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M2 6.5 L4.8 9 L10 3.5" fill="none" stroke="#1e3a6e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
