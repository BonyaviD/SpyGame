// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "بازی جاسوس",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'توضیحات در مورد کل سایت' },
      ],
    },
  },
  modules: [
    '@pinia/nuxt',
  ],
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
});
