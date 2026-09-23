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
  dev/ui.vue      نمایش همه‌ی کامپوننت‌ها و توکن‌ها (فقط در حالت dev: /dev/ui)
components/
  ui/             کامپوننت‌های پایه‌ی سیستم دیزاین (AppButton، AppInput، AppModal، AppTabs، ...)
  layout/         چیدمان صفحه (ScreenLayout، SceneBackground، AppLogo، DesktopAside)
  game/           کامپوننت‌های مخصوص بازی (PlayerList، PlayerCard، CardBack)
layouts/          قاب اصلی برنامه (قاب گوشی روی دسکتاپ)
stores/           استورهای Pinia: players (بازیکنان)، words (انتخاب کلمه)، game (دور جاری و مراحل آن)
middleware/       گارد مسیر: صفحات /reveal و /result فقط در مرحله‌ی درست بازی باز می‌شوند
data/             داده‌های ثابت: config (محدودیت‌ها)، words (کلمات دسته‌بندی‌شده)، rules (قوانین)
utils/            persistedRef (ذخیره در localStorage)، توابع تصادفی و فرمت اعداد فارسی
types/            تایپ‌های مشترک
tests/            تست‌های Vitest
assets/css/       tokens.css (توکن‌های طراحی) و base.css (ریست و استایل‌های سراسری)
```

## سیستم دیزاین

- **توکن‌ها** در `assets/css/tokens.css`: رنگ‌های خام (`--red-700`, ...) فقط در همان فایل استفاده می‌شوند؛ کامپوننت‌ها فقط از توکن‌های معنایی (`--color-primary`, `--space-4`, `--font-size-lg`, `--radius-md`, ...) استفاده می‌کنند.
- **کامپوننت‌ها** بر اساس نام فایل به‌صورت خودکار import می‌شوند (`<AppButton>`، `<PlayerCard>`).
- هر صفحه با `ScreenLayout` ساخته می‌شود (هدر + بدنه‌ی اسکرول‌شونده + فوتر ثابت دکمه‌ها).
- مودال‌ها با `Teleport` به `#overlay-root` داخل قاب برنامه منتقل می‌شوند.
- جهت‌ها منطقی هستند (`inset-inline-start`، `padding-inline`) تا RTL درست کار کند.

نقشه‌ی راه و کارهای باقی‌مانده در [TASKS.md](TASKS.md) است.
