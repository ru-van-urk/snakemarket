// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",

  runtimeConfig: {
    public: {
      dekaApiKey: process.env.DEKA_API_KEY,
    },
  },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
});
