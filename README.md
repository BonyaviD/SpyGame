# بازی جاسوس (Spy Game)

بازی گروهی «جاسوس» برای اجرا روی یک گوشی: به همه‌ی بازیکنان یک کلمه‌ی مشترک نشان داده می‌شود، جز جاسوس. بازیکنان با سؤال و جواب باید جاسوس را پیدا کنند و جاسوس باید کلمه را حدس بزند.

مراحل هر دور: پخش کارت‌ها (گوشی دست‌به‌دست می‌چرخد) ← بحث با تایمر ← رأی‌گیری ← حدس جاسوس ← نتیجه و امتیاز.

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
pages/            صفحات و مسیرها: index → setup → reveal → discussion → voting → result، و guide
  dev/ui.vue      نمایش همه‌ی کامپوننت‌ها و توکن‌ها (فقط در حالت dev: /dev/ui)
components/
  ui/             کامپوننت‌های پایه‌ی سیستم دیزاین (AppButton، AppInput، AppModal، AppTabs، ...)
  layout/         چیدمان صفحه (ScreenLayout، SceneBackground، AppLogo، DesktopAside)
  game/           کامپوننت‌های مخصوص بازی (PlayerList، PlayerCard، CardBack)
layouts/          قاب اصلی برنامه (قاب گوشی روی دسکتاپ)
stores/           استورهای Pinia: players، settings، words (انتخاب کلمه و گزینه‌های حدس)، game (دور جاری، تایمر، رأی و امتیاز)
middleware/       گارد مسیر: صفحات /reveal و /result فقط در مرحله‌ی درست بازی باز می‌شوند
data/             داده‌های ثابت: config (محدودیت‌ها)، words (کلمات دسته‌بندی‌شده)، rules (قوانین)
composables/      useCountdown (تایمر زنده بر اساس زمان پایان ذخیره‌شده)
utils/            persistedRef (ذخیره در localStorage)، مسیر هر مرحله، هشدار صوتی/لرزش، توابع تصادفی و فرمت اعداد فارسی
types/            تایپ‌های مشترک
tests/            تست‌های Vitest
assets/css/       tokens.css (توکن‌های طراحی) و base.css (ریست و استایل‌های سراسری)
```

## PWA و اجرای آفلاین

بازی قابل نصب روی گوشی است (Add to Home Screen) و بعد از اولین بازدید بدون اینترنت هم کار می‌کند. آیکون اصلی `public/icon.svg` است؛ بعد از تغییرش `npm run generate-icons` را اجرا کنید.

## تست‌ها و CI

- تست‌های واحد در `tests/stores` و `tests/components` (Vitest با محیط Nuxt).
- تست‌های E2E در `tests/e2e` روی بیلد production، در سه حالت: موبایل، دسکتاپ و موبایل با انیمیشن‌های واقعی. اولین بار: `npx playwright install chromium`.
- GitHub Actions (`.github/workflows/ci.yml`) روی هر push و pull request همه‌ی این‌ها را اجرا می‌کند.

## سیستم دیزاین

- **توکن‌ها** در `assets/css/tokens.css`: رنگ‌های خام (`--red-700`, ...) فقط در همان فایل استفاده می‌شوند؛ کامپوننت‌ها فقط از توکن‌های معنایی (`--color-primary`, `--space-4`, `--font-size-lg`, `--radius-md`, ...) استفاده می‌کنند.
- **کامپوننت‌ها** بر اساس نام فایل به‌صورت خودکار import می‌شوند (`<AppButton>`، `<PlayerCard>`).
- هر صفحه با `ScreenLayout` ساخته می‌شود (هدر + بدنه‌ی اسکرول‌شونده + فوتر ثابت دکمه‌ها).
- مودال‌ها با `Teleport` به `#overlay-root` داخل قاب برنامه منتقل می‌شوند.
- جهت‌ها منطقی هستند (`inset-inline-start`، `padding-inline`) تا RTL درست کار کند.

نقشه‌ی راه و کارهای باقی‌مانده در [TASKS.md](TASKS.md) است.
