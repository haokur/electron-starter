import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { initElectronUpdater } from './utils/updater.util';
import { injectListenEvents } from './events/events';

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});

const isDevelopment = process.env.NODE_ENV === 'development'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  if (isDevelopment) {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools()
  }
  else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'renderer', 'index.html'));
  }

  // 监听绑定
  injectListenEvents(mainWindow)

  initElectronUpdater()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})