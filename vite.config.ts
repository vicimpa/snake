import { defineConfig } from "vite";
import paths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: './',
  plugins: [
    paths(),
    react(),
  ],
});