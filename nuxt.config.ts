// import { defineNuxtConfig } from 'nuxt3';

export default defineNuxtConfig({
  compatibilityDate: '2025-01-07',
  devtools: { enabled: true },
  modules: [
    "@nuxt/fonts",
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  fonts: {
    families: [{ name: "Nunito", provide: "google" }],
  },
  head: {
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '@_/assets/logo.svg' }
    ]
  },
  css: [
    { src: '../assets/style/style.scss', lang: 'scss' }
  ],

});