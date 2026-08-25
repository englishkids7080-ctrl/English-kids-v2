import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CATEGORIES } from "../data/vocab";
import { Student } from "../lib/api";
import {
  ProgressSummary,
  claimCertificate,
  getSummary,
  studentKey,
} from "../lib/progress";
import { playClick, playLocked, playMagic, playUnlock } from "../lib/sound";

interface Props {
  student: Student | null;
  notify: (msg: string) => void;
}

type State =
  | { kind: "locked"; sum: ProgressSummary }
  | { kind: "ready"; sum: ProgressSummary }
  | { kind: "opening"; sum: ProgressSummary }
  | { kind: "claimed"; sum: ProgressSummary; cert: { name: string; date: string } };

function loadSummary(key: string): State {
  const sum = getSummary(key);
  if (sum.claimed && sum.cert) return { kind: "claimed", sum, cert: sum.cert };
  if (sum.allDone) return { kind: "ready", sum };
  return { kind: "locked", sum };
}

export default function Certificate({ student, notify }: Props) {
  const sKey = studentKey(student?.id ?? null);
  const [state, setState] = useState<State>(() => loadSummary(sKey));
  const [name, setName] = useState(student?.name ?? "");
  const [claiming, setClaiming] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Si cambia el estudiante activo, se recarga su progreso
  useEffect(() => {
    setState(loadSummary(sKey));
    setName(student?.name ?? "");
  }, [sKey, student]);

  const missing = state.sum.total - state.sum.doneCount;

  const onChest = () => {
    playClick();
    if (state.kind === "claimed") return; // ya se puede ver abajo
    if (state.kind === "locked") {
      playLocked();
      setShaking(true);
      window.setTimeout(() => setShaking(false), 500);
      notify(`¡Aún te faltan ${missing} ${missing === 1 ? "módulo" : "módulos"}! Sigue jugando 🦉`);
      return;
    }
    if (state.kind === "ready") {
      playUnlock();
      setState({ kind: "opening", sum: state.sum });
    }
  };

  const claim = () => {
    if (claiming) return;
    setClaiming(true);
    // Pequeña pausa para mostrar el estado "preparando"
    window.setTimeout(() => {
      const cert = claimCertificate(sKey, name);
      playMagic();
      confetti({
        particleCount: 220,
        spread: 110,
        origin: { y: 0.5 },
        colors: ["#ffc531", "#ff6b6b", "#4bc96b", "#59b9f2", "#ff8fc0", "#39a900"],
      });
      setState((prev) => ({
        kind: "claimed",
        sum: prev.sum,
        cert,
      }));
      notify(`¡Certificado de ${cert.name} creado! 🎓`);
      setClaiming(false);
    }, 900);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <h2 className="font-display font-extrabold text-3xl text-center">
        El Gran Certificado 🏆
      </h2>
      <p className="font-bold text-ink-soft text-center mt-1">
        Completa los {state.sum.total} módulos del quiz para desbloquearlo.
      </p>

      {/* ---------- el cofre ---------- */}
      <div className="flex flex-col items-center mt-8">
        <button
          onClick={onChest}
          className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 ${shaking ? "anim-shake" : ""}`}
          aria-label={
            state.kind === "locked"
              ? `Cofre bloqueado, te faltan ${missing} módulos`
              : state.kind === "opening"
              ? "Abriendo el cofre"
              : "Cofre del certificado"
          }
        >
          {/* resplandor cuando está listo */}
          {state.kind === "ready" && (
            <span
              className="absolute inset-0 rounded-[2rem] anim-bounce"
              style={{ boxShadow: "0 0 0 10px rgba(255,197,49,0.35), 0 0 40px rgba(255,197,49,0.8)" }}
              aria-hidden="true"
            />
          )}
          <span
            className="relative flex items-center justify-center w-40 h-36 rounded-[2rem] border-4 text-7xl"
            style={{
              borderColor: "#1e3a6e",
              background:
                state.kind === "locked"
                  ? "linear-gradient(180deg,#cdd8ea,#aebdda)"
                  : "linear-gradient(180deg,#ffd45e,#f5a623)",
              boxShadow: "0 8px 0 #1e3a6e",
            }}
            aria-hidden="true"
          >
            {state.kind === "locked" ? "🔒" : state.kind === "opening" ? "✨" : state.kind === "ready" ? "🔓" : "🎓"}
          </span>
          {/* candado dorado decorativo */}
          {state.kind === "locked" && (
            <span
              className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-12 h-9 rounded-lg border-[3px] border-ink bg-sun flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="w-3 h-3 rounded-full bg-ink" />
            </span>
          )}
        </button>

        {/* barra de progreso */}
        <div className="w-full max-w-md mt-8">
          <div className="flex justify-between font-display font-bold text-sm text-ink-soft">
            <span>Módulos superados</span>
            <span>
              {state.sum.doneCount} / {state.sum.total}
            </span>
          </div>
          <div className="h-6 rounded-full border-[3px] border-ink bg-white overflow-hidden mt-1.5">
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${(state.sum.doneCount / state.sum.total) * 100}%`,
                background: "repeating-linear-gradient(45deg,#4bc96b 0 12px,#5fd67d 12px 24px)",
              }}
            />
          </div>
          <ul className="flex flex-wrap gap-2 mt-3 justify-center">
            {CATEGORIES.map((c) => {
              const done = Boolean(state.sum.done[c.id]);
              return (
                <li
                  key={c.id}
                  className="font-display font-bold text-xs border-2 rounded-full px-2.5 py-1 flex items-center gap-1"
                  style={{
                    borderColor: "#1e3a6e",
                    background: done ? c.color : "#ffffff",
                    opacity: done ? 1 : 0.7,
                  }}
                >
                  <span aria-hidden="true">{c.emoji}</span>
                  {done ? c.nameEn : `${c.nameEn} · pendiente`}
                </li>
              );
            })}
          </ul>
        </div>

        {/* ---------- estados ---------- */}

        {state.kind === "locked" && (
          <div className="card-toy mt-7 px-6 py-5 text-center max-w-md">
            <p className="font-display font-extrabold text-xl">
              El cofre está cerrado con llave 🔐
            </p>
            <p className="font-bold text-ink-soft mt-1">
              {missing === 1
                ? "¡Solo te falta 1 módulo! Ve al quiz y supéralo."
                : `Te faltan ${missing} módulos. Cada quiz aprobado (4+ aciertos) abre un candado.`}
            </p>
          </div>
        )}

        {state.kind === "ready" && (
          <div className="card-toy mt-7 p-6 text-center max-w-md anim-pop" style={{ background: "#fffdf2", borderColor: "#f5a623", boxShadow: "0 6px 0 #f5a623" }}>
            <p className="font-display font-extrabold text-2xl">¡Cofre desbloqueado! 🎉</p>
            <p className="font-bold text-ink-soft mt-1">Toca el cofre para abrirlo.</p>
          </div>
        )}

        {state.kind === "opening" && (
          <div className="card-toy mt-7 p-6 text-center max-w-md anim-pop">
            <p className="font-display font-extrabold text-xl">
              ¡Escribe tu nombre para tu certificado!
            </p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={32}
              placeholder="Tu nombre completo"
              className="mt-4 w-full border-[3px] border-ink rounded-xl px-4 py-3 font-display font-bold text-xl text-center outline-none focus:border-leaf transition-colors bg-paper"
              aria-label="Nombre para el certificado"
            />
            <button
              onClick={claim}
              disabled={claiming || !name.trim()}
              className="btn-toy bg-sena text-white mt-4 px-8 py-3 text-lg"
            >
              {claiming ? (
                <>
                  <span className="inline-block animate-spin" aria-hidden="true">✨</span> Preparando tu diploma…
                </>
              ) : (
                "Reclamar mi certificado"
              )}
            </button>
          </div>
        )}

        {/* ---------- certificado ---------- */}
        {state.kind === "claimed" && (
          <div className="mt-8 print-area">
            <div
              className="card-toy anim-pop relative overflow-hidden"
              style={{ background: "#fffdf4", borderRadius: "1.6rem" }}
            >
              {/* esquinas decorativas */}
              <span className="absolute top-3 left-3 text-2xl" aria-hidden="true">⭐</span>
              <span className="absolute top-3 right-3 text-2xl" aria-hidden="true">⭐</span>
              <span className="absolute bottom-3 left-3 text-2xl" aria-hidden="true">🌟</span>
              <span className="absolute bottom-3 right-3 text-2xl" aria-hidden="true">🌟</span>

              <div className="m-4 border-4 border-dashed border-sun-deep rounded-3xl px-5 py-8 sm:px-10 text-center">
                <p className="font-display font-bold tracking-[0.3em] text-sena-deep text-sm">
                  ENGLISH KIDS · SENA
                </p>
                <h3 className="font-display font-extrabold text-4xl sm:text-5xl mt-2">
                  ¡Mini-Certificado!
                </h3>
                <p className="font-bold text-ink-soft mt-4">Este diploma reconoce que</p>
                <p className="font-display font-extrabold text-3xl sm:text-4xl text-sky-deep border-b-4 border-sun inline-block px-4 py-1 mt-2">
                  {state.cert.name}
                </p>
                <p className="font-bold text-ink-soft mt-4 max-w-md mx-auto leading-relaxed">
                  completó los <strong className="text-ink">{state.sum.total} módulos de inglés</strong>{" "}
                  (Animales, Colores, Números, Comida, Familia y Cuerpo) con mucho esfuerzo y alegría.
                  <br />
                  <span className="font-display font-extrabold text-lg text-coral">
                    ¡Eres una superestrella del inglés! 🌟
                  </span>
                </p>
                <div className="flex justify-center gap-8 sm:gap-16 mt-7">
                  <div>
                    <p className="font-display font-extrabold text-lg">{state.cert.date}</p>
                    <div className="border-t-[3px] border-ink/60 w-32 sm:w-40 mt-1" />
                    <p className="font-bold text-xs text-ink-soft mt-1">Fecha</p>
                  </div>
                  <div>
                    <p className="text-2xl" aria-hidden="true">🦉</p>
                    <div className="border-t-[3px] border-ink/60 w-32 sm:w-40 mt-1" />
                    <p className="font-bold text-xs text-ink-soft mt-1">Bubi, el búho profesor</p>
                  </div>
                </div>
                <p className="font-display font-bold text-xs text-ink-soft mt-6 tracking-widest">
                  ★ MÓDULOS COMPLETOS ★
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-5 flex-wrap print:hidden">
              <button
                onClick={() => {
                  playClick();
                  window.print();
                }}
                className="btn-toy bg-leaf text-white px-6 py-3 text-lg"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 8 V3 h12 v5 M6 17 H4 a2 2 0 0 1 -2 -2 v-5 a2 2 0 0 1 2 -2 h16 a2 2 0 0 1 2 2 v5 a2 2 0 0 1 -2 2 h-2 M6 14 h12 v7 H6 Z" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinejoin="round" />
                </svg>
                Imprimir diploma
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
