import { useEffect, useState } from "react";

interface Cloud {
  id: number;
  top: number;
  scale: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface Balloon {
  id: number;
  left: number;
  color: string;
  duration: number;
  emoji: string;
}

const BALLOON_COLORS = ["#ff6b6b", "#ffc531", "#4bc96b", "#59b9f2", "#ff8fc0", "#8f7bf7"];
const BALLOON_EMOJIS = ["🎈", "⭐", "🍭", "🌈", "🎈"];

function CloudShape() {
  return (
    <svg viewBox="0 0 140 60" width="140" height="60" aria-hidden="true">
      <ellipse cx="40" cy="40" rx="34" ry="18" fill="#ffffff" />
      <ellipse cx="75" cy="30" rx="30" ry="20" fill="#ffffff" />
      <ellipse cx="105" cy="42" rx="28" ry="15" fill="#ffffff" />
    </svg>
  );
}

export default function Background() {
  const [clouds] = useState<Cloud[]>(() =>
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      top: 4 + Math.random() * 34,
      scale: 0.6 + Math.random() * 0.9,
      duration: 55 + Math.random() * 60,
      delay: -Math.random() * 80,
      opacity: 0.55 + Math.random() * 0.4,
    }))
  );
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    let n = 0;
    const t = window.setInterval(() => {
      n += 1;
      setBalloons((b) => [
        ...b.slice(-6),
        {
          id: n,
          left: 4 + Math.random() * 90,
          color: BALLOON_COLORS[n % BALLOON_COLORS.length],
          duration: 16 + Math.random() * 10,
          emoji: BALLOON_EMOJIS[n % BALLOON_EMOJIS.length],
        },
      ]);
    }, 9000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* sol sonriente con rayos giratorios */}
      <div className="absolute top-8 right-6 sm:right-16">
        <div
          className="absolute -inset-10 rounded-full"
          style={{
            background:
              "repeating-conic-gradient(rgba(255,197,49,0.55) 0deg 8deg, transparent 8deg 22deg)",
            animation: "rays-spin 40s linear infinite",
          }}
        />
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-sun border-4 border-ink flex items-center justify-center shadow-[0_6px_0_rgba(30,58,110,0.25)]">
          <svg viewBox="0 0 60 60" width="44" height="44">
            <circle cx="21" cy="26" r="3" fill="#1e3a6e" />
            <circle cx="39" cy="26" r="3" fill="#1e3a6e" />
            <path d="M20 36 Q 30 44 40 36" fill="none" stroke="#1e3a6e" strokeWidth="3.4" strokeLinecap="round" />
            <circle cx="14" cy="33" r="4" fill="#ff8fc0" opacity="0.7" />
            <circle cx="46" cy="33" r="4" fill="#ff8fc0" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* nubes a la deriva */}
      {clouds.map((c) => (
        <div
          key={c.id}
          className="cloud"
          style={{
            top: `${c.top}%`,
            transform: `scale(${c.scale})`,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <CloudShape />
        </div>
      ))}

      {/* globos que suben de vez en cuando */}
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-0 text-3xl"
          style={{
            left: `${b.left}%`,
            animation: `balloon-up ${b.duration}s linear forwards`,
            filter: `drop-shadow(0 4px 0 rgba(30,58,110,0.15))`,
            color: b.color,
          }}
        >
          {b.emoji}
        </div>
      ))}

      {/* colinas con flores y letras */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 190"
        preserveAspectRatio="none"
        style={{ height: "22vh", minHeight: 140 }}
      >
        <path d="M0 120 Q 360 40 720 110 T 1440 90 V 190 H 0 Z" fill="#7fd67f" />
        <path d="M0 150 Q 400 90 820 150 T 1440 130 V 190 H 0 Z" fill="#5bc46a" />
        <g fontSize="30">
          <text x="120" y="168">🌼</text>
          <text x="340" y="150">🍄</text>
          <text x="620" y="172">🌷</text>
          <text x="900" y="158">🌻</text>
          <text x="1150" y="170">🌼</text>
          <text x="1320" y="150">🍀</text>
        </g>
        <g fontFamily="Baloo 2, sans-serif" fontWeight="800" fill="#ffffff" opacity="0.85">
          <text x="210" y="140" fontSize="42" transform="rotate(-8 210 140)">A</text>
          <text x="480" y="160" fontSize="34" transform="rotate(6 480 160)">B</text>
          <text x="760" y="136" fontSize="46" transform="rotate(-5 760 136)">C</text>
          <text x="1030" y="158" fontSize="38" transform="rotate(8 1030 158)">A</text>
          <text x="1260" y="140" fontSize="30" transform="rotate(-7 1260 140)">B</text>
        </g>
      </svg>
    </div>
  );
}
