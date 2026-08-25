import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Category, shuffle } from "../data/vocab";
import { Student, saveScore } from "../lib/api";
import { playCorrect, playFlip, playWin, playWrong } from "../lib/sound";

interface CardDef {
  key: string;
  wordEn: string;
  type: "emoji" | "word";
  label: string;
}

interface Props {
  category: Category;
  student: Student | null;
  onExit: () => void;
  notify: (msg: string) => void;
}

const PAIRS = 6;

function buildDeck(category: Category): CardDef[] {
  const words = shuffle(category.words).slice(0, Math.min(PAIRS, category.words.length));
  const cards: CardDef[] = [];
  words.forEach((w) => {
    cards.push({ key: `${w.en}-e`, wordEn: w.en, type: "emoji", label: w.emoji });
    cards.push({ key: `${w.en}-w`, wordEn: w.en, type: "word", label: w.en });
  });
  return shuffle(cards);
}

function formatTime(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function Memory({ category, student, onExit, notify }: Props) {
  const [deck, setDeck] = useState<CardDef[]>(() => buildDeck(category));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [won, setWon] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lock, setLock] = useState(false);

  const totalPairs = useMemo(
    () => deck.filter((c) => c.type === "emoji").length,
    [deck]
  );

  useEffect(() => {
    if (won) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [won]);

  useEffect(() => {
    if (matched.size === totalPairs && totalPairs > 0 && !won) {
      setWon(true);
      playWin();
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#ffc531", "#ff6b6b", "#4bc96b", "#59b9f2", "#ff8fc0"],
      });
      if (student) {
        void saveScore({
          studentId: student.id,
          mode: "memory",
          category: category.nameEn,
          correct: totalPairs,
          total: moves,
        }).then(() => {
          setSaved(true);
          notify("¡Memoria guardada en tu perfil!");
        });
      }
    }
  }, [matched, totalPairs, won, student, category.nameEn, moves, notify]);

  const flipCard = (index: number) => {
    if (lock || won) return;
    if (flipped.includes(index) || matched.has(deck[index].wordEn)) return;
    playFlip();
    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].wordEn === deck[b].wordEn) {
        playCorrect();
        setMatched((prev) => new Set(prev).add(deck[a].wordEn));
        setFlipped([]);
      } else {
        setLock(true);
        window.setTimeout(() => {
          playWrong();
          setFlipped([]);
          setLock(false);
        }, 850);
      }
    }
  };

  const reset = () => {
    playFlip();
    setDeck(buildDeck(category));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setSeconds(0);
    setWon(false);
    setSaved(false);
  };

  const isUp = (i: number) => flipped.includes(i) || matched.has(deck[i].wordEn);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      {/* cabecera */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={onExit} className="btn-toy bg-white text-ink px-4 py-2 text-sm">
          Salir
        </button>
        <p className="font-display font-extrabold text-xl flex items-center gap-2">
          Memoria de{" "}
          <span className="inline-flex w-9 h-9 items-center justify-center rounded-xl border-[3px] border-ink text-lg" style={{ background: category.color }} aria-hidden="true">
            {category.emoji}
          </span>
        </p>
        <button onClick={reset} className="btn-toy bg-sun text-ink px-4 py-2 text-sm">
          Reiniciar
        </button>
      </div>

      {/* marcadores */}
      <div className="flex gap-3 mt-5 flex-wrap">
        {[
          { label: "Parejas", value: `${matched.size}/${totalPairs}` },
          { label: "Intentos", value: String(moves) },
          { label: "Tiempo", value: formatTime(seconds) },
        ].map((s) => (
          <div key={s.label} className="card-toy px-4 py-2 flex-1 min-w-[110px] text-center">
            <p className="font-display font-bold text-xs uppercase tracking-wide text-ink-soft">{s.label}</p>
            <p className="font-display font-extrabold text-2xl leading-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* tablero */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-6">
        {deck.map((card, i) => {
          const up = isUp(i);
          const done = matched.has(card.wordEn);
          return (
            <div key={card.key} className="flip-scene aspect-[3/4]">
              <div
                className={`flip-inner ${up ? "flipped" : ""}`}
                onClick={() => flipCard(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && flipCard(i)}
                aria-label={up ? (card.type === "emoji" ? card.wordEn : card.label) : "Carta oculta"}
              >
                {/* dorso */}
                <div className="flip-face card-toy cursor-pointer flex items-center justify-center" style={{ background: "repeating-linear-gradient(45deg,#59b9f2 0 14px,#4aa8e4 14px 28px)" }}>
                  <span className="font-display font-extrabold text-4xl text-white" style={{ textShadow: "2px 3px 0 #1e3a6e" }} aria-hidden="true">?</span>
                </div>
                {/* cara */}
                <div
                  className={`flip-face flip-back card-toy flex items-center justify-center p-2 ${done ? "" : "cursor-pointer"}`}
                  style={{
                    background: done ? "#eafff0" : "#ffffff",
                    borderColor: done ? "#2c7a41" : "#1e3a6e",
                    boxShadow: done ? "0 6px 0 #2c7a41" : undefined,
                  }}
                >
                  {card.type === "emoji" ? (
                    <span className="text-4xl sm:text-5xl" aria-hidden="true">{card.label}</span>
                  ) : (
                    <span className="font-display font-extrabold text-lg sm:text-xl text-center break-words">{card.label}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* victoria */}
      {won && (
        <div className="card-toy mt-7 p-6 text-center anim-pop" style={{ background: "#fffdf4" }}>
          <p className="text-5xl" aria-hidden="true">🏆</p>
          <h2 className="font-display font-extrabold text-3xl mt-2">¡Encontraste todas!</h2>
          <p className="font-bold text-ink-soft mt-1">
            {moves} intentos · {formatTime(seconds)}
            {saved && <span className="text-leaf font-extrabold"> · guardado ✓</span>}
          </p>
          <div className="flex gap-3 justify-center mt-5 flex-wrap">
            <button onClick={reset} className="btn-toy bg-leaf text-white px-6 py-3 text-lg">
              Otra partida
            </button>
            <button onClick={onExit} className="btn-toy bg-white text-ink px-6 py-3 text-lg">
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
