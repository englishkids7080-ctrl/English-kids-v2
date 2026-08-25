import { CATEGORIES, Category } from "../data/vocab";
import { playClick } from "../lib/sound";
import { getBest, getState, getSummary, starsFor } from "../lib/store";

export type Mode = "cards" | "quiz" | "memory";

interface Props {
  category: Category;
  onSelectCategory: (c: Category) => void;
  onPlay: (mode: Mode) => void;
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

export default function Home({ category, onSelectCategory, onPlay, onOpenCertificate }: Props) {
  // Avance guardado en la caché de este navegador
  const cert = getSummary();
  const history = getState().history.slice(0, 4);
  const byId = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      {/* saludo */}
      <div className="flex items-end gap-4 flex-wrap">
        <h2 className="font-display font-extrabold leading-[1.02] text-[clamp(1.9rem,5vw,3.1rem)]">
          ¡Hola! <span className="text-sky-deep">¿Jugamos en inglés?</span>
        </h2>
        <span className="font-display font-bold text-sm bg-sun border-[3px] border-ink rounded-full px-4 py-1.5 shadow-[0_4px_0_#1e3a6e] -rotate-2">
          6 temas · 58 palabras
        </span>
        <p
          className="inline-flex items-center gap-2 font-display font-bold text-xs sm:text-sm bg-sena text-white border-[3px] border-ink rounded-full px-4 py-1.5"
          style={{ boxShadow: "0 4px 0 rgba(30,58,110,0.9)" }}
        >
          <span aria-hidden="true">🇨🇴</span> Proyecto formativo SENA · Ficha 7080 · ADSO
        </p>
      </div>

      {/* paso 1: tema */}
      <div className="mt-8">
        <p className="font-display font-bold text-lg flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-base">1</span>
          Elige un tema
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-4">
          {CATEGORIES.map((c) => {
            const active = c.id === category.id;
            const best = getBest(c.id);
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
                {/* mejores estrellas conseguidas en este tema */}
                <span
                  className="text-[11px] leading-none tracking-tight mt-0.5"
                  aria-label={best > 0 ? `Mejor puntaje: ${best} de 5 estrellas` : "Sin puntaje aún"}
                  title={best > 0 ? `Mejor: ${best} ★` : "Juega el quiz para ganar estrellas"}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={n <= best ? "text-sun-deep" : "text-ink/20"}>★</span>
                  ))}
                </span>
                {cert.modules[c.id] && (
                  <span className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-leaf border-[3px] border-ink flex items-center justify-center anim-pop" title="Módulo superado">
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M2 6.5 L4.8 9 L10 3.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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

      {/* paso 3: el gran diploma */}
      <div className="mt-10">
        <p className="font-display font-bold text-lg flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-base">3</span>
          El Gran Diploma
        </p>
        <div
          className={`card-toy mt-4 px-6 py-6 grid md:grid-cols-[auto_1fr_auto] gap-5 items-center ${
            cert.allDone ? "anim-pop" : ""
          }`}
          style={{
            background: cert.allDone ? "#fff6d9" : "#ffffff",
            borderColor: cert.allDone ? "#f5a623" : "#1e3a6e",
            boxShadow: cert.allDone ? "0 6px 0 #f5a623" : undefined,
          }}
        >
          <span className="text-6xl anim-float justify-self-center" aria-hidden="true">
            {cert.allDone ? "🔓" : "🔒"}
          </span>
          <div>
            <p className="font-display font-extrabold text-xl">
              {cert.allDone ? "¡Cofre desbloqueado!" : "Completa los 6 módulos"}
            </p>
            <p className="text-sm font-bold text-ink-soft mt-0.5">
              {cert.allDone
                ? cert.claimed
                  ? `Certificado de ${cert.cert?.name} creado. ¡Puedes verlo e imprimirlo cuando quieras!`
                  : "Ya puedes reclamar tu mini-certificado con tu nombre."
                : "Supera el quiz de cada tema (4+ aciertos) para abrir el cofre del certificado."}
            </p>
            <div className="flex gap-2 mt-3 flex-wrap" aria-label={`${cert.doneCount} de ${cert.total} módulos`}>
              {CATEGORIES.map((c) => {
                const done = Boolean(cert.modules[c.id]);
                return (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 font-display font-bold text-xs border-2 border-ink rounded-full px-2.5 py-1"
                    style={{ background: done ? c.color : "#f2f6ff", opacity: done ? 1 : 0.75 }}
                  >
                    <span aria-hidden="true">{c.emoji}</span>
                    {done ? "✓" : "·"}
                  </span>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => {
              playClick();
              onOpenCertificate();
            }}
            className="btn-toy px-6 py-3 text-lg justify-self-center"
            style={{
              background: cert.allDone ? "#ffc531" : "#ffffff",
              color: "#1e3a6e",
            }}
          >
            {cert.allDone ? (cert.claimed ? "Ver mi diploma" : "¡Reclamar diploma!") : "Ver diploma"}
          </button>
        </div>
      </div>

      {/* últimas partidas (guardadas en este navegador) */}
      <div className="mt-10">
        <p className="font-display font-bold text-lg flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white text-base">🕹️</span>
          Tus últimas partidas
          <span className="font-body font-bold text-xs text-ink-soft">(guardadas en este navegador)</span>
        </p>
        {history.length === 0 ? (
          <p className="card-toy mt-4 px-5 py-4 font-bold text-ink-soft">
            Aún no hay partidas registradas… ¡juega tu primer quiz y aparecerán aquí! 🚀
          </p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3 mt-4">
            {history.map((h) => {
              const cat = byId[h.category];
              return (
                <li key={h.id} className="card-toy px-4 py-3 flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">{cat?.emoji ?? "🎲"}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display font-extrabold">
                      {h.mode === "quiz" ? "Quiz" : "Memoria"} · {cat?.nameEn ?? h.category}
                    </span>
                    <span className="block text-sm font-bold text-ink-soft truncate">
                      {h.mode === "quiz"
                        ? `${h.correct}/${h.total} aciertos · ${"★".repeat(starsFor(h.correct, h.total)) || "sin estrellas"}`
                        : `${h.correct} parejas en ${h.total} intentos`}
                      {" · "}
                      {new Date(h.date).toLocaleDateString("es-CO", { day: "2-digit", month: "short" })}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
