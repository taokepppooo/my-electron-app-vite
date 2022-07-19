import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const root = resolve('src/main')

export default defineConfig({
  mode: process.env.NODE_ENV,
  root,
  base: './',
  plugins: [vue()]
})
