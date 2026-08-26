import { INSTITUTION } from "../data/project";
import { AVATARS } from "../data/vocab";

/** Logo institucional SENA (interpretación decorativa en SVG). */
function SenaLogo({ size = 74 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Logo SENA">
      <rect x="2" y="2" width="96" height="96" rx="20" fill="#39a900" stroke="#1e3a6e" strokeWidth="3.5" />
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
  return (
    <div className="max-w-5xl mx-auto px-4 pb-16">
      {/* ================= carátula institucional ================= */}
      <section className="card-toy overflow-hidden" style={{ borderRadius: "1.8rem" }}>
        <div
          className="h-4 w-full"
          style={{ background: "repeating-linear-gradient(45deg,#39a900 0 18px,#2b8000 18px 36px)" }}
          aria-hidden="true"
        />
        <div className="p-6 sm:p-9">
          <div className="grid gap-7 md:grid-cols-[auto_1fr_auto] md:items-center">
            <SenaLogo />
            <div>
              <p className="font-display font-extrabold text-xs sm:text-sm tracking-[0.18em] text-sena uppercase">
                {INSTITUTION.estrategia}
              </p>
              <h1 className="font-display font-extrabold leading-none mt-2" style={{ fontSize: "clamp(2.4rem,6vw,3.6rem)" }}>
                English<span className="text-coral">Kids</span>
              </h1>
              <p className="font-bold text-ink-soft mt-2 max-w-lg">{INSTITUTION.subtitulo}</p>
              <p className="font-bold text-sm text-ink mt-2">
                {INSTITUTION.institucionEducativa} · {INSTITUTION.ciudad}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {[INSTITUTION.programa, `Código ${INSTITUTION.codigoPrograma}`, `Vigencia ${INSTITUTION.vigencia}`].map((chip) => (
                  <span
                    key={chip}
                    className="font-display font-bold text-xs border-2 border-ink rounded-full px-3 py-1 bg-paper"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            {/* sello de ficha */}
            <div className="justify-self-center md:justify-self-end -rotate-6">
              <div
                className="w-36 h-36 rounded-full border-4 border-dashed border-sena flex flex-col items-center justify-center text-center bg-white/70"
                aria-label={`Ficha ${INSTITUTION.ficha}`}
              >
                <span className="font-display font-extrabold text-[11px] tracking-[0.18em] text-sena uppercase">Ficha</span>
                <span className="font-display font-extrabold text-[26px] text-sena-deep leading-tight">{INSTITUTION.ficha}</span>
                <span className="font-bold text-[10px] text-ink-soft mt-1">SENA · 2025–2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* franja de cifras clave */}
        <div className="border-t-[3px] border-ink bg-ink text-white px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {INSTITUTION.cifras.map((c) => (
            <div key={c.label} className="text-center md:text-left">
              <p className="font-display font-extrabold text-2xl text-sun leading-none">{c.valor}</p>
              <p className="font-bold text-[11px] text-white/80 mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= problema y solución ================= */}
      <div className="grid gap-5 mt-7 lg:grid-cols-2">
        <article className="card-toy p-6" style={{ background: "#fff3f0", borderColor: "#c0392b", boxShadow: "0 6px 0 #c0392b" }}>
          <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5 text-[#a02c1f]">
            <span className="w-9 h-9 rounded-xl bg-coral border-[3px] border-[#a02c1f] flex items-center justify-center text-lg" aria-hidden="true">⚠️</span>
            Problema identificado
          </h2>
          <p className="font-bold text-[#7a2b22] leading-relaxed mt-3">{INSTITUTION.problema}</p>
        </article>

        <article className="card-toy p-6 bg-white">
          <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-sky border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">💡</span>
            Nuestra solución
          </h2>
          <p className="font-bold text-ink-soft leading-relaxed mt-3">{INSTITUTION.solucion}</p>
        </article>
      </div>

      {/* ================= objetivos ================= */}
      <div className="grid gap-5 mt-5 lg:grid-cols-5">
        <article
          className="card-toy p-6 lg:col-span-2"
          style={{ background: "#f0fbee", borderColor: "#2b8000", boxShadow: "0 6px 0 #2b8000" }}
        >
          <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5 text-sena-deep">
            <span className="w-9 h-9 rounded-xl bg-sena border-[3px] border-sena-deep flex items-center justify-center text-lg" aria-hidden="true">🎯</span>
            Objetivo general
          </h2>
          <p className="font-bold leading-relaxed mt-3 text-[#1d4a10]">{INSTITUTION.objetivoGeneral}</p>
        </article>

        <article className="card-toy p-6 bg-white lg:col-span-3">
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

      {/* ================= beneficios ================= */}
      <section className="card-toy p-6 mt-5 bg-white">
        <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-sun border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">🌟</span>
          Beneficios que aporta
        </h2>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mt-4">
          {INSTITUTION.beneficios.map((b) => (
            <li key={b} className="flex gap-2.5 items-start font-bold text-ink-soft leading-snug">
              <svg width="20" height="20" viewBox="0 0 20 20" className="shrink-0 mt-0.5" aria-hidden="true">
                <circle cx="10" cy="10" r="9" fill="#4bc96b" stroke="#1e3a6e" strokeWidth="2" />
                <path d="M5.5 10.5 L8.5 13.5 L14.5 7" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* ================= equipo ================= */}
      <section className="card-toy p-6 mt-5 bg-white">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="w-9 h-9 rounded-xl bg-candy border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">👥</span>
          <h2 className="font-display font-extrabold text-2xl">Equipo de proyecto</h2>
        </div>
        <p className="font-bold text-ink-soft text-sm mt-2">
          Aprendices del programa {INSTITUTION.programa}.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          {INSTITUTION.integrantes.map((name, i) => (
            <div
              key={name}
              className="tile-wobble flex items-center gap-3 border-[3px] border-ink rounded-2xl bg-paper px-3 py-2.5"
            >
              <span className="w-10 h-10 rounded-full border-[3px] border-ink flex items-center justify-center text-xl bg-white shrink-0" aria-hidden="true">
                {AVATARS[(i + 3) % AVATARS.length]}
              </span>
              <span className="flex flex-col w-full min-w-0">
                <span className="font-display font-bold text-[10px] uppercase tracking-[0.16em] text-ink-soft">
                  Integrante {i + 1}
                </span>
                <span className="font-display font-extrabold text-base text-ink truncate">{name}</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= impacto ================= */}
      <section className="mt-7">
        <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5 px-1">
          <span className="w-9 h-9 rounded-xl bg-grape border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">🌍</span>
          Impacto del proyecto
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {INSTITUTION.impactos.map((im) => (
            <article
              key={im.id}
              className="card-toy p-5 tile-wobble"
              style={{ background: `${im.color}26`, borderColor: "#1e3a6e" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-11 h-11 rounded-xl border-[3px] border-ink flex items-center justify-center text-xl"
                  style={{ background: im.color }}
                  aria-hidden="true"
                >
                  {im.emoji}
                </span>
                <h3 className="font-display font-extrabold text-xl">Impacto {im.titulo.toLowerCase()}</h3>
              </div>
              <p className="font-bold text-ink-soft text-sm leading-relaxed mt-2.5">{im.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ================= ficha técnica ================= */}
      <section className="card-toy p-6 mt-5 bg-white">
        <h2 className="font-display font-extrabold text-2xl flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-sun border-[3px] border-ink flex items-center justify-center text-lg" aria-hidden="true">📋</span>
          Ficha técnica
        </h2>
        <dl className="mt-3 divide-y-2 divide-dashed divide-ink/15">
          {INSTITUTION.fichaTecnica.map(([k, v]) => (
            <div key={k} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <dt className="font-display font-bold text-sm text-ink-soft sm:w-48 shrink-0">{k}</dt>
              <dd className="font-extrabold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ================= franja institucional ================= */}
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
