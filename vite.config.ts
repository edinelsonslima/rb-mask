import { defineConfig } from 'vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      // rollupTypes: true, //Ta com bug no @microsoft/api-extractor, não ta unindo os tipos em um único arquivo
      insertTypesEntry: true,
      exclude: ["src/app"],
      tsconfigPath: './tsconfig.app.json',
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      name: 'rb-mask',
      formats: ['es'],
      entry: path.resolve("src", "index.ts"),
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  }
})
