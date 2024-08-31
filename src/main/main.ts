import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { menubar } from 'menubar';

import { initElectronUpdater } from './utils/updater.util';
import { injectListenEvents } from './events/events';

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  },
});

const isDevelopment = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDevelopment,
    },
  });

  let menubarIndexUrl = '';
  if (isDevelopment) {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools();

    menubarIndexUrl = `http://localhost:${rendererPort}#/about`;
  } else {
    const indexHtmlPath = path.join(app.getAppPath(), 'renderer', 'index.html');
    mainWindow.loadFile(indexHtmlPath, {
      query: { hash: '#/dashboard' },
    });
    menubarIndexUrl = `file://${indexHtmlPath}#/about`;
  }

  const mb = menubar({
    index: menubarIndexUrl,
    showDockIcon: true,
    loadUrlOptions: {
      // @ts-ignore
      query: { hash: '#/about' },
    },
    browserWindow: {
      width: 400,
      height: 400,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        devTools: isDevelopment,
      },
    },
  });
  mb.on('after-create-window', () => {
    console.log('窗体创建成功', 'main.ts::62行');
    mb.window?.webContents.openDevTools();
  });

  // 监听绑定
  injectListenEvents(mainWindow);

  // initElectronUpdater();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
