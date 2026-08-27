import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Category, Word, shuffle } from "../data/vocab";
import Letters from "../components/Letters";
import { getSummary, markModuleDone, recordScore, starsFor, PASS_SCORE } from "../lib/store";
import { playAnimal, playCorrect, playFlip, playWin, playWrong, speak } from "../lib/sound";

const QUESTION_COUNT = 8;

interface Question {
  word: Word;
  options: Word[];
}

interface Props {
  category: Category;
  onExit: () => void;
  onGoCertificate: () => void;
  notify: (msg: string) => void;
}

function buildQuestions(category: Category): Question[] {
  const words = shuffle(category.words).slice(0, Math.min(QUESTION_COUNT, category.words.length));
  return words.map((word) => {
    const others = shuffle(category.words.filter((w) => w.en !== word.en)).slice(0, 3);
    return { word, options: shuffle([word, ...others]) };
  });
}

function Heart({ filled, lost }: { filled: boolean; lost: boolean }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" className={lost ? "anim-shake" : ""}>
      <path
        d="M12 21 C 5 15 2 11.5 2 7.8 C 2 5 4.2 3 6.8 3 C 8.8 3 10.8 4.2 12 6 C 13.2 4.2 15.2 3 17.2 3 C 19.8 3 22 5 22 7.8 C 22 11.5 19 15 12 21 Z"
        fill={filled ? "#ff6b6b" : "#e7edf7"}
        stroke="#1e3a6e"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function Quiz({ category, onExit, onGoCertificate, notify }: Props) {
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(category));
  const [qIdx, setQIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<string | null>(null); // opción elegida (en)
  const [finished, setFinished] = useState(false);
  const [allDone, setAllDone] = useState(false); // acaba de completar todo el curso

  const q = questions[qIdx];
  const isAnimals = category.id === "animals";

  useEffect(() => {
    speak(q.word.en);
    if (isAnimals) playAnimal(q.word.en);
  }, [qIdx, questions, isAnimals]);

  const restart = () => {
    playFlip();
    setQuestions(buildQuestions(category));
    setQIdx(0);
    setHearts(3);
    setCorrectCount(0);
    setPicked(null);
    setFinished(false);
    setAllDone(false);
  };

  const finish = (correct: number, answered: number) => {
    recordScore({ mode: "quiz", category: category.id, correct, total: answered });
    const before = getSummary();
    const passed = correct >= PASS_SCORE;
    if (passed) markModuleDone(category.id);
    const after = getSummary();
    if (passed) {
      playWin();
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#ffc531", "#ff6b6b", "#4bc96b", "#59b9f2", "#ff8fc0"],
      });
    }
    if (!before.allDone && after.allDone && !after.claimed) {
      setAllDone(true);
      notify("¡Completaste todos los módulos! Tu certificado te espera 🏆");
    }
    setFinished(true);
  };

  const pick = (option: Word) => {
    if (picked !== null) return;
    setPicked(option.en);
    const ok = option.en === q.word.en;
    const newCorrect = correctCount + (ok ? 1 : 0);
    setCorrectCount(newCorrect);
    const newHearts = ok ? hearts : hearts - 1;
    if (!ok) setHearts(newHearts);

    if (ok) {
      if (isAnimals) playAnimal(q.word.en);
      else playCorrect();
      window.setTimeout(() => speak(q.word.en), isAnimals ? 650 : 250);
    } else {
      playWrong();
      window.setTimeout(() => speak(q.word.en), 450); // escucha la respuesta correcta
    }

    window.setTimeout(() => {
      setPicked(null);
      if (newHearts <= 0 || qIdx + 1 >= questions.length) finish(newCorrect, qIdx + 1);
      else setQIdx((i) => i + 1);
    }, isAnimals ? 2000 : 1500);
  };

  if (finished) {
    const stars = starsFor(correctCount, questions.length);
    const passed = correctCount >= PASS_SCORE;
    return (
      <div className="max-w-xl mx-auto px-4 pb-16">
        <div className="card-toy p-8 text-center anim-pop" style={{ background: "#fffdf4" }}>
          <p className="text-6xl" aria-hidden="true">{passed ? "🏆" : "💪"}</p>
          <h2 className="font-display font-extrabold text-3xl mt-2">
            {passed ? `¡Módulo ${category.nameEn} superado!` : "¡Casi lo logras!"}
          </h2>

          <div className="flex justify-center gap-1.5 mt-3" aria-label={`${stars} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <svg key={n} width="34" height="34" viewBox="0 0 24 24" className="anim-pop" style={{ animationDelay: `${n * 120}ms` }} aria-hidden="true">
                <path
                  d="M12 2.5 l2.9 5.9 6.5 .9 -4.7 4.6 1.1 6.5 -5.8 -3 -5.8 3 1.1 -6.5 L2.6 9.3 l6.5 -.9 Z"
                  fill={n <= stars ? "#ffc531" : "#ffffff"}
                  stroke="#1e3a6e"
                  strokeWidth="1.6"
                />
              </svg>
            ))}
          </div>

          <p className="font-extrabold text-xl mt-2">
            Acertaste {correctCount} de {questions.length}
          </p>
          <p className="font-bold text-ink-soft mt-1">
            {passed
              ? "Bubi está orgullosísimo de ti · guardado en este equipo ✓"
              : `Necesitas ${PASS_SCORE} aciertos para aprobar el módulo. ¡Otra vez, tú puedes!`}
          </p>

          {allDone && (
            <div className="mt-4 border-[3px] border-dashed border-sun-deep rounded-2xl bg-sun/20 px-4 py-3 anim-pop">
              <p className="font-display font-extrabold text-lg">
                🎉 ¡Completaste los 6 módulos! Tu cofre ya está desbloqueado.
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <button onClick={restart} className="btn-toy bg-sky text-white px-6 py-3 text-lg">
              Otra vez
            </button>
            <button onClick={onExit} className="btn-toy bg-white text-ink px-6 py-3 text-lg">
              Elegir otro tema
            </button>
            {allDone && (
              <button onClick={onGoCertificate} className="btn-toy bg-sun text-ink px-6 py-3 text-lg">
                ¡Ir por mi certificado! 🏆
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={onExit} className="btn-toy bg-white text-ink px-4 py-2 text-sm">
          Salir
        </button>
        <p className="font-display font-extrabold text-lg flex items-center gap-2">
          Quiz de{" "}
          <span className="inline-flex w-9 h-9 items-center justify-center rounded-xl border-[3px] border-ink text-lg" style={{ background: category.color }} aria-hidden="true">
            {category.emoji}
          </span>
        </p>
        <div className="flex gap-1" aria-label={`${hearts} corazones`}>
          {[0, 1, 2].map((i) => (
            <Heart key={i} filled={i < hearts} lost={i === hearts && picked !== null && picked !== q.word.en} />
          ))}
        </div>
      </div>

      <div className="h-5 rounded-full border-[3px] border-ink bg-white overflow-hidden mt-5">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${(qIdx / questions.length) * 100}%`,
            background: "repeating-linear-gradient(45deg,#ffc531 0 12px,#ffd45e 12px 24px)",
          }}
        />
      </div>

      <div className="card-toy mt-5 p-6 text-center">
        <p className="font-display font-bold text-lg text-ink-soft">Escucha y elige la palabra correcta</p>
        <div className="text-[5.5rem] leading-none mt-2" aria-hidden="true">{q.word.emoji}</div>
        <button
          onClick={() => {
            playFlip();
            speak(q.word.en);
            if (isAnimals) window.setTimeout(() => playAnimal(q.word.en), 350);
          }}
          className="btn-toy bg-sky text-white mt-3 px-5 py-2 text-base"
          aria-label="Escuchar de nuevo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9 v6 h4 l5 4 V5 L8 9 Z" fill="#ffffff" />
            <path d="M16.5 8.5 a5 5 0 0 1 0 7 M19 6 a8.5 8.5 0 0 1 0 12" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Escuchar otra vez
        </button>
        <p className="font-bold text-sm text-ink-soft mt-3">
          Pregunta {qIdx + 1} de {questions.length} · {correctCount} aciertos
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 mt-5">
        {q.options.map((opt) => {
          const isPicked = picked === opt.en;
          const isCorrect = picked !== null && opt.en === q.word.en;
          const isWrongPick = isPicked && opt.en !== q.word.en;
          let bg = "#ffffff";
          if (picked !== null) {
            if (isCorrect) bg = "#b8f2c6";
            else if (isWrongPick) bg = "#ffd6d6";
          }
          return (
            <button
              key={opt.en}
              onClick={() => pick(opt)}
              disabled={picked !== null}
              className={`card-toy py-5 px-3 font-display font-extrabold text-2xl leading-tight transition-transform ${
                picked === null ? "hover:-translate-y-1 active:translate-y-1" : ""
              } ${isWrongPick ? "anim-shake" : ""}`}
              style={{
                background: bg,
                cursor: picked === null ? "pointer" : "default",
                borderColor: isCorrect ? "#2c7a41" : isWrongPick ? "#c0392b" : "#1e3a6e",
                boxShadow: isCorrect
                  ? "0 6px 0 #2c7a41"
                  : isWrongPick
                  ? "0 6px 0 #c0392b"
                  : undefined,
              }}
              aria-label={opt.en}
            >
              <Letters
                word={opt.en}
                grow
                selected={isPicked}
                color={category.color}
                animateIn={picked === null}
              />
            </button>
          );
        })}
      </div>

      <div className="h-8 mt-4 text-center font-display font-extrabold text-xl" aria-live="polite">
        {picked !== null &&
          (picked === q.word.en ? (
            <span className="text-leaf anim-pop inline-block">¡Muy bien! 🎉</span>
          ) : (
            <span className="text-coral anim-pop inline-block">
              Uy… era “{q.word.en}” 💙
            </span>
          ))}
      </div>
    </div>
  );
}
