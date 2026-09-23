const faNumber = new Intl.NumberFormat("fa-IR");
const faNumberPadded = new Intl.NumberFormat("fa-IR", { minimumIntegerDigits: 2 });

/** Formats a number with Persian digits (e.g. 12 → ۱۲). */
export const toFaDigits = (value: number) => faNumber.format(value);

/** Formats milliseconds as m:ss with Persian digits (rounded up, so 0:00 means time is up). */
export const formatDuration = (ms: number) => {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${toFaDigits(minutes)}:${faNumberPadded.format(seconds)}`;
};
