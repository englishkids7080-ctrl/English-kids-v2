import { useEffect, useRef } from "react";

interface Props {
  size?: number;
  className?: string;
}

export default function Mascot({ size = 120, className = "" }: Props) {
  const leftPupil = useRef<SVGCircleElement>(null);
  const rightPupil = useRef<SVGCircleElement>(null);
  const leftEye = useRef<SVGCircleElement>(null);
  const rightEye = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        (
          [
            [leftEye, leftPupil],
            [rightEye, rightPupil],
          ] as const
        ).forEach(([eye, pupil]) => {
          const eyeEl = eye.current;
          const pupilEl = pupil.current;
          if (!eyeEl || !pupilEl) return;
          const r = eyeEl.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const k = Math.min(dist, 60) / 60;
          const baseX = eyeEl === leftEye.current ? 42 : 78;
          pupilEl.setAttribute("cx", String(baseX + (dx / dist) * 4.5 * k));
          pupilEl.setAttribute("cy", String(44 + (dy / dist) * 4.5 * k));
        });
      });
    };
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="Bubi, el búho profesor"
    >
      <path d="M24 26 L34 6 L48 22 Z" fill="#8f7bf7" stroke="#1e3a6e" strokeWidth="3" strokeLinejoin="round" />
      <path d="M96 26 L86 6 L72 22 Z" fill="#8f7bf7" stroke="#1e3a6e" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="60" cy="66" rx="44" ry="46" fill="#8f7bf7" stroke="#1e3a6e" strokeWidth="3.5" />
      <ellipse cx="60" cy="80" rx="26" ry="24" fill="#efeaff" />
      <path d="M48 74 q 4 5 0 9 M60 74 q 4 5 0 9 M72 74 q 4 5 0 9" stroke="#c9bdf5" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="18" cy="72" rx="10" ry="18" fill="#7a63e8" stroke="#1e3a6e" strokeWidth="3" transform="rotate(14 18 72)" />
      <ellipse cx="102" cy="72" rx="10" ry="18" fill="#7a63e8" stroke="#1e3a6e" strokeWidth="3" transform="rotate(-14 102 72)" />
      <circle ref={leftEye} cx="42" cy="44" r="17" fill="#ffffff" stroke="#1e3a6e" strokeWidth="3" />
      <circle ref={rightEye} cx="78" cy="44" r="17" fill="#ffffff" stroke="#1e3a6e" strokeWidth="3" />
      <circle ref={leftPupil} cx="42" cy="44" r="7" fill="#1e3a6e" />
      <circle ref={rightPupil} cx="78" cy="44" r="7" fill="#1e3a6e" />
      <circle cx="45" cy="41" r="2.4" fill="#ffffff" />
      <circle cx="81" cy="41" r="2.4" fill="#ffffff" />
      <path d="M54 56 L60 66 L66 56 Z" fill="#f5a623" stroke="#1e3a6e" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M60 0 L92 12 L60 24 L28 12 Z" fill="#1e3a6e" />
      <rect x="55" y="16" width="10" height="9" rx="2" fill="#1e3a6e" />
      <path d="M92 12 q 6 10 -2 18" fill="none" stroke="#ffc531" strokeWidth="3" strokeLinecap="round" />
      <circle cx="90" cy="32" r="4" fill="#ffc531" stroke="#1e3a6e" strokeWidth="2" />
      <path d="M48 110 l-4 7 M48 110 l0 8 M48 110 l4 7 M72 110 l-4 7 M72 110 l0 8 M72 110 l4 7" stroke="#f5a623" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
