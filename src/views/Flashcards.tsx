import { useCallback, useEffect, useState } from "react";
import { Category, shuffle } from "../data/vocab";
import { playAnimal, playFlip, speak } from "../lib/sound";
import Letters from "../components/Letters";

interface Props {
  category: Category;
  onExit: () => void;
}

export default function Flashcards({ category, onExit }: Props) {
  const [order, setOrder] = useState(() => shuffle(category.words));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = order[idx];

  const go = useCallback(
    (delta: number) => {
      playFlip();
      setFlipped(false);
      setIdx((i) => (i + delta + order.length) % order.length);
    },
    [order.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
        playFlip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const flip = () => {
    playFlip();
    setFlipped((f) => {
      if (!f) {
        if (category.id === "animals") {
          playAnimal(word.en);
          window.setTimeout(() => speak(word.en), 700);
        } else {
          speak(word.en);
        }
      }
      return !f;
    });
  };

  const reshuffle = () => {
    playFlip();
    setOrder(shuffle(category.words));
    setIdx(0);
    setFlipped(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button onClick={onExit} className="btn-toy bg-white text-ink px-4 py-2 text-sm">
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13 8 H4 M8 3.5 L3.5 8 L8 12.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Volver
        </button>
        <p className="font-display font-extrabold text-xl flex items-center gap-2">
          <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl border-[3px] border-ink text-xl" style={{ background: category.color }} aria-hidden="true">
            {category.emoji}
          </span>
          {category.nameEn}
        </p>
        <button onClick={reshuffle} className="btn-toy bg-sun text-ink px-4 py-2 text-sm">
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13.5 8 a5.5 5.5 0 1 1 -1.6 -3.9 M13.5 1.8 v3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Barajar
        </button>
      </div>

      <div className="mt-6 flip-scene" style={{ height: 360 }}>
        <div className={`flip-inner ${flipped ? "flipped" : ""}`} onClick={flip} role="button" tabIndex={0} aria-label={flipped ? `Palabra: ${word.en}` : "Toca para ver la palabra"}>
          <div className="flip-face card-toy flex flex-col items-center justify-center gap-3 cursor-pointer select-none" style={{ background: "#ffffff" }}>
            <span className="text-[7rem] leading-none anim-float" aria-hidden="true">{word.emoji}</span>
            <span className="font-display font-bold text-xl text-ink-soft">¿Cómo se dice en inglés?</span>
            <span className="font-body text-sm font-bold bg-paper border-2 border-ink rounded-full px-4 py-1">
              Toca la tarjeta para voltearla
            </span>
          </div>
          <div className="flip-face flip-back card-toy flex flex-col items-center justify-center gap-2 cursor-pointer select-none" style={{ background: category.color }}>
            <span className="font-display font-extrabold text-[clamp(2.6rem,9vw,4rem)] leading-none text-ink">
              <Letters word={word.en} animateIn={flipped} />
            </span>
            <span className="font-body font-extrabold text-xl text-ink/75">= {word.es}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (category.id === "animals") {
                  playAnimal(word.en);
                  window.setTimeout(() => speak(word.en), 700);
                } else {
                  speak(word.en);
                }
              }}
              className="btn-toy bg-white text-ink px-5 py-2.5 mt-3 text-base"
              aria-label={`Escuchar ${word.en}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 9 v6 h4 l5 4 V5 L8 9 Z" fill="#1e3a6e" />
                <path d="M16.5 8.5 a5 5 0 0 1 0 7 M19 6 a8.5 8.5 0 0 1 0 12" fill="none" stroke="#1e3a6e" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              ¡Escúchalo!
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 gap-3">
        <button onClick={() => go(-1)} className="btn-toy bg-white text-ink px-5 py-2.5" aria-label="Tarjeta anterior">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13 8 H4 M8 3.5 L3.5 8 L8 12.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5 flex-wrap justify-center" aria-label={`Tarjeta ${idx + 1} de ${order.length}`}>
          {order.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFlipped(false);
                setIdx(i);
                playFlip();
              }}
              className="rounded-full transition-all duration-200 border-2 border-ink cursor-pointer"
              style={{
                width: i === idx ? 26 : 11,
                height: 11,
                background: i === idx ? category.color : "#ffffff",
              }}
              aria-label={`Ir a la tarjeta ${i + 1}`}
            />
          ))}
        </div>

        <button onClick={() => go(1)} className="btn-toy bg-white text-ink px-5 py-2.5" aria-label="Tarjeta siguiente">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8 h9 M8.5 3.5 L13 8 L8.5 12.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p className="text-center text-sm font-bold text-ink-soft mt-4">
        Tarjeta {idx + 1} de {order.length} · Usa ← → para moverte y espacio para voltear
      </p>
    </div>
  );
}
