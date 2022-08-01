import { app, BrowserWindow } from 'electron'
import MainInit from './services/windowManager'

app.whenReady().then(() => {
  new MainInit().initWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) new MainInit().initWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
}) 