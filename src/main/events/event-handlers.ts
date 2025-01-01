/**
 * electron主进程暴漏给render进程的方法扩展池：
 * 格式如下：定义一个异步方法，接受render传入的参数，方法内可以执行耗时操作，返回一个结果
 * export async function test(params){await xxx; return result}
 */
import fs from 'fs';
import path from 'path';
import { app, shell } from 'electron';
const AppPath = app.getAppPath();
const { exec } = require('child_process');

import { electronUtil } from '../utils/electron.util';
import {
  checkAppVersion,
  initVersionUpdater,
  installAppNow,
  downloadAppNow,
} from '../utils/updater.util';

/**创建文件夹 */
export async function mkdir(dirPath) {
  const userDataPath = app.getPath('userData');
  let _path = path.join(userDataPath, dirPath);
  fs.mkdirSync(_path);
  return `创建成功:${_path}`;
}

/**打开开发者工具 */
export function toggleDevTools(_, win) {
  const isDevToolsOpen = win.webContents.isDevToolsOpened();
  isDevToolsOpen ? win.closeDevTools() : win.openDevTools();

  electronUtil.showNotice('切换成功~');
  return isDevToolsOpen;
}

/**[test]测试main进程里的配置 */
export function testMainAppConfig() {
  let _config = electronUtil.getAppConfig();
  electronUtil.showNotice(JSON.stringify(_config.env));
}

/**暴漏接口让renderer可以获取electron的配置 */
export function getElectronAppConfig() {
  return {
    appPath: electronUtil.getAppPath(),
    userDataPath: electronUtil.getUserDataPath(),
  };
}

/**获取当前应用版本号 */
export async function getAppSystemInfo() {
  return {
    version: app.getVersion(),
  };
}

/**重载应用 */
export function reLaunch() {
  app.relaunch();
  app.exit(0);
}

/**测试持续给renderer发消息 */
export function sendManyMsg2Render() {
  return (send) => {
    setInterval(() => {
      send({ timestamp: Date.now() });
    }, 3000);
  };
}

// 监听renderer回复ipcMain主动发出的消息
export function replyMain(data) {
  console.log('replyMain', data, 'event-handlers.ts::73行');
}

/**版本相关 */
// 持续监听版本更新中的信息
export function watchAutoUpdateInfo() {
  return (send) => {
    initVersionUpdater(send);
  };
}

// 检查更新
export function checkUpdateInfo() {
  checkAppVersion();
}

// 确认下载更新
export function downloadLatestApp() {
  downloadAppNow();
}

// 安装更新
export function installLatestApp() {
  installAppNow();
}

// webp2png
export async function webp2Png(config) {
  const { path: filePath } = config;

  // 平台：win32，darwin,linux
  const platform = process.platform;
  // 架构：arm，arm64，x64，ia32
  const arch = process.arch;

  // 获取处理程序路径
  const execName = platform === 'win32' ? 'dwebp.exe' : 'dwebp';
  const execProgramerPath = path.join(
    AppPath,
    `static/libs/libwebp/${platform}_${arch}/bin/${execName}`,
  );

  // 使用程序执行命令 dwebp input.webp -o output.png
  const fileBaseDir = path.dirname(filePath);
  const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
  const outDirPath = `${fileBaseDir}/png`;
  if (!fs.existsSync(outDirPath)) {
    fs.mkdirSync(outDirPath, { recursive: true });
  }
  const outFilePath = `${outDirPath}/${fileNameWithoutExt}.png`;
  const execCommand = `${execProgramerPath} "${filePath}" -o "${outFilePath}"`;
  console.log(execCommand, 'event-handlers.ts::126行');
  const result = await new Promise<any>((resolve) => {
    exec(execCommand, {}, (error, stdout, stderr) => {
      let _data = { result: false, resultPath: '' };
      if (error) {
        console.error(`脚本执行出错: ${error.message}`);
        resolve(_data);
        return;
      }
      if (stderr) {
        console.error(`脚本错误输出: ${stderr}`);
        resolve({ result: true, resultPath: outFilePath });
        return;
      }
      console.log(`脚本输出: ${stdout}`);
      resolve({ result: true, resultPath: outFilePath });
      return;
    });
  });
  return result;
}

export async function openFileOrDir({ filePath }) {
  shell.showItemInFolder(filePath);
}
