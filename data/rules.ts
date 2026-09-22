export type RuleId = "game" | "citizen" | "spy";

export interface Rule {
  id: RuleId;
  /** Short tab label. */
  name: string;
  title: string;
  description: string;
}

export const rules: Rule[] = [
  {
    id: "spy",
    name: "جاسوس",
    title: "قوانین جاسوس",
    description: "اگر جاسوس تا پایان زمان بازی شناسایی نشود، جاسوس برنده می‌شود.",
  },
  {
    id: "citizen",
    name: "شهروند",
    title: "قوانین شهروندی",
    description: "اگر جاسوس قبل از پایان زمان بازی شناسایی شود، شهروندان برنده می‌شوند.",
  },
  {
    id: "game",
    name: "بازی",
    title: "قوانین بازی",
    description:
      "هدف بازی جاسوس، پیدا کردن فردی است که در بین جمع، از موضوع یا مکان مخفی بازی بی‌اطلاع است. این فرد، «جاسوس» نامیده می‌شود و باید با هوشیاری و دقت، هویت خود را پنهان کند. به هر بازیکن یک کارت داده می‌شود که در آن یک کلمه نوشته شده است، به جز یک کارت که روی آن نوشته شده است «جاسوس».",
  },
];
