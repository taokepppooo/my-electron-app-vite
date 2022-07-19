import { sync } from 'del'
import Multispinner from 'multispinner'
import { build } from 'vite'
import { join } from 'path'

function clean() {
  sync(['dist/electron/main/*', 'dist/electron/renderer/*', 'dist/web/*', 'build/*', '!build/icons', '!build/lib', '!build/lib/electron-build.*', '!build/icons/icon.*'])
  if (process.env.BUILD_TARGET === 'onlyClean') process.exit()
}

function unionBuild() {
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

  build({ configFile: join(__dirname, 'vite.config') }).then(res => {
      m.success('renderer')
  }).catch(err => {
      m.error('renderer')
      console.error(`\n${err}\n`)
      process.exit(1)
  })
}

unionBuild()