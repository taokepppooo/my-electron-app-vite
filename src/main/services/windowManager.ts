import { BrowserWindow } from 'electron'
import { windowConfig } from '../config/windowConfig'
import { refererUrl } from '../config/refererPath'

class MainInit {
  public refererUrl: string = ''
  public mainWindow: BrowserWindow = null
  
  constructor() {
    this.refererUrl = refererUrl
  }

  createWindow () {
    this.mainWindow = new BrowserWindow({
      ...Object.assign(windowConfig, {})
    })
    console.log(refererUrl)
    this.mainWindow.loadURL(refererUrl)
  }

  // 初始化窗口函数
  initWindow() {
    return this.createWindow()
  }
}

export default MainInit