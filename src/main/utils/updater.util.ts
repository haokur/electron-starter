import { electronUtil } from "./electron.util";

const { autoUpdater } = require('electron-updater');

export function initElectronUpdater() {
    // 配置提供更新的程序，及build中配置的url
    autoUpdater.setFeedURL("https://oss.haokur.com/electron-app/")
    // 是否自动更新，如果为true，当可以更新时(update-available)自动执行更新下载。
    autoUpdater.autoDownload = false

    // 1. 在渲染进程里触发获取更新，开始进行更新流程。 (根据具体需求)
    autoUpdater.checkForUpdatesAndNotify();

    listenEvents()
}

// 将日志在渲染进程里面打印出来
function printUpdaterMessage(key, data = null) {
    let message = {
        updateError: "更新出错",
        checking: "正在检查更新",
        updateAvailable: "检测到新版本",
        downloadProgress: "下载中",
        updateNotAvailable: "无新版本",
        updateDownloaded: "下载完成"
    };
    electronUtil.sendMessage2Render("electronUpdaterMessage", {
        key: key,
        msg: message[key],
        data
    })
}

function listenEvents() {
    autoUpdater.on("error", function (error) {
        printUpdaterMessage('updateError', error);
    });

    // 2. 开始检查是否有更新
    autoUpdater.on("checking-for-update", function () {
        printUpdaterMessage('checking');
    });

    // 3. 有更新时触发
    autoUpdater.on("update-available", function (info) {
        // 4. 告诉渲染进程有更新，info包含新版本信息
        printUpdaterMessage('updateAvailable', info);
    });

    autoUpdater.on("update-not-available", function (info) {
        printUpdaterMessage('updateNotAvailable');
    });

    // 8. 下载进度，包含进度百分比、下载速度、已下载字节、总字节等
    // ps: 调试时，想重复更新，会因为缓存导致该事件不执行，下载直接完成，可找到C:\Users\40551\AppData\Local\xxx-updater\pending下的缓存文件将其删除（这是我本地的路径）
    autoUpdater.on("download-progress", function (progressObj) {
        printUpdaterMessage('downloadProgress', progressObj);
    });

    // 10. 下载完成，告诉渲染进程，是否立即执行更新安装操作
    autoUpdater.on("update-downloaded", function () {
        printUpdaterMessage('updateDownloaded');
    });
}

export function checkAppUpdateOnly(callback) {
    autoUpdater.checkForUpdates(callback);
}

/**检查版本 */
export function checkAppUpdate() {
    autoUpdater.checkForUpdatesAndNotify();
}

/**确认更新 */
export function updateAppNow() {
    console.log("开始下载更新包", "updater.util.ts::72行");
    autoUpdater.downloadUpdate()
}

/**确认安装 */
export function installAppNow() {
    autoUpdater.quitAndInstall();
}

