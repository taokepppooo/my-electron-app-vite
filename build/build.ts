import { sync } from 'del'
import { build } from 'vite'
import { join, resolve } from 'path'
import { build as esbuild } from 'esbuild'
import type { CommonOptions } from 'esbuild'
import { esbuildOpt } from './esbuild.config'

const _dirname = resolve('build')

if (process.env.BUILD_TARGET === 'clean') {
  clean()
} else if (process.env.BUILD_TARGET === 'web') {
  web()
} else {
  unionBuild()
}

function clean() {
  sync(['dist/electron/main/*', 'dist/electron/renderer/*', 'dist/web/*'])
  process.exit()
}

function unionBuild() {
  sync(['dist/electron/*'])
  if (process.env.BUILD_TARGET === 'clean' || process.env.BUILD_TARGET === 'onlyClean') clean()

  // vite打包需要index.html入口，所以此处使用rollup打包
  esbuild(esbuildOpt as CommonOptions).then(res => {
  }).catch((err) => {
    console.error(`\n${err}\n`)
    process.exit(1)
  })

  build({ configFile: join(_dirname, 'vite.renderer.config.ts') }).then(res => {
  }).catch(err => {
    console.error(`\n${err}\n`)
    process.exit(1)
  })
}

function web() {
  sync(['dist/web/*'])

  build({ configFile: join(_dirname, 'vite.web.config.ts') }).then(res => {
    process.exit()
  }).catch(err => {
    console.error(`\n${err}\n`)
    process.exit(1)
  })
}