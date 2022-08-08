import { join } from 'path'
import envConfig from 'env'

const isDev = process.env.NODE_ENV === 'development'

class RefererPath {
  constructor() {
    this.__static = join(__dirname, '..', 'renderer')
  }
  /**
   * 静态文件路径 渲染进程目录下
   *
   * @type {string}
   * @memberof StaticPath
   */
  __static: string
}

const refererPath = new RefererPath()

function getUrl (devUrl: string, proUrl: string) {
  const url = isDev ? new URL(envConfig.dev.env.BASE_URL) : new URL('file://')
  url.pathname = isDev ? devUrl : proUrl
  return url.href
}

export const refererUrl = getUrl(join("."), join(__dirname, '..', 'renderer', 'index.html'))