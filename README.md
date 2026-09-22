# بازی جاسوس (Spy Game)

بازی گروهی «جاسوس» برای اجرا روی یک گوشی: به همه‌ی بازیکنان یک کلمه‌ی مشترک نشان داده می‌شود، جز جاسوس. بازیکنان با سؤال و جواب باید جاسوس را پیدا کنند و جاسوس باید کلمه را حدس بزند.

ساخته شده با [Nuxt 3](https://nuxt.com)، [Pinia](https://pinia.vuejs.org) و TypeScript. بازی کاملاً سمت کلاینت اجرا می‌شود (`ssr: false`).

## اجرا

```bash
npm install
npm run dev
```

## اسکریپت‌ها

| دستور               | کار                           |
| ------------------- | ----------------------------- |
| `npm run dev`       | سرور توسعه                    |
| `npm run build`     | بیلد production               |
| `npm run generate`  | خروجی استاتیک برای هاست ایستا |
| `npm run preview`   | پیش‌نمایش بیلد                |
| `npm run lint`      | بررسی ESLint                  |
| `npm run lint:fix`  | رفع خودکار خطاهای ESLint      |
| `npm run format`    | فرمت کد با Prettier           |
| `npm run typecheck` | بررسی تایپ‌ها با vue-tsc      |
| `npm test`          | اجرای تست‌ها (Vitest)         |

## ساختار پروژه

```
pages/            صفحات و مسیرها: index → setup → reveal → result، و guide
components/
  shared/         کامپوننت‌های عمومی (دکمه، لوگو، پس‌زمینه‌ها، دکمه‌ی برگشت)
  game/           کامپوننت‌های مخصوص بازی
  desktop/        صفحه‌ی مخصوص دسکتاپ (QR code)
composables/      منطق قابل‌استفاده‌ی مجدد (مثل useDevice)
stores/           استورهای Pinia (بازیکنان، کلمات، قوانین)
types/            تایپ‌های مشترک
tests/            تست‌های Vitest
assets/           فونت، تصاویر و CSS
```

نقشه‌ی راه و کارهای باقی‌مانده در [TASKS.md](TASKS.md) است.
