// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  fonts: {
    families: [{ name: "Nunito", provide: "google" }],
  },
  alias: {
    "@Components": "src/components",
    "@Pages": "src/pages",
  },
  css: [
    { src: '../public/content/style/style.scss', lang: 'scss' } // подключение SCSS файла// подключение SCSS файла
  ]
  // alias: {
  //   'images': fileURLToPath(new URL('../assets/images', import.meta.url)),
  //   'style': fileURLToPath(new URL('./assets/style', import.meta.url)),
  //   'data': fileURLToPath(new URL('./assets/other/data', import.meta.url))
  // }
});