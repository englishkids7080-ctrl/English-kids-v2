import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Category, Word, shuffle } from "../data/vocab";
import { Student, addStudent, saveScore } from "../lib/api";
import { playAnimal, playCorrect, playWin, playWrong, speak } from "../lib/sound";
import {
  ProgressSummary,
  TOTAL_MODULES,
  getSummary,
  markModuleDone,
  studentKey,
} from "../lib/progress";
import Letters from "../components/Letters";

/* ---------- construcción de preguntas ---------- */

interface Question {
  word: Word;
  options: Word[];
}

const QUESTIONS = 8;
const MAX_HEARTS = 3;
const PASS_MARK = 4; // aciertos para aprobar el módulo

function buildQuestions(category: Category): Question[] {
  const words = shuffle(category.words).slice(0, Math.min(QUESTIONS, category.words.length));
  return words.map((word) => {
    const others = shuffle(category.words.filter((w) => w.en !== word.en)).slice(0, 3);
    return { word, options: shuffle([word, ...others]) };
  });
}

interface Props {
  category: Category;
  student: Student | null;
  onExit: () => void;
  onGoCertificate: () => void;
  onStudentCreated: (s: Student) => void;
  notify: (msg: string) => void;
}

type Phase = "name" | "play" | "result";

export default function Quiz({ category, student, onExit, onGoCertificate, onStudentCreated, notify }: Props) {
  const [phase, setPhase] = useState<Phase>(student ? "play" : "name");
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(category));
  const [qIdx, setQIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [sum, setSum] = useState<ProgressSummary | null>(null);
  const [allDone, setAllDone] = useState(false);
  const [saved, setSaved] = useState(false);

  const sKey = studentKey(student?.id ?? null);
  const isAnimals = category.id === "animals";
  const q = questions[qIdx];

  /* Pronuncia cada pregunta en inglés, con pausa y animal si aplica */
  useEffect(() => {
    if (phase !== "play" || !q) return;
    if (isAnimals) {
      playAnimal(q.word.en);
      const t = window.setTimeout(() => speak(q.word.en), 700);
      return () => window.clearTimeout(t);
    }
    speak(q.word.en);
  }, [qIdx, questions, phase, q, isAnimals]);

  /* Elige una opción y evalúa (con feedback amable) */
  const choose = (option: Word, index: number) => {
    if (picked !== null || finished) return;
    setPicked(index);
    const correct = option.en === q.word.en;
    const newCorrect = correct ? correctCount + 1 : correctCount;
    const newHearts = correct ? hearts : hearts - 1;
    if (correct) setCorrectCount(newCorrect);
    else setHearts(newHearts);

    // El sonido del animal va primero; la evaluación suena un poco después
    if (correct) {
      if (isAnimals) window.setTimeout(playCorrect, 500);
      else playCorrect();
    } else {
      if (isAnimals) window.setTimeout(playWrong, 500);
      else playWrong();
    }

    // Transición pausada para que alcance a leer (y escuchar) antes de avanzar
    window.setTimeout(() => {
      setPicked(null);
      if (newHearts <= 0 || qIdx + 1 >= questions.length) finish(newCorrect, qIdx + 1);
      else setQIdx((i) => i + 1);
    }, isAnimals ? 2000 : 1500);
  };

  /* Termina la ronda, guarda la puntuación y actualiza el progreso */
  const finish = (newCorrect: number, qTotal: number) => {
    const passed = newCorrect >= PASS_MARK;
    if (passed) markModuleDone(sKey, category.id); // el módulo queda superado
    const summary = getSummary(sKey);
    setSum(summary);
    setAllDone(summary.allDone && !summary.claimed);
    setFinished(true);

    if (passed) {
      playWin();
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#ffc531", "#ff6b6b", "#4bc96b", "#59b9f2", "#ff8fc0"],
      });
    }

    const st = student;
    if (st) {
      void saveScore({
        studentId: st.id,
        mode: "quiz",
        category: category.nameEn,
        correct: newCorrect,
        total: qTotal,
      }).then(() => setSaved(true));
    }
    if (passed) notify(`¡Módulo ${category.nameEn} superado!`);
  };

  /* Reinicia la ronda con preguntas nuevas */
  const reset = () => {
    setQuestions(buildQuestions(category));
    setQIdx(0);
    setCorrectCount(0);
    setHearts(MAX_HEARTS);
    setPicked(null);
    setFinished(false);
    setAllDone(false);
    setSaved(false);
  };

  /* Crea un perfil rápido para poder guardar la puntuación */
  const createProfile = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      notify("Escribe tu nombre para guardar tus puntos");
      return;
    }
    void (async () => {
      try {
        const s = await addStudent(trimmed, 0);
        onStudentCreated(s);
        setPhase("play");
        notify(`¡Hola, ${s.name}! Tus puntos quedarán guardados.`);
      } catch {
        notify("No se pudo crear el perfil, pero puedes jugar igual");
        setPhase("play");
      }
    })();
  };

  /* ---------- pantalla: nombre ---------- */
  if (phase === "name") {
    return (
      <div className="max-w-md mx-auto px-4 pb-16">
        <div className="card-toy p-7 text-center anim-pop">
          <p className="text-5xl" aria-hidden="true">✏️</p>
          <h2 className="font-display font-extrabold text-3xl mt-3">¿Cómo te llamas?</h2>
          <p className="font-bold text-ink-soft mt-1">Así guardamos tus puntos del quiz.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createProfile();
            }}
            className="mt-5 flex flex-col gap-3"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre…"
              maxLength={24}
              className="w-full border-[3px] border-ink rounded-2xl px-4 py-3 font-display font-bold text-xl text-center outline-none focus:border-leaf transition-colors bg-paper"
              aria-label="Tu nombre"
            />
            <button type="submit" className="btn-toy bg-leaf text-white text-xl px-6 py-3">
              ¡A jugar!
            </button>
          </form>
          <button
            onClick={() => setPhase("play")}
            className="mt-3 font-display font-bold text-ink-soft underline underline-offset-4 hover:text-ink cursor-pointer"
          >
            Jugar sin guardar puntos
          </button>
        </div>
      </div>
    );
  }

  /* ---------- pantalla: resultados ---------- */
  if (finished) {
    const passed = correctCount >= PASS_MARK;
    const stars = correctCount >= 7 ? 3 : correctCount >= PASS_MARK + 1 ? 2 : passed ? 1 : 0;
    return (
      <div className="max-w-lg mx-auto px-4 pb-16">
        <div className="card-toy p-8 text-center anim-pop" style={{ background: "#fffdf4" }}>
          <p className="text-6xl" aria-hidden="true">{passed ? "🎉" : "💪"}</p>
          <h2 className="font-display font-extrabold text-3xl mt-3">
            {passed ? "¡Módulo superado!" : "¡Casi lo logras!"}
          </h2>
          <p className="font-bold text-ink-soft mt-1">
            Acertaste <strong className="text-ink">{correctCount}</strong> de{" "}
            <strong className="text-ink">{questions.length}</strong>
            {saved && <span className="text-leaf font-extrabold"> · guardado ✓</span>}
          </p>

          {/* estrellitas */}
          <div className="flex justify-center gap-2 mt-4" aria-label={`${stars} de 3 estrellas`}>
            {[0, 1, 2].map((i) => (
              <svg key={i} width="44" height="44" viewBox="0 0 24 24" className={i < stars ? "anim-pop" : ""} style={{ animationDelay: `${i * 150}ms` }} aria-hidden="true">
                <path
                  d="M12 2.5 l2.7 5.6 6.1 .8 -4.5 4.3 1.1 6 -5.4 -2.9 -5.4 2.9 1.1 -6 -4.5 -4.3 6.1 -.8 Z"
                  fill={i < stars ? "#ffc531" : "#ffffff"}
                  stroke="#1e3a6e"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>

          {/* aviso de diploma desbloqueado */}
          {allDone && (
            <div className="mt-5 border-[3px] border-dashed border-sun-deep bg-sun/30 rounded-2xl p-4 anim-pop">
              <p className="font-display font-extrabold text-xl">
                ¡Completaste los {TOTAL_MODULES} módulos! 🏆
              </p>
              <p className="font-bold text-ink-soft text-sm mt-1">
                El cofre del certificado quedó desbloqueado.
              </p>
              <button onClick={onGoCertificate} className="btn-toy bg-sun text-ink mt-3 px-6 py-2.5">
                Reclamar mi certificado
              </button>
            </div>
          )}

          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <button onClick={reset} className="btn-toy bg-sky text-white px-6 py-3 text-lg">
              Jugar otra vez
            </button>
            <button onClick={onExit} className="btn-toy bg-white text-ink px-6 py-3 text-lg">
              Volver al inicio
            </button>
          </div>
          {sum && !sum.allDone && (
            <p className="font-bold text-sm text-ink-soft mt-4">
              Módulos superados: {sum.doneCount} de {sum.total} — ¡sigue así!
            </p>
          )}
        </div>
      </div>
    );
  }

  /* ---------- pantalla: juego ---------- */
  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      {/* barra superior: tema, corazones y progreso */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={onExit} className="btn-toy bg-white text-ink px-4 py-2 text-sm">
          Salir
        </button>
        <p className="font-display font-extrabold text-lg flex items-center gap-2">
          <span className="inline-flex w-9 h-9 items-center justify-center rounded-xl border-[3px] border-ink text-lg" style={{ background: category.color }} aria-hidden="true">
            {category.emoji}
          </span>
          {category.nameEn}
        </p>
        <div className="flex items-center gap-1" aria-label={`${hearts} corazones`}>
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <svg
              key={i}
              width="26"
              height="26"
              viewBox="0 0 24 24"
              className={i === hearts ? "" : ""}
              style={i >= hearts ? { filter: "grayscale(1) opacity(0.35)" } : undefined}
              aria-hidden="true"
            >
              <path
                d="M12 21 C 5 15 2 11 2 7.5 A 4.5 4.5 0 0 1 12 5 A 4.5 4.5 0 0 1 22 7.5 C 22 11 19 15 12 21 Z"
                fill="#ff6b6b"
                stroke="#1e3a6e"
                strokeWidth="2"
              />
            </svg>
          ))}
        </div>
      </div>

      {/* progreso de la ronda */}
      <div className="mt-4 h-4 rounded-full border-[3px] border-ink bg-white overflow-hidden">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${(qIdx / questions.length) * 100}%`,
            background: "repeating-linear-gradient(45deg,#ffc531 0 12px,#ffd45e 12px 24px)",
          }}
        />
      </div>
      <p className="font-display font-bold text-sm text-ink-soft mt-1.5 text-right">
        Pregunta {qIdx + 1} de {questions.length} · puntos: {correctCount}
      </p>

      {/* tarjeta de la pregunta */}
      <div className="card-toy mt-5 p-8 text-center" key={q.word.en}>
        <p className="font-display font-bold text-ink-soft">¿Qué palabra escuchaste?</p>
        <p className="text-7xl mt-2 anim-float" aria-hidden="true">{q.word.emoji}</p>
        <button
          onClick={() => speak(q.word.en)}
          className="btn-toy bg-sun text-ink mt-4 px-5 py-2.5"
          aria-label={`Escuchar de nuevo: ${q.word.en}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9 v6 h4 l5 4 V5 L8 9 Z" fill="#1e3a6e" />
            <path d="M16.5 8.5 a5 5 0 0 1 0 7 M19 6 a8.5 8.5 0 0 1 0 12" fill="none" stroke="#1e3a6e" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Escuchar de nuevo
        </button>
      </div>

      {/* opciones */}
      <div className="grid grid-cols-2 gap-3.5 mt-5">
        {q.options.map((opt, i) => {
          const isCorrect = opt.en === q.word.en;
          const isPicked = picked === i;
          const showResult = picked !== null;
          let bg = "#ffffff";
          let extra = "";
          if (showResult && isCorrect) {
            bg = "#4bc96b";
            extra = "anim-pop";
          } else if (showResult && isPicked && !isCorrect) {
            bg = "#ffd7d7";
            extra = "anim-shake";
          }
          return (
            <button
              key={opt.en}
              onClick={() => choose(opt, i)}
              disabled={picked !== null}
              className={`card-toy tile-wobble px-4 py-5 text-center cursor-pointer disabled:cursor-default ${extra}`}
              style={{ background: bg }}
            >
              {/* las letras crecen al pasar el cursor y se pintan al elegir */}
              <span className="font-display font-extrabold text-2xl block leading-tight">
                <Letters
                  word={opt.en}
                  grow
                  selected={isPicked && showResult}
                  color={showResult && isCorrect ? "#ffffff" : showResult && isPicked ? "#c0392b" : category.color}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
