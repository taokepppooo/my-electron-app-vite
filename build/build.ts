import { sync } from 'del'
import Multispinner from 'multispinner'
import { build } from 'vite'
import { join, resolve } from 'path'
import { build as esbuild } from 'esbuild'

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

  const tasks = ['main', 'renderer']
  const m = new Multispinner(tasks, {
    preText: 'building',
    postText: 'process'
  })
  let results = ''

  m.on('success', () => {
    process.stdout.write('\x1B[2J\x1B[0f')
    console.log(`\n\n${results}`)
    process.exit()
  })

  // vite打包需要index.html入口，所以此处使用rollup打包
  esbuild({
    // minify: true,
    bundle: true,
    entryPoints: ['src/main/index.ts'],
    sourcemap: 'external',
    outdir: join(resolve(), 'dist/electron/main'),
    platform: 'node',
    format: 'cjs',
    target: ['node16']
  }).then(res => {
    m.success('main')
  }).catch((err) => {
    m.error('main')
    console.error(`\n${err}\n`)
    process.exit(1)
  })

  build({ configFile: join(_dirname, 'vite.renderer.config.ts') }).then(res => {
    m.success('renderer')
  }).catch(err => {
    m.error('renderer')
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