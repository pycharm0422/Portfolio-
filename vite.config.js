import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works on GitHub Pages (username.github.io/<repo>/)
// as well as on any custom domain without changes.
export default defineConfig({
  plugins: [react()],
  base: './',
});
