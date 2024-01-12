import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "SwapVid Demo",
        short_name: "SwapVid",
        description: "This is a SwapVid demonstration app.",

        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],

        start_url: "index.html",

        display: "standalone",

        background_color: "#262626",

        theme_color: "#FFFFFF",

        lang: "ja",
      },
    }),
  ],
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 3070,
  },
  resolve: {
    alias: {
      "@": `${__dirname}/src/`,
      "@containers": `${__dirname}/src/containers/`,
      "@ui": `${__dirname}/src/ui/`,
      "@assets": `${__dirname}/src/assets/`,
      "@hooks": `${__dirname}/src/hooks/`,
      "@providers": `${__dirname}/src/providers/`,
      "@utils": `${__dirname}/src/utils/`,
      "@styles": `${__dirname}/src/styles/`,
    },
  },
});
