import { useState } from "react";
import confetti from "canvas-confetti";
import { CATEGORIES } from "../data/vocab";
import {
  ProgressSummary,
  claimCertificate,
  getSummary,
  resetProgress,
} from "../lib/store";
import { playClick, playLocked, playMagic, playUnlock } from "../lib/sound";

interface Props {
  notify: (msg: string) => void;
}

export default function Certificate({ notify }: Props) {
  const [sum, setSum] = useState<ProgressSummary>(getSummary);
  const [opening, setOpening] = useState(false); // cofre abierto, esperando nombre
  const [name, setName] = useState("");
  const [claiming, setClaiming] = useState(false); // preparando el diploma…
  const [shaking, setShaking] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const missing = sum.total - sum.doneCount;
  const chest: "locked" | "ready" | "opening" | "claimed" = sum.claimed
    ? "claimed"
    : opening
    ? "opening"
    : sum.allDone
    ? "ready"
    : "locked";

  const onChest = () => {
    playClick();
    if (chest === "claimed") return; // el diploma ya se ve abajo
    if (chest === "locked") {
      playLocked();
      setShaking(true);
      window.setTimeout(() => setShaking(false), 500);
      notify(`¡Aún te faltan ${missing} ${missing === 1 ? "módulo" : "módulos"}! Sigue jugando 🦉`);
      return;
    }
    if (chest === "ready") {
      playUnlock();
      setOpening(true);
    }
  };

  const claim = () => {
    if (claiming) return;
    setClaiming(true);
    // Pequeña pausa para mostrar el estado "preparando"
    window.setTimeout(() => {
      const cert = claimCertificate(name);
      playMagic();
      confetti({
        particleCount: 220,
        spread: 110,
        origin: { y: 0.5 },
        colors: ["#ffc531", "#ff6b6b", "#4bc96b", "#59b9f2", "#ff8fc0", "#39a900"],
      });
      setSum(getSummary());
      setOpening(false);
      setClaiming(false);
      notify(`¡Certificado de ${cert.name} creado! 🎓`);
    }, 900);
  };

  /** Borrado seguro en dos toques (sin ventanas bloqueantes). */
  const onReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      window.setTimeout(() => setConfirmReset(false), 2600);
      return;
    }
    resetProgress();
    setSum(getSummary());
    setConfirmReset(false);
    setOpening(false);
    setName("");
    notify("Progreso borrado. ¡A empezar de nuevo! 🌱");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-16">
      <h2 className="font-display font-extrabold text-3xl text-center">
        El Gran Certificado 🏆
      </h2>
      <p className="font-bold text-ink-soft text-center mt-1">
        Completa los {sum.total} módulos del quiz para desbloquearlo.
        <span className="block text-xs mt-0.5">Todo se guarda en la caché de este navegador.</span>
      </p>

      {/* ---------- el cofre ---------- */}
      <div className="flex flex-col items-center mt-8">
        <button
          onClick={onChest}
          className={`relative cursor-pointer transition-transform hover:scale-105 active:scale-95 ${shaking ? "anim-shake" : ""}`}
          aria-label={
            chest === "locked"
              ? `Cofre bloqueado, te faltan ${missing} módulos`
              : chest === "opening"
              ? "Abriendo el cofre"
              : "Cofre del certificado"
          }
        >
          {chest === "ready" && (
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
                chest === "locked"
                  ? "linear-gradient(180deg,#cdd8ea,#aebdda)"
                  : "linear-gradient(180deg,#ffd45e,#f5a623)",
              boxShadow: "0 8px 0 #1e3a6e",
            }}
            aria-hidden="true"
          >
            {chest === "locked" ? "🔒" : chest === "opening" ? "✨" : chest === "ready" ? "🔓" : "🎓"}
          </span>
          {chest === "locked" && (
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
              {sum.doneCount} / {sum.total}
            </span>
          </div>
          <div className="h-6 rounded-full border-[3px] border-ink bg-white overflow-hidden mt-1.5">
            <div
              className="h-full transition-all duration-700"
              style={{
                width: `${(sum.doneCount / sum.total) * 100}%`,
                background: "repeating-linear-gradient(45deg,#4bc96b 0 12px,#5fd67d 12px 24px)",
              }}
            />
          </div>
          <ul className="flex flex-wrap gap-2 mt-3 justify-center">
            {CATEGORIES.map((c) => {
              const done = Boolean(sum.modules[c.id]);
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

        {chest === "locked" && (
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

        {chest === "ready" && (
          <div className="card-toy mt-7 p-6 text-center max-w-md anim-pop" style={{ background: "#fffdf2", borderColor: "#f5a623", boxShadow: "0 6px 0 #f5a623" }}>
            <p className="font-display font-extrabold text-2xl">¡Cofre desbloqueado! 🎉</p>
            <p className="font-bold text-ink-soft mt-1">Toca el cofre para abrirlo.</p>
          </div>
        )}

        {chest === "opening" && (
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
        {chest === "claimed" && sum.cert && (
          <div className="mt-8 w-full print-area">
            <div
              className="card-toy anim-pop relative overflow-hidden"
              style={{ background: "#fffdf4", borderRadius: "1.6rem" }}
            >
              <span className="absolute top-3 left-3 text-2xl" aria-hidden="true">⭐</span>
              <span className="absolute top-3 right-3 text-2xl" aria-hidden="true">⭐</span>
              <span className="absolute bottom-3 left-3 text-2xl" aria-hidden="true">🌟</span>
              <span className="absolute bottom-3 right-3 text-2xl" aria-hidden="true">🌟</span>

              <div className="m-4 border-4 border-dashed border-sun-deep rounded-3xl px-5 py-8 sm:px-10 text-center">
                <p className="font-display font-bold tracking-[0.3em] text-sky-deep text-sm">
                  ENGLISH KIDS
                </p>
                <h3 className="font-display font-extrabold text-4xl sm:text-5xl mt-2">
                  ¡Mini-Certificado!
                </h3>
                <p className="font-bold text-ink-soft mt-4">Este diploma reconoce que</p>
                <p className="font-display font-extrabold text-3xl sm:text-4xl text-sky-deep border-b-4 border-sun inline-block px-4 py-1 mt-2">
                  {sum.cert.name}
                </p>
                <p className="font-bold text-ink-soft mt-4 max-w-md mx-auto leading-relaxed">
                  completó los <strong className="text-ink">{sum.total} módulos de inglés</strong>{" "}
                  (Animales, Colores, Números, Comida, Familia y Cuerpo) con mucho esfuerzo y alegría.
                  <br />
                  <span className="font-display font-extrabold text-lg text-coral">
                    ¡Eres una superestrella del inglés! 🌟
                  </span>
                </p>
                <div className="flex justify-center gap-8 sm:gap-16 mt-7">
                  <div>
                    <p className="font-display font-extrabold text-lg">{sum.cert.date}</p>
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
              <button
                onClick={onReset}
                className="btn-toy bg-white text-coral px-5 py-3 text-base"
              >
                {confirmReset ? "¿Seguro? Toca otra vez para borrar" : "Borrar progreso"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
