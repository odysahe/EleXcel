const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
require('@electron/remote/main').initialize()

function createWindow () {
  // let server = require('./server')
  const win = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
      nodeIntegration:true,
      enableRemoteModule:true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
  })

  require('@electron/remote/main').enable(win.webContents)
  win.webContents.openDevTools()
  win.removeMenu()

  win.loadFile(path.join(__dirname, 'index.html'))
  // win.loadURL('http://localhost:3000')

}


app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
