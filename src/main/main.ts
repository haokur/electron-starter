import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'node:path';
import { menubar } from 'menubar';
const { autoUpdater } = require('electron-updater');

import { injectListenEvents } from './events/events';
import { electronUtil } from './utils/electron.util';
const AppPath = app.getAppPath();

const isDevelopment = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // devTools: isDevelopment,
    },
  });

  let menubarIndexUrl = '';
  if (isDevelopment) {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools();

    menubarIndexUrl = `http://localhost:${rendererPort}#/about`;

    // 开发用来测试环境版本更新配置
    autoUpdater.currentVersion = '0.1.0';
    Object.defineProperty(app, 'isPackaged', {
      get() {
        return true;
      },
    });
    autoUpdater.updateConfigPath = path.join(__dirname, '../../dev-app-update.yml');
  } else {
    const indexHtmlPath = path.join(app.getAppPath(), 'renderer', 'index.html');
    mainWindow.loadFile(indexHtmlPath, {
      query: { hash: '#/dashboard' },
    });
    menubarIndexUrl = `file://${indexHtmlPath}#/about`;
  }
  electronUtil.setMainWindow(mainWindow);

  // 设置原生图标菜单，最好不和弹窗形式共用
  // const iconPath = path.join(AppPath, 'static/icons/IconTemplate.png');
  // const tray = new Tray(iconPath);
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio' },
  //   { label: 'Item2', type: 'radio' },
  //   { label: 'Item3', type: 'radio', checked: true },
  //   { label: 'Item4', type: 'radio' },
  // ]);
  // tray.setContextMenu(contextMenu);

  function setOkIcon() {
    mb.tray.setImage(path.join(AppPath, 'static/icons/state-ok-20.png'));
  }

  function setStaticIcon() {
    mb.tray.setImage(path.join(AppPath, 'static/icons/IconTemplate.png'));
  }

  function frame() {
    setTimeout(() => mb.tray.setImage(path.join(AppPath, 'static/icons/state-sync-20.png')), 300);
    setTimeout(
      () => mb.tray.setImage(path.join(AppPath, 'static/icons/state-sync-20-60.png')),
      600,
    );
    setTimeout(
      () => mb.tray.setImage(path.join(AppPath, 'static/icons/state-sync-20-120.png')),
      900,
    );
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  const mb = menubar({
    // tray,
    index: menubarIndexUrl,
    showDockIcon: true,
    // loadUrlOptions: {
    //   query: { hash: '#/about' },
    // },
    browserWindow: {
      width: 400,
      height: 400,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        // devTools: isDevelopment, // 配置为false，可禁用打开控制台
      },
    },
  });

  mb.on('ready', () => {
    // tray.removeAllListeners();
    // 加载动画，轮询执行
    const trayAnimation = setInterval(frame, 1000);
    // 三秒后结束动画
    sleep(3000).then(() => {
      clearInterval(trayAnimation);
      setOkIcon();
      setTimeout(setStaticIcon, 400);
    });
  });
  mb.on('after-create-window', () => {
    console.log('窗体创建成功', 'main.ts::62行');
    isDevelopment && mb.window?.webContents.openDevTools();
  });

  // 监听绑定
  injectListenEvents();
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
