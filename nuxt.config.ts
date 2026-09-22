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
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "بازی جاسوس" },
      ],
    },
  },
  modules: ["@pinia/nuxt", "@nuxt/eslint"],
  css: ["~/assets/css/main.css", "~/assets/css/base.css"],
  typescript: {
    strict: true,
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
});
