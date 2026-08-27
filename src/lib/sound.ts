let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.12,
  attack = 0.03
) {
  const c = getCtx();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = c.currentTime + start;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.1);
  } catch {
    return;
  }
}

function unlockAudio() {
  try {
    getCtx();
  } catch {
    return;
  }
}
if (typeof window !== "undefined") {
  window.addEventListener("pointerdown", unlockAudio, { once: true });
}

export function playClick() {
  tone(420, 0, 0.1, "sine", 0.09, 0.012);
  tone(640, 0.02, 0.09, "sine", 0.05);
}

export function playCorrect() {
  tone(392, 0, 0.16, "sine", 0.11);
  tone(494, 0.1, 0.16, "sine", 0.11);
  tone(587, 0.2, 0.3, "sine", 0.11);
}

export function playWrong() {
  tone(294, 0, 0.22, "sine", 0.09);
  tone(233, 0.16, 0.3, "sine", 0.09);
}

export function playFlip() {
  tone(660, 0, 0.08, "sine", 0.06);
  tone(880, 0.06, 0.09, "sine", 0.05);
}

export function playSparkle() {
  tone(1046, 0, 0.1, "sine", 0.05);
  tone(1318, 0.07, 0.12, "sine", 0.05);
}

export function playWin() {
  [392, 494, 587, 784, 988].forEach((f, i) => tone(f, i * 0.13, 0.26, "sine", 0.1));
  tone(1175, 0.68, 0.5, "sine", 0.09);
}

export function playUnlock() {
  [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, i * 0.09, 0.3, "sine", 0.08));
}

export function playLocked() {
  tone(180, 0, 0.12, "triangle", 0.1);
  tone(150, 0.1, 0.14, "triangle", 0.08);
}

export function playMagic() {
  [523, 659, 784].forEach((f, i) => tone(f, i * 0.1, 0.24, "sine", 0.09));
  [1046, 1318, 1568].forEach((f, i) => tone(f, 0.34 + i * 0.09, 0.34, "sine", 0.07));
}

export function playAnimal(name: string) {
  switch (name) {
    case "dog":
      tone(392, 0, 0.28, "sawtooth", 0.07);
      tone(300, 0.24, 0.3, "sawtooth", 0.07);
      tone(240, 0.5, 0.34, "sawtooth", 0.06);
      break;
    case "cat":
      tone(520, 0, 0.2, "sine", 0.09);
      tone(700, 0.16, 0.18, "sine", 0.09);
      tone(420, 0.34, 0.26, "sine", 0.08);
      break;
    case "bird":
      [0, 0.22].forEach((t) => {
        tone(1400, t, 0.09, "sine", 0.06);
        tone(1800, t + 0.08, 0.08, "sine", 0.05);
      });
      break;
    case "fish":
      tone(220, 0, 0.1, "sine", 0.08);
      tone(330, 0.14, 0.1, "sine", 0.07);
      tone(260, 0.3, 0.1, "sine", 0.07);
      break;
    case "horse":
      tone(440, 0, 0.14, "sawtooth", 0.05);
      tone(520, 0.12, 0.14, "sawtooth", 0.05);
      tone(392, 0.26, 0.2, "sawtooth", 0.05);
      break;
    case "frog":
      tone(160, 0, 0.12, "square", 0.05);
      tone(130, 0.14, 0.16, "square", 0.05);
      break;
    case "duck":
      tone(500, 0, 0.1, "square", 0.05);
      tone(430, 0.12, 0.12, "square", 0.05);
      tone(500, 0.3, 0.1, "square", 0.05);
      tone(430, 0.42, 0.12, "square", 0.05);
      break;
    case "lion":
      tone(110, 0, 0.5, "sawtooth", 0.08);
      tone(98, 0.2, 0.45, "sawtooth", 0.07);
      break;
    case "elephant":
      tone(250, 0, 0.3, "sawtooth", 0.06);
      tone(340, 0.24, 0.3, "sawtooth", 0.06);
      tone(300, 0.5, 0.2, "sawtooth", 0.05);
      break;
    case "rabbit":
      tone(700, 0, 0.07, "sine", 0.06);
      tone(900, 0.09, 0.07, "sine", 0.06);
      break;
    default:
      playSparkle();
  }
}

export function speak(text: string) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    u.pitch = 1.1;
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.toLowerCase().startsWith("en"));
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  } catch {
    return;
  }
}
