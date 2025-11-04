import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // optimizeDeps: {
  //   exclude: ['lucide-react'],
  // },
  resolve: {
    alias: [
      // any deep icon import -> root package (tree-shaken by Vite)
      { find: /^lucide-react\/dist\/esm\/icons\/.*/, replacement: "lucide-react" },
    ],
  }
});
