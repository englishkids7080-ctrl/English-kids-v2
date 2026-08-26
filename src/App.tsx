import { useCallback, useRef, useState } from "react";
import Background from "./components/Background";
import Mascot from "./components/Mascot";
import Home, { Mode } from "./views/Home";
import Flashcards from "./views/Flashcards";
import Quiz from "./views/Quiz";
import Memory from "./views/Memory";
import Certificate from "./views/Certificate";
import Project from "./views/Project";
import { CATEGORIES, Category } from "./data/vocab";
import { playClick } from "./lib/sound";

type View = "home" | "cards" | "quiz" | "memory" | "certificado" | "proyecto";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const go = (v: View) => {
    playClick();
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => go("home");

  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
          <div className="card-toy flex items-center gap-3 px-4 py-3 flex-wrap" style={{ borderRadius: "1.6rem" }}>
            <button onClick={goHome} className="flex items-center gap-2.5 cursor-pointer" aria-label="Ir al inicio">
              <Mascot size={52} className="anim-float" />
              <span className="font-display font-extrabold text-2xl sm:text-3xl leading-none">
                English<span className="text-coral">Kids</span>
              </span>
            </button>

            <nav className="flex items-center gap-2 ml-auto flex-wrap" aria-label="Navegación principal">
              <button
                onClick={goHome}
                className="btn-toy px-4 py-2 text-sm sm:text-base"
                style={{
                  background:
                    view === "home" || view === "cards" || view === "quiz" || view === "memory"
                      ? "#ffc531"
                      : "#ffffff",
                  color: "#1e3a6e",
                }}
                aria-current={
                  view === "home" || view === "cards" || view === "quiz" || view === "memory"
                    ? "page"
                    : undefined
                }
              >
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3.5 11 L12 3.5 L20.5 11 M6 10 v9.5 h12 V10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Jugar
              </button>
              <button
                onClick={() => go("certificado")}
                className="btn-toy px-4 py-2 text-sm sm:text-base"
                style={{
                  background: view === "certificado" ? "#ffc531" : "#ffffff",
                  color: "#1e3a6e",
                }}
                aria-current={view === "certificado" ? "page" : undefined}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 13.5 L7 21 l5 -2.5 L17 21 l-2 -7.5 M12 6.8 l.9 1.8 2 .3 -1.45 1.4 .35 2 -1.8 -.95 -1.8 .95 .35 -2 L9.1 8.9 l2 -.3 Z" fill="currentColor" stroke="none" />
                </svg>
                Diploma
              </button>
              <button
                onClick={() => go("proyecto")}
                className="btn-toy px-4 py-2 text-sm sm:text-base"
                style={{
                  background: view === "proyecto" ? "#39a900" : "#ffffff",
                  color: view === "proyecto" ? "#ffffff" : "#1e3a6e",
                }}
                aria-current={view === "proyecto" ? "page" : undefined}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4 L21 8.5 L12 13 L3 8.5 Z M6.5 10.5 v5 c 0 1.8 2.5 3.5 5.5 3.5 s5.5 -1.7 5.5 -3.5 v-5 M21 8.5 v6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Proyecto
              </button>
            </nav>
          </div>
        </header>

        <main className="pt-8 sm:pt-10">
          {view === "home" && (
            <Home
              category={category}
              onSelectCategory={setCategory}
              onPlay={(mode: Mode) => go(mode)}
              onOpenCertificate={() => go("certificado")}
            />
          )}
          {view === "cards" && <Flashcards category={category} onExit={goHome} />}
          {view === "quiz" && (
            <Quiz
              category={category}
              onExit={goHome}
              onGoCertificate={() => go("certificado")}
              notify={notify}
            />
          )}
          {view === "memory" && <Memory category={category} onExit={goHome} notify={notify} />}
          {view === "certificado" && <Certificate notify={notify} />}
          {view === "proyecto" && <Project notify={notify} />}
        </main>

        <footer className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 mt-4">
          <div className="text-center font-bold text-sm text-ink-soft bg-white/60 border-2 border-ink/15 rounded-2xl px-4 py-3">
            English Kids · <strong className="text-sena-deep">SENA</strong> 🇨🇴 · Ficha 3156695 ·
            Técnico en Sistemas Teleinformáticos · IE Gonzalo Rivera Laguado (Cúcuta) ·
            tu avance se guarda en este navegador 🌈
          </div>
        </footer>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 anim-pop" role="status">
          <div className="card-toy bg-ink text-white font-display font-bold px-6 py-3 flex items-center gap-2.5" style={{ boxShadow: "0 6px 0 rgba(10,22,48,0.9)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <circle cx="9" cy="9" r="8" fill="#4bc96b" stroke="#fff" strokeWidth="1.5" />
              <path d="M5 9.5 L8 12 L13 6.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
