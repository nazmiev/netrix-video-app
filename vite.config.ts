import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.NODE_ENV === 'production' && process.env.REPO_NAME
    ? '/' + process.env.REPO_NAME+ '/'
    : '/';

export default defineConfig({
  base: base,
  plugins: [react()],
})