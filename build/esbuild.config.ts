import { join, resolve } from 'path'
import { builtinModules } from 'module'
import { dependencies } from '../package.json'

export const esbuildOpt = {
  minify: true,
  bundle: true,
  entryPoints: ['src/main/index.ts'],
  sourcemap: 'external',
  outdir: join(resolve(), 'dist/electron/main'),
  platform: 'node',
  format: 'cjs',
  target: ['esnext'],
  external: [
    ...builtinModules,
    ...Object.keys(dependencies),
    "electron"
  ],
}