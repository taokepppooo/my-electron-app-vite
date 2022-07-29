import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, resolve } from 'path'

const _dirname = resolve('src/main')

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({})
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
      preload: join(_dirname, 'preload.ts')
    }
  })
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:openFile', handleFileOpen)
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})