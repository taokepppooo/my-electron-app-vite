import electron from 'electron'
import { createServer } from 'vite'
import { spawn } from 'child_process'
import type { ChildProcess } from 'child_process'
import { join, resolve } from 'path'
import envConfig from '../env'
import chalk from 'chalk'

let electronProcess: ChildProcess | null = null
let manualRestart = false

function startRenderer(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // 前端渲染页面先启动一个服务，electron直接访问服务上的页面进行渲染
    const server = await createServer({ configFile: join(__dirname, 'vite.renderer.config.ts') })
    server.listen(envConfig.dev.port)
    resolve()
  })
}

function startMain(): Promise<void> {
  return new Promise((resolve) => {
    resolve()
  })
}

function startElectron () {
  const electronProcess: ChildProcess = spawn(electron as any, [join(resolve(), 'dist/electron/main/index.js')] as string[])
  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
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