const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron')
const path = require('path')
const url = require('url')

function createWindow () {
  let server = require('./server')
  const win = new BrowserWindow({
    width: 1200,
    height: 720,
    webPreferences: {
        enableRemoteModule:true,
        nodeIntegration:true,
        contextIsolation: false,
        preload: path.join(__dirname, 'preload.js')
    }
  })

  win.webContents.openDevTools()

  win.loadFile(path.join(__dirname, 'index.html'))
  win.loadURL('http://localhost:3000')

  // console.log(__dirname);
}

// ipcMain.handle('to-data',(av, arg)=>{
//     console.log(arg);
// })


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
