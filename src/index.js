const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const url = require('url')
require('@electron/remote/main').initialize()
let win;
function createWindow () {
  // let server = require('./server')
  win = new BrowserWindow({
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
  // win.webContents.openDevTools()
  win.removeMenu()

  win.loadFile(path.join(__dirname, 'index.html'))
  // win.loadURL('http://localhost:3000')

  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
    win.webContents.send('checking_update');
  });
  win.webContents.on('did-finish-load', function () {

    autoUpdater.on('update-available', () => {
      win.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
      win.webContents.send('update_downloaded');
    });
    autoUpdater.on('update-not-available', () => {
      win.webContents.send('update_not_available');
    });
    autoUpdater.on('error', (info) => {
      win.webContents.send('update_error');
      win.showMessage(info);
    });
});
}


ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

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
