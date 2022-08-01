import { join } from 'path'
import envConfig from 'env'

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

function getUrl (devUrl: string) {
  const url = new URL(`http://localhost:${envConfig.dev.port}`)
  console.log(url)
  url.pathname = devUrl
  return url.href
}

export const refererUrl = getUrl(join(refererPath.__static, 'index.html'))