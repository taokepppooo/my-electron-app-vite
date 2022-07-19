process.env.NODE_ENV = 'development'
process.env.PORT = '3000'

import { createServer } from 'vite'
import { join, resolve } from 'path'
import chalk from 'chalk'
const log = console.log

const __dirname = resolve('build')

function startRenderer(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const server = await createServer({ configFile: join(__dirname, 'vite.renderer.config.ts') })
    server.listen(9080)
    resolve()
  })
}

function startMain(): Promise<void> {
  return new Promise((resolve, reject) => {
    const main = join(__dirname, 'vite.main.config.ts')
    resolve()
  })
}

function startElectron () {
  
}

async function init() {
  try {
    Promise.all([startRenderer(), startMain()])
      .then(() => {
        startElectron()
      })
      .catch(err => {
        console.error(err)
      })
  } catch (error) {
      console.error(error)
      process.exit(1)
  }

}

init()