/**
 * electron主进程暴漏给render进程的方法扩展池：
 * 格式如下：定义一个异步方法，接受render传入的参数，方法内可以执行耗时操作，返回一个结果
 * export async function test(params){await xxx; return result}
 */
import fs from 'fs'
import path from 'path'
import { app } from 'electron';

import { electronUtil } from '../utils/electron.util';
import { checkAppUpdate, checkAppUpdateOnly, installAppNow, updateAppNow } from '../utils/updater.util';

/**创建文件夹 */
export async function mkdir(dirPath) {
    const userDataPath = app.getPath('userData');
    let _path = path.join(userDataPath, dirPath)
    fs.mkdirSync(_path)
    return `创建成功:${_path}`
}

/**只有development环境是默认为true */
let isDevtoolVisible = process.env.NODE_ENV === 'development'
/**打开开发者工具 */
export function toggleDevTools() {
    const currentWin: any = electronUtil.getCurrentWindow()
    isDevtoolVisible
        ? currentWin.closeDevTools()
        : currentWin.openDevTools()
    isDevtoolVisible = !isDevtoolVisible

    electronUtil.showNotice("切换成功~")
    return isDevtoolVisible
}

/**[test]测试main进程里的配置 */
export function testMainAppConfig() {
    let _config = electronUtil.getAppConfig()
    electronUtil.showNotice(JSON.stringify(_config.env))
}

/**暴漏接口让renderer可以获取electron的配置 */
export function getElectronAppConfig() {
    return {
        appPath: electronUtil.getAppPath(),
        userDataPath: electronUtil.getUserDataPath(),
    }
}

/**获取当前应用版本号 */
export async function getAppSystemInfo() {
    return {
        version: app.getVersion()
    }
}

/**electron-updater检查版本 */
export async function checkForUpdates() {
    // fs.readFileSync("./ssfadf.txt")
    let res = await new Promise((resolve, reject) => {
        checkAppUpdateOnly((result) => {
            resolve(result)
        })
    })
    return res
}

/**electron-updater检查版本(带消息通知) */
export async function checkForUpdatesAndNotify() {
    checkAppUpdate()
    return true
}

/**electron-updater确认下载 */
export async function electronUpdaterDownload() {
    updateAppNow()
    return true
}

/**electron-updater确认安装 */
export async function electronUpdaterInstall() {
    installAppNow()
    return true
}

/**重载应用 */
export function reLaunch() {
    app.relaunch()
    app.exit(0);
}