// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // The game runs fully on the client (offline, single device), so SSR adds nothing.
  ssr: false,
  app: {
    head: {
      title: "بازی جاسوس",
      htmlAttrs: { lang: "fa", dir: "rtl" },
      meta: [
        { charset: "utf-8" },
        // viewport-fit=cover enables env(safe-area-inset-*) on notched phones.
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { name: "description", content: "بازی جاسوس" },
        { name: "theme-color", content: "#891515" },
      ],
    },
  },
  modules: ["@pinia/nuxt", "@nuxt/eslint"],
  css: ["~/assets/css/tokens.css", "~/assets/css/base.css"],
  // Components are auto-imported by file name (AppButton, PlayerCard, ...) regardless of folder.
  components: [{ path: "~/components", pathPrefix: false }],
  typescript: {
    strict: true,
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  $production: {
    hooks: {
      // The design-system playground under /dev only exists during development.
      "pages:extend"(pages) {
        const devPages = pages.filter((page) => page.path.startsWith("/dev"));
        devPages.forEach((page) => pages.splice(pages.indexOf(page), 1));
      },
    },
  },
});
