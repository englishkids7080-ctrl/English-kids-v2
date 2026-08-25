import { useEffect, useState } from "react";
import { INSTITUTION } from "../data/project";
import { AVATARS } from "../data/vocab";

const LS_TEAM = "ek_team_names";
const TEAM_SIZE = 4;

function loadTeam(): string[] {
  try {
    const raw = localStorage.getItem(LS_TEAM);
    if (raw) {
      const arr = JSON.parse(raw) as string[];
      if (Array.isArray(arr)) {
        return arr
          .slice(0, TEAM_SIZE)
          .concat(Array(Math.max(0, TEAM_SIZE - arr.length)).fill(""));
      }
    }
  } catch {
    /* equipo por defecto */
  }
  return Array(TEAM_SIZE).fill("");
}

function SenaLogo({ size = 74 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Logo SENA">
      <rect x="2" y="2" width="96" height="96" rx="20" fill="#39a900" stroke="#1e3a6e" strokeWidth="3.5" />
      {/* figura: persona con brazos en alto (formación que crece) */}
      <circle cx="50" cy="30" r="11" fill="#ffffff" />
      <path d="M28 74 C 28 52 38 44 50 44 C 62 44 72 52 72 74 Z" fill="#ffffff" />
      <path
        d="M30 46 C 22 42 18 34 20 26 M70 46 C 78 42 82 34 80 26"
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect x="14" y="76" width="72" height="10" rx="5" fill="#ffc531" stroke="#1e3a6e" strokeWidth="3" />
    </svg>
  );
}

