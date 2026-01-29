import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/testSetup.js",
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    environmentMatchGlobs: [
      ["src/components/**", "jsdom"],
      ["src/domain/**", "node"],
    ],
  },
});
