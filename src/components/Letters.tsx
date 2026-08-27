import { useEffect, useState } from "react";

interface Props {
  word: string;
  grow?: boolean;
  selected?: boolean;
  color?: string;
  animateIn?: boolean;
  className?: string;
}

export default function Letters({
  word,
  grow = false,
  selected = false,
  color,
  animateIn = false,
  className = "",
}: Props) {
  const [mounted, setMounted] = useState(!animateIn);

  useEffect(() => {
    if (!animateIn) {
      setMounted(true);
      return;
    }
    setMounted(false);
    const id = window.setTimeout(() => setMounted(true), 70);
    return () => window.clearTimeout(id);
  }, [animateIn, word]);

  return (
    <span className={`letters ${grow ? "letters-grow" : ""} ${className}`} aria-label={word}>
      {word.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          aria-hidden="true"
          className={`letter ${selected ? "letter-selected" : ""} ${
            animateIn && !mounted ? "letter-pre" : ""
          }`}
          style={{
            transitionDelay: `${i * 40}ms`,
            color: selected && color ? color : undefined,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}
