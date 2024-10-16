import { defineStore } from "pinia";

export const useRules = defineStore("rules", () => {
  const rulesInfo = ref([
    {
        name: "جاسوس",
        title: "قوانین جاسوس",
        description: `اگر جاسوس تا پایان زمان بازی شناسایی نشود، جاسوس برنده می‌شود.
  `,
        active: false,
      },
    {
      name: "شهروند",
      title: "قوانین شهروندی",
      description: `اگر جاسوس قبل از پایان زمان بازی شناسایی شود، شهروندان برنده می‌شوند.
`,
      active: false,
    },

    {
        name: "بازی",
        title: "قوانین بازی",
        description: `
                هدف بازی جاسوس، پیدا کردن فردی است که در بین جمع، از موضوع یا مکان مخفی بازی بی‌اطلاع است. این فرد، “جاسوس” نامیده می‌شود و باید با
                هوشیاری و دقت، هویت خود را پنهان کند. به هر بازی کن یه کارت داده می‌شود که در آن کارت یه کلمه نوشته شده است به جز یک کارت که نوشته شده است
                جاسوس`,
        active: true,
      },
  ]);

  return { rulesInfo };
});
