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