export default function Project({ notify }: { notify: (msg: string) => void }) {
  const [team, setTeam] = useState<string[]>(loadTeam);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = window.setTimeout(() => setSaved(false), 1600);
    return () => window.clearTimeout(t);
  }, [saved]);

  const setName = (i: number, value: string) => {
    const next = [...team];
    next[i] = value;
    setTeam(next);
    try {
      localStorage.setItem(LS_TEAM, JSON.stringify(next));
      setSaved(true);
    } catch {
      /* sin almacenamiento */
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      {/* ===== carátula institucional ===== */}
      <section className="card-toy overflow-hidden" style={{ borderRadius: "1.8rem" }}>
        <div className="h-4 w-full" style={{ background: "repeating-linear-gradient(45deg,#39a900 0 18px,#2b8000 18px 36px)" }} aria-hidden="true" />
        <div className="p-6 sm:p-9 grid gap-7 md:grid-cols-[auto_1fr_auto] md:items-center">
          <SenaLogo />
          <div>
            <p className="font-display font-extrabold text-xs sm:text-sm tracking-[0.22em] text-sena uppercase">
              Proyecto formativo · {INSTITUTION.nombreCompleto}
            </p>
            <h1 className="font-display font-extrabold leading-none mt-2" style={{ fontSize: "clamp(2.4rem,6vw,3.6rem)" }}>
              English<span className="text-coral">Kids</span>
            </h1>
            <p className="font-bold text-ink-soft mt-2 max-w-lg">
              Aplicación web interactiva para que los niños aprendan inglés jugando,
              desarrollada en el marco del programa{" "}
              <span className="text-ink">{INSTITUTION.programa}</span>.
            </p>
          </div>
          {/* sello de ficha */}
          <div className="justify-self-center md:justify-self-end -rotate-6">
            <div
              className="w-32 h-32 rounded-full border-4 border-dashed border-sena flex flex-col items-center justify-center text-center bg-white/70"
              aria-label={`Ficha ${INSTITUTION.ficha}`}
            >
              <span className="font-display font-extrabold text-[11px] tracking-[0.18em] text-sena uppercase">Ficha</span>
              <span className="font-display font-extrabold text-3xl text-sena-deep leading-none">{INSTITUTION.ficha}</span>
              <span className="font-bold text-[10px] text-ink-soft mt-1">ADSO · SENA</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== contenido ===== */}
      <div className="grid gap-5 mt-7 lg:grid-cols-2">
        {/* el proyecto */}
        <article className="card-toy p-6 bg-white">
          <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-sun border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">📘</span>
            El proyecto
          </h2>
          <p className="font-bold text-ink-soft leading-relaxed mt-3">{INSTITUTION.descripcion}</p>
        </article>

        {/* ficha técnica */}
        <article className="card-toy p-6 bg-white">
          <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-sky border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">📋</span>
            Ficha técnica
          </h2>
          <dl className="mt-3 divide-y-2 divide-dashed divide-ink/15">
            {INSTITUTION.fichaTecnica.map(([k, v]) => (
              <div key={k} className="py-2 flex items-baseline gap-3">
                <dt className="font-display font-bold text-sm text-ink-soft w-36 shrink-0">{k}</dt>
                <dd className="font-extrabold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </article>

        {/* objetivo general */}
        <article className="card-toy p-6" style={{ background: "#f0fbee", borderColor: "#2b8000", boxShadow: "0 6px 0 #2b8000" }}>
          <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5 text-sena-deep">
            <span className="w-9 h-9 rounded-xl bg-sena border-[3px] border-sena-deep flex items-center justify-center text-lg" aria-hidden="true">🎯</span>
            Objetivo general
          </h2>
          <p className="font-bold leading-relaxed mt-3 text-[#1d4a10]">{INSTITUTION.objetivoGeneral}</p>
        </article>

        {/* objetivos específicos */}
        <article className="card-toy p-6 bg-white">
          <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-leaf border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">✅</span>
            Objetivos específicos
          </h2>
          <ol className="mt-3 space-y-2.5">
            {INSTITUTION.objetivosEspecificos.map((o, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="font-display font-extrabold text-sm w-7 h-7 rounded-full bg-paper border-2 border-ink flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="font-bold text-ink-soft leading-snug">{o}</span>
              </li>
            ))}
          </ol>
        </article>
      </div>

      {/* ===== tecnologías ===== */}
      <section className="card-toy p-6 mt-5 bg-white">
        <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-grape border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">🛠️</span>
          Tecnologías del proyecto
        </h2>
        <ul className="flex flex-wrap gap-2.5 mt-4">
          {INSTITUTION.tecnologias.map((t, i) => (
            <li
              key={t}
              className="tile-wobble font-display font-bold text-sm sm:text-base border-[3px] border-ink rounded-full px-4 py-1.5 cursor-default"
              style={{ background: ["#ffe9b3", "#d4f1ff", "#e5fff0", "#f4e6ff"][i % 4] }}
            >
              {t}
            </li>
          ))}
        </ul>
        <p className="font-bold text-ink-soft text-sm mt-4">
          El frontend funciona sin servidor (modo demo en el navegador) y, al detectar la API,
          guarda alumnos y puntuaciones en <strong className="text-ink">MongoDB</strong> automáticamente.
        </p>
      </section>

      {/* ===== equipo ===== */}
      <section className="card-toy p-6 mt-5 bg-white">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="w-9 h-9 rounded-xl bg-candy border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">👥</span>
          <h2 className="font-display font-extrabold text-2xl">Equipo aprendiz</h2>
          {saved && (
            <span className="anim-pop font-display font-bold text-sm text-leaf border-2 border-leaf rounded-full px-3 py-0.5">
              ✓ guardado
            </span>
          )}
        </div>
        <p className="font-bold text-ink-soft text-sm mt-2">
          Escribe los nombres de los integrantes — quedan guardados en este equipo.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          {team.map((name, i) => (
            <label key={i} className="flex items-center gap-3 border-[3px] border-ink rounded-2xl bg-paper px-3 py-2.5 focus-within:border-leaf transition-colors">
              <span className="w-10 h-10 rounded-full border-[3px] border-ink flex items-center justify-center text-xl bg-white shrink-0" aria-hidden="true">
                {AVATARS[(i + 3) % AVATARS.length]}
              </span>
              <span className="flex flex-col w-full">
                <span className="font-display font-bold text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                  Integrante {i + 1}
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(i, e.target.value)}
                  placeholder="Nombre y apellido"
                  maxLength={40}
                  className="bg-transparent outline-none font-display font-extrabold text-lg text-ink placeholder:text-ink/30"
                  aria-label={`Nombre del integrante ${i + 1}`}
                />
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* ===== franja institucional ===== */}
      <div
        className="mt-7 rounded-2xl border-[3px] border-sena-deep px-5 py-4 flex items-center gap-4 flex-wrap justify-center text-center"
        style={{ background: "linear-gradient(90deg,#eaffdf,#f3ffe9)" }}
      >
        <SenaLogo size={40} />
        <p className="font-bold text-sena-deep">
          <strong className="font-display font-extrabold">{INSTITUTION.nombre}</strong> — {INSTITUTION.nombreCompleto} · {INSTITUTION.pais} 🇨🇴
          <br />
          <span className="text-sm text-[#3d6b2c]">{INSTITUTION.slogan}</span>
        </p>
      </div>

      <button
        onClick={() => notify("¡Gracias por visitar el proyecto formativo!")}
        className="btn-toy bg-sena text-white px-6 py-3 mt-6 mx-auto flex text-lg"
      >
        ¡Entendido, profesor! 🦉
      </button>
    </div>
  );
}
