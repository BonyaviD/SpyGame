const faNumber = new Intl.NumberFormat("fa-IR");

/** Formats a number with Persian digits (e.g. 12 → ۱۲). */
export const toFaDigits = (value: number) => faNumber.format(value);
