import { sync } from 'del'
import { build } from 'vite'
import { join, resolve } from 'path'
import { build as esbuild } from 'esbuild'
import type { CommonOptions } from 'esbuild'
import { BuildOptions } from 'types/build'
import { esbuildOpt } from './esbuild.config'
import ora from 'ora'
import chalk from 'chalk'

const _dirname = resolve('build')

if (process.env.BUILD_TARGET === 'clean') {
  clean()
} else if (process.env.BUILD_TARGET === 'main') {
  main()
} else {
  unionBuild()
}

export function clean() {
  sync(['dist/electron/main/*', 'dist/electron/renderer/*', 'dist/web/*'])
  process.exit()
}

export function unionBuild() {
  sync(['dist/electron/*'])
  if (process.env.BUILD_TARGET === 'clean' || process.env.BUILD_TARGET === 'onlyClean') clean()

  main({ isDel: false })

  renderer({ isDel: false })  
}

export function main(opt?: BuildOptions) {
  if (!opt) {
    sync(['dist/electron/*'])
  }

  const spinner = ora('主线程打包').start()
  // esbuild打包，打包快速
  esbuild(esbuildOpt as CommonOptions).then(res => {
    spinner.color = 'yellow'
    spinner.text = '打包中...'
  }).catch((err) => {
    process.exit(1)
  })
}

export function renderer (opt?: BuildOptions) {
  if (!opt) {
    sync(['dist/electron/*'])
  }

  build({ configFile: join(_dirname, 'vite.renderer.config.ts') }).then(res => {
  }).catch(err => {
    process.exit(1)
  })
}