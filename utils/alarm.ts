let audioContext: AudioContext | null = null;

/**
 * Browsers only allow audio after a user gesture. Call this from a click handler
 * (e.g. the button that starts the timer) so the end-of-time alarm can play later.
 */
export const unlockAudio = () => {
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") void audioContext.resume();
  } catch {
    // Web Audio unavailable: the alarm falls back to vibration only.
  }
};

const beep = (context: AudioContext, startAt: number) => {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.15, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + 0.25);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + 0.25);
};

/** Three short beeps and a vibration, where supported. */
export const playAlarm = () => {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([300, 150, 300, 150, 300]);
  }
  if (!audioContext || audioContext.state !== "running") return;
  const now = audioContext.currentTime;
  [0, 0.4, 0.8].forEach((offset) => beep(audioContext!, now + offset));
};
