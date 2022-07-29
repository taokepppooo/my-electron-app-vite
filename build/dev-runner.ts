import electron from 'electron'
import { createServer } from 'vite'
import { spawn } from 'child_process'
import type { ChildProcess } from 'child_process'
import { join, resolve } from 'path'
import chalk from 'chalk'

process.env.NODE_ENV = 'development'
process.env.PORT = '3000'
const _dirname = resolve('build')

function startRenderer(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    // 前端渲染页面先启动一个服务，electron直接访问服务上的页面进行渲染
    const server = await createServer({ configFile: join(_dirname, 'vite.renderer.config.ts') })
    server.listen(9080)
    resolve()
  })
}

function startMain(): Promise<void> {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

function startElectron () {
  const childProcess: ChildProcess = spawn(electron as any, [join(resolve(), 'dist/electron/main/index.js')] as string[])
  // console.log(childProcess.stderr)
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